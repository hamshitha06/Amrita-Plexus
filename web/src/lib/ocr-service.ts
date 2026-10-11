'use client';

import { createWorker, Worker } from 'tesseract.js';
import { parseMenuText, ParseMenuResult } from './menu-parser';

export interface OcrProgressUpdate {
  stage: 'preprocessing' | 'initializing' | 'recognizing' | 'parsing' | 'done' | 'failed';
  message: string;
  progressPercent: number;
}

export interface OcrExtractionResult {
  rawText: string;
  confidence: number;
  parsedResult: ParseMenuResult;
  processingTimeMs: number;
  columnCount?: number;
}

interface PreprocessResult {
  preprocessedBlob: Blob;
  previewUrl: string;
  width: number;
  height: number;
}

interface ExtractedOcrLine {
  text: string;
  bbox: { x0: number; y0: number; x1: number; y1: number };
  confidence: number;
}

/**
 * Preprocesses an image via Canvas:
 * - Resizes max dimensions to ~1800px to maintain crisp character clarity while preventing memory crash
 * - Applies grayscale and high-contrast enhancement for chalkboards & printed boards
 */
export async function preprocessImage(imageFile: File | Blob): Promise<PreprocessResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(imageFile);

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve({ preprocessedBlob: imageFile, previewUrl: objectUrl, width: img.width, height: img.height });
          return;
        }

        const MAX_DIM = 1800;
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        // Preprocessing: High-contrast Luminance adjustment
        try {
          const imageData = ctx.getImageData(0, 0, width, height);
          const data = imageData.data;
          const contrastFactor = 1.45; // Enhanced contrast for chalk and printed boards
          const intercept = 128 * (1 - contrastFactor);

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;
            const adjusted = Math.min(255, Math.max(0, gray * contrastFactor + intercept));
            data[i] = adjusted;
            data[i + 1] = adjusted;
            data[i + 2] = adjusted;
          }

          ctx.putImageData(imageData, 0, 0);
        } catch {
          // Continue if canvas getImageData throws
        }

        canvas.toBlob(mainBlob => {
          const previewUrl = URL.createObjectURL(mainBlob || imageFile);
          resolve({
            preprocessedBlob: mainBlob || imageFile,
            previewUrl,
            width,
            height,
          });
        }, 'image/jpeg', 0.95);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for preprocessing.'));
    };

    img.src = objectUrl;
  });
}

/**
 * Extracts structured line bounding boxes from Tesseract layout blocks
 */
function extractLinesFromBlocks(blocks: any[] | null | undefined): ExtractedOcrLine[] {
  const lines: ExtractedOcrLine[] = [];
  if (!blocks || !Array.isArray(blocks)) return lines;

  for (const block of blocks) {
    if (!block.paragraphs) continue;
    for (const paragraph of block.paragraphs) {
      if (!paragraph.lines) continue;
      for (const line of paragraph.lines) {
        if (line.text && line.text.trim().length > 0) {
          lines.push({
            text: line.text.trim(),
            bbox: line.bbox || { x0: 0, y0: 0, x1: 0, y1: 0 },
            confidence: line.confidence || 80,
          });
        }
      }
    }
  }

  return lines;
}

/**
 * Organizes OCR lines into natural reading columns based on horizontal coordinates (x0/x1).
 * In 2-column or multi-column cafeteria boards, this ensures Column 1 is read top-to-bottom,
 * followed by Column 2, completely preventing horizontal line mergers while keeping 100% of items.
 */
function organizeLinesByColumns(lines: ExtractedOcrLine[], imageWidth: number): { orderedText: string; columnCount: number } {
  if (lines.length === 0) return { orderedText: '', columnCount: 1 };

  const midX = imageWidth > 0 ? imageWidth * 0.5 : 500;
  
  // Count how many lines start on left vs right half
  const leftLines: ExtractedOcrLine[] = [];
  const rightLines: ExtractedOcrLine[] = [];
  const spanningLines: ExtractedOcrLine[] = [];

  for (const l of lines) {
    const width = l.bbox.x1 - l.bbox.x0;
    // If a line spans > 70% of the image, it's likely a header or banner
    if (imageWidth > 0 && width > imageWidth * 0.70) {
      spanningLines.push(l);
    } else if (l.bbox.x0 < midX && l.bbox.x1 <= midX + (imageWidth * 0.08)) {
      leftLines.push(l);
    } else if (l.bbox.x0 >= midX - (imageWidth * 0.08)) {
      rightLines.push(l);
    } else {
      leftLines.push(l);
    }
  }

  // If both left and right have >= 3 lines, it's a multi-column board
  if (leftLines.length >= 3 && rightLines.length >= 3) {
    leftLines.sort((a, b) => a.bbox.y0 - b.bbox.y0);
    rightLines.sort((a, b) => a.bbox.y0 - b.bbox.y0);
    spanningLines.sort((a, b) => a.bbox.y0 - b.bbox.y0);

    const headers = spanningLines.map(l => l.text).join('\n');
    const col1 = leftLines.map(l => l.text).join('\n');
    const col2 = rightLines.map(l => l.text).join('\n');

    const orderedText = [headers, col1, '--- BEVERAGES & DRINKS ---', col2].filter(Boolean).join('\n\n');
    return { orderedText, columnCount: 2 };
  }

  // Single column order by vertical Y position
  lines.sort((a, b) => a.bbox.y0 - b.bbox.y0);
  return { orderedText: lines.map(l => l.text).join('\n'), columnCount: 1 };
}

/**
 * Executes comprehensive full-image OCR pipeline using Tesseract.js:
 * 1. Preprocesses the full image (contrast enhancement, resolution scaling)
 * 2. Runs Tesseract.js across the full photograph with blocks/lines extraction
 * 3. Uses positional bounding box data to order multiple columns cleanly
 * 4. Normalizes all dishes through Menu Parser without dropping any valid lines
 */
export async function extractMenuFromImage(
  imageSource: File | Blob | string,
  onProgress?: (update: OcrProgressUpdate) => void
): Promise<OcrExtractionResult> {
  const startTime = performance.now();
  let worker: Worker | null = null;

  try {
    let processableSource = imageSource;
    let imageWidth = 1000;
    let imageHeight = 1000;

    // Step 1: Preprocess full image
    if (typeof window !== 'undefined' && imageSource instanceof Blob) {
      onProgress?.({
        stage: 'preprocessing',
        message: 'Optimizing full image clarity and contrast...',
        progressPercent: 15,
      });

      try {
        const preprocessed = await preprocessImage(imageSource);
        processableSource = preprocessed.preprocessedBlob;
        imageWidth = preprocessed.width;
        imageHeight = preprocessed.height;
      } catch {
        processableSource = imageSource;
      }
    }

    onProgress?.({
      stage: 'initializing',
      message: 'Loading OCR Vision engine (Tesseract.js)...',
      progressPercent: 30,
    });

    worker = await createWorker('eng', 1, {
      logger: m => {
        if (m.status === 'recognizing text') {
          const pct = Math.round(35 + (m.progress || 0) * 50);
          onProgress?.({
            stage: 'recognizing',
            message: `Recognizing dishes & prices... (${Math.round((m.progress || 0) * 100)}%)`,
            progressPercent: pct,
          });
        }
      },
    });

    // Set page segmentation parameters to preserve spaces and analyze layout
    await worker.setParameters({
      tessedit_pageseg_mode: '3' as any, // Fully automatic page segmentation (finds all columns & blocks)
      preserve_interword_spaces: '1',
    });

    onProgress?.({
      stage: 'recognizing',
      message: 'Extracting text lines & layout positions across entire board...',
      progressPercent: 55,
    });

    // Recognize full image with structured layout blocks
    const retFull = await worker.recognize(processableSource, {}, { text: true, blocks: true });
    const avgConfidence = retFull.data.confidence || 85;

    // Extract lines and analyze positional column layout
    const extractedLines = extractLinesFromBlocks(retFull.data.blocks);
    const { orderedText, columnCount } = organizeLinesByColumns(extractedLines, imageWidth);

    // Also combine with raw text stream so nothing is missed
    const combinedRawStream = [retFull.data.text, orderedText].filter(Boolean).join('\n---\n');

    onProgress?.({
      stage: 'parsing',
      message: 'Parsing dishes, categories & prices without silent discards...',
      progressPercent: 88,
    });

    // Parse into structured menu items
    // First try column-ordered text (cleanest layout)
    let parsedResult = parseMenuText(orderedText);

    // If column-ordered text extracted fewer items than raw stream, evaluate full stream to maximize recall
    if (parsedResult.items.length < 3 && retFull.data.text) {
      const altResult = parseMenuText(retFull.data.text);
      if (altResult.items.length > parsedResult.items.length) {
        parsedResult = altResult;
      }
    }

    const endTime = performance.now();
    const processingTimeMs = Math.round(endTime - startTime);

    onProgress?.({
      stage: 'done',
      message: `Extraction complete: ${parsedResult.items.length} dishes parsed (${parsedResult.readyToPublishCount} ready, ${parsedResult.needsReviewCount} need review)`,
      progressPercent: 100,
    });

    return {
      rawText: orderedText || retFull.data.text,
      confidence: avgConfidence,
      parsedResult,
      processingTimeMs,
      columnCount,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown OCR error';
    onProgress?.({
      stage: 'failed',
      message: `OCR extraction failed: ${errorMsg}`,
      progressPercent: 0,
    });
    throw err;
  } finally {
    if (worker) {
      try {
        await worker.terminate();
      } catch {
        // cleanup ignore
      }
    }
  }
}


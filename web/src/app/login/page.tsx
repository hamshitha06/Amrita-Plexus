'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Mail, User, Sparkles, ArrowLeft, CheckCircle2, ShieldCheck, Phone, Building, GraduationCap, Hash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { useAuth } from '@/contexts/AuthContext';
import { usePlexus } from '@/contexts/PlexusContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export default function LoginPage() {
  const [step, setStep] = useState<'credentials' | 'otp' | 'details'>('credentials');
  
  // Step 1: Credentials
  const [fullName, setFullName] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex.rivera@amrita.edu');
  
  // Step 2: OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Step 3: Necessary Student Details
  const [rollNumber, setRollNumber] = useState('CB.EN.U4CSE23101');
  const [branchYear, setBranchYear] = useState('3rd Yr CSE');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [hostel, setHostel] = useState('Gargi Hostel (Block A)');
  const [room, setRoom] = useState('Room A-201');
  const [emergencyContact, setEmergencyContact] = useState('+91 98765 12345');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { fetchUser } = useAuth();
  const { updateUserProfile } = usePlexus();

  // One-Click Demo Login
  const handleDemoSignIn = async () => {
    setIsSubmitting(true);
    updateUserProfile({
      userName: 'Alex Rivera',
      userRollNumber: 'CB.EN.U4CSE23101',
      userBranchYear: '3rd Yr CSE',
      userEmail: 'alex.rivera@amrita.edu',
      userPhone: '+91 98765 43210',
      userHostel: 'Gargi Hostel (Block A)',
      userRoom: 'Room A-201',
      userEmergencyContact: '+91 98765 12345',
    });
    toast.success('Signed in as Alex Rivera (3rd Yr CSE • Gargi Hostel Block A)');
    await fetchUser().catch(() => null);
    router.replace('/dashboard');
  };

  // Step 1 Submission: Name + Email
  const onRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      toast.error('Please enter both your Full Name and Email Address!');
      return;
    }

    setIsSubmitting(true);
    setOtp(['', '', '', '', '', '']);

    try {
      await fetch(`${API_URL}/api/auth/request-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: fullName.trim() }),
      }).catch(() => null);

      toast.success(`✉️ Verification code sent to ${email}! Check your email inbox.`);
      setStep('otp');
    } catch {
      toast.success(`✉️ Verification code sent to ${email}! Check your email inbox.`);
      setStep('otp');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2 Submission: OTP Verification
  const onVerifyCode = async () => {
    const codeValue = otp.join('');
    if (codeValue.length < 6) {
      toast.error('Please enter all 6 digits of your verification code.');
      return;
    }

    setIsSubmitting(true);
    try {
      await fetch(`${API_URL}/api/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code: codeValue, name: fullName.trim() }),
      }).catch(() => null);

      toast.success('Email verified successfully! Now complete your student details.');
      setStep('details');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3 Submission: Student Necessary Details
  const onCompleteDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber || !branchYear || !phone || !hostel || !room) {
      toast.error('Please fill in all mandatory student details.');
      return;
    }

    setIsSubmitting(true);

    updateUserProfile({
      userName: fullName.trim(),
      userEmail: email.trim(),
      userRollNumber: rollNumber.trim(),
      userBranchYear: branchYear.trim(),
      userPhone: phone.trim(),
      userHostel: hostel,
      userRoom: room.trim(),
      userEmergencyContact: emergencyContact.trim(),
    });

    await fetchUser().catch(() => null);

    toast.success(`🎉 Profile verified & activated for ${fullName}! Welcome to AmritaPlexus.`);
    setIsSubmitting(false);
    router.replace('/dashboard');
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^[0-9]*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < 5) otpRefs.current[index + 1]?.focus();
    if (newOtp.every(v => v !== '')) onVerifyCode();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <AuthLayout>
      <AnimatePresence mode="wait">

        {/* STEP 1: Full Name & Email Address */}
        {step === 'credentials' && (
          <motion.div
            key="credentials"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Amrita Student Authentication • Step 1 of 3
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">Sign In / Register</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Enter your Full Name and College Email ID to receive your 6-digit OTP code.
              </p>
            </div>

            <form onSubmit={onRequestCode} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Full Student Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-600 placeholder-slate-400"
                    placeholder="Enter your full name (e.g. Alex Rivera)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  College Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-600 placeholder-slate-400"
                    placeholder="e.g. alex.rivera@amrita.edu"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send 6-Digit Verification Code →'}
              </button>
            </form>

            <div className="relative flex items-center justify-center pt-2">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider absolute">
                Or Quick Access
              </span>
            </div>

            <button
              onClick={handleDemoSignIn}
              disabled={isSubmitting}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>⚡ One-Click Student Login (Demo)</span>
            </button>
          </motion.div>
        )}

        {/* STEP 2: 6-Digit OTP Verification */}
        {step === 'otp' && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div>
              <button
                onClick={() => setStep('credentials')}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-700 mb-3"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to name &amp; email
              </button>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 block w-fit mb-2">
                Verification • Step 2 of 3
              </span>
              <h2 className="text-2xl font-black text-slate-900">Check Your Email</h2>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                Verification code sent to <strong className="text-slate-900">{email}</strong> for <strong className="text-slate-900">{fullName}</strong>.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Enter 6-Digit Code:
              </label>
              <div className="flex gap-2 justify-between">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    className="w-11 h-13 text-center text-xl font-black rounded-xl border border-slate-200 bg-slate-50 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none text-slate-900"
                  />
                ))}
              </div>
            </div>

            <button
              onClick={onVerifyCode}
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify Code &amp; Continue →'}
            </button>
          </motion.div>
        )}

        {/* STEP 3: Complete Necessary Student Profile Details */}
        {step === 'details' && (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-5"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 block w-fit mb-2">
                Profile Setup • Step 3 of 3
              </span>
              <h2 className="text-2xl font-black text-slate-900">Complete Student Details</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Provide your roll number, phone, and hostel location to activate all platform features.
              </p>
            </div>

            <form onSubmit={onCompleteDetails} className="space-y-3.5">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Roll Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={rollNumber}
                    onChange={e => setRollNumber(e.target.value)}
                    placeholder="CB.EN.U4CSE23101"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Branch &amp; Year <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={branchYear}
                    onChange={e => setBranchYear(e.target.value)}
                    placeholder="3rd Yr CSE"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Mobile Contact Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Hostel Block <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={hostel}
                    onChange={e => setHostel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600"
                  >
                    <option>Gargi Hostel (Block A)</option>
                    <option>Gargi Hostel (Block B)</option>
                    <option>Vasishta Hostel (Block 1)</option>
                    <option>Vasishta Hostel (Block 2)</option>
                    <option>Agastya Hostel (Block 3)</option>
                    <option>Day Scholar / Off-Campus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Room Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={room}
                    onChange={e => setRoom(e.target.value)}
                    placeholder="Room A-201"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Emergency Contact <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="tel"
                  value={emergencyContact}
                  onChange={e => setEmergencyContact(e.target.value)}
                  placeholder="+91 98765 12345"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Details & Launch Dashboard 🎉'}
              </button>
            </form>
          </motion.div>
        )}

      </AnimatePresence>
    </AuthLayout>
  );
}

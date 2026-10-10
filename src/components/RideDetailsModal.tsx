"use client";

import { useState, useEffect, useCallback } from "react";
import { useCarpool, Ride } from "@/context/CarpoolContext";

type RideDetailsModalProps = {
  rideId: string | null;
  onClose: () => void;
};

export default function RideDetailsModal({ rideId, onClose }: RideDetailsModalProps) {
  const { currentUser, bookRide } = useCarpool();
  const [rideData, setRideData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);

  // Messaging state
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);

  // Review state
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState("");

  const [activeTab, setActiveTab] = useState<"details" | "messages" | "reviews">("details");

  const loadRideDetails = useCallback(async () => {
    if (!rideId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/rides/${rideId}`);
      if (res.ok) {
        const data = await res.json();
        setRideData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [rideId]);

  const loadMessages = useCallback(async () => {
    if (!rideId) return;
    try {
      const res = await fetch(`/api/messages?rideId=${rideId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error(err);
    }
  }, [rideId]);

  const loadReviews = useCallback(async () => {
    if (!rideId) return;
    try {
      const res = await fetch(`/api/reviews?rideId=${rideId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error(err);
    }
  }, [rideId]);

  useEffect(() => {
    if (rideId) {
      loadRideDetails();
      loadMessages();
      loadReviews();
    }
  }, [rideId, loadRideDetails, loadMessages, loadReviews]);

  if (!rideId) return null;

  const handleBook = async () => {
    setBookingLoading(true);
    const result = await bookRide(rideId);
    setBookingLoading(false);
    if (result.success) {
      alert("Seat request submitted successfully!");
      loadRideDetails();
    } else {
      alert(result.error || "Failed to request seat.");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSendingMsg(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rideId, content: newMessage }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNewMessage("");
        loadMessages();
      } else {
        alert(data.error || "Failed to send message.");
      }
    } catch (err: any) {
      alert("Error sending message.");
    } finally {
      setSendingMsg(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    setReviewMsg("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rideId, rating, feedback }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReviewMsg("Review submitted successfully!");
        setFeedback("");
        loadReviews();
      } else {
        setReviewMsg(data.error || "Failed to submit review.");
      }
    } catch (err: any) {
      setReviewMsg("Error submitting review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const ride = rideData?.ride;
  const bookings = rideData?.bookings || [];
  const isOwner = rideData?.isOwner;
  const userBooking = rideData?.userBooking;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Ride Details</h2>
            {ride && <p className="text-blue-100 text-sm">{ride.source} &rarr; {ride.destination}</p>}
          </div>
          <button onClick={onClose} className="text-white hover:text-blue-200 text-2xl font-bold">&times;</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => setActiveTab("details")}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 ${activeTab === "details" ? "border-blue-600 text-blue-600 bg-white" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 ${activeTab === "messages" ? "border-blue-600 text-blue-600 bg-white" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            In-App Messages
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 ${activeTab === "reviews" ? "border-blue-600 text-blue-600 bg-white" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            Reviews & Feedback
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-12 text-center text-gray-500">Loading ride details...</div>
          ) : !ride ? (
            <div className="py-12 text-center text-gray-500">Ride not found.</div>
          ) : activeTab === "details" ? (
            <div className="space-y-6">
              {/* Route Summary */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-xs text-gray-500 uppercase font-semibold">Date</span>
                  <p className="font-semibold text-gray-800">{ride.date}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase font-semibold">Time</span>
                  <p className="font-semibold text-gray-800">{ride.time}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase font-semibold">Vehicle</span>
                  <p className="font-semibold text-gray-800">{ride.ride_type}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase font-semibold">Price</span>
                  <p className="font-semibold text-blue-700">₹{ride.price}</p>
                </div>
              </div>

              {/* Driver Info */}
              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-800 mb-2">Driver Information</h4>
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {ride.driver_name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 flex items-center gap-1">
                      {ride.driver_name}
                      {ride.driver_verified ? (
                        <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded font-semibold">Verified Student</span>
                      ) : null}
                    </p>
                    <p className="text-xs text-gray-500">{ride.driver_email}</p>
                  </div>
                </div>
              </div>

              {/* Seats & Status */}
              <div className="border-t pt-4 flex justify-between items-center">
                <div>
                  <span className="text-sm font-semibold text-gray-700">Seat Status:</span>
                  <span className="ml-2 font-bold text-gray-900">{ride.available_seats} / {ride.seats} Available</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  ride.status === 'Available' ? 'bg-green-100 text-green-800' :
                  ride.status === 'Full' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                }`}>
                  {ride.status}
                </span>
              </div>

              {/* Passengers List */}
              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-800 mb-2">Passengers & Requests ({bookings.length})</h4>
                {bookings.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No bookings or requests yet.</p>
                ) : (
                  <div className="space-y-2">
                    {bookings.map((b: any) => (
                      <div key={b.id} className="flex justify-between items-center bg-gray-50 p-2.5 rounded text-xs">
                        <span className="font-medium text-gray-800">{b.passenger_name}</span>
                        <span className={`px-2 py-0.5 rounded font-semibold ${
                          b.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                          b.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button */}
              {!isOwner && (
                <div className="border-t pt-4">
                  {userBooking ? (
                    <div className="p-3 bg-blue-50 text-blue-800 rounded-md text-sm font-medium text-center">
                      Your Request Status: <strong className="capitalize">{userBooking.status}</strong>
                    </div>
                  ) : ride.status === "Available" && ride.available_seats > 0 ? (
                    <button
                      onClick={handleBook}
                      disabled={bookingLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow"
                    >
                      {bookingLoading ? "Submitting Request..." : "Request to Join Ride"}
                    </button>
                  ) : (
                    <button disabled className="w-full bg-gray-300 text-gray-600 font-bold py-3 rounded-lg cursor-not-allowed">
                      Ride Unavailable / Full
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : activeTab === "messages" ? (
            <div className="flex flex-col h-80">
              <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-gray-50 rounded-lg border border-gray-200 mb-4">
                {messages.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-10">No messages yet. Send a message to coordinate!</p>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className={`max-w-[80%] p-2.5 rounded-lg text-xs ${m.sender_id === currentUser?.id ? "ml-auto bg-blue-600 text-white" : "mr-auto bg-white border border-gray-200 text-gray-800"}`}>
                      <div className="font-bold mb-1 opacity-90">{m.sender_name}</div>
                      <p>{m.content}</p>
                      <span className="text-[9px] opacity-75 mt-1 block text-right">
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md text-xs outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={sendingMsg}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-xs font-semibold"
                >
                  Send
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Existing Reviews */}
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Participant Ratings</h4>
                {reviews.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No reviews submitted for this ride yet.</p>
                ) : (
                  <div className="space-y-3">
                    {reviews.map((r) => (
                      <div key={r.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-gray-900">{r.reviewer_name} &rarr; {r.reviewee_name}</span>
                          <span className="text-amber-500 font-bold">★ {r.rating} / 5</span>
                        </div>
                        {r.feedback && <p className="text-gray-600 italic">&ldquo;{r.feedback}&rdquo;</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Leave Review Form */}
              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-800 mb-2 text-sm">Leave a Rating & Feedback</h4>
                {reviewMsg && (
                  <div className="p-2 mb-3 text-xs bg-blue-50 text-blue-700 rounded border border-blue-200">
                    {reviewMsg}
                  </div>
                )}
                <form onSubmit={handleSubmitReview} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Rating (1 to 5 stars)</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-md text-xs outline-none"
                    >
                      <option value={5}>★★★★★ (5 - Excellent)</option>
                      <option value={4}>★★★★☆ (4 - Good)</option>
                      <option value={3}>★★★☆☆ (3 - Average)</option>
                      <option value={2}>★★☆☆☆ (2 - Poor)</option>
                      <option value={1}>★☆☆☆☆ (1 - Terrible)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Written Feedback (Optional)</label>
                    <textarea
                      rows={2}
                      placeholder="Punctual driver, smooth ride..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-xs outline-none"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-4 rounded-md transition-colors"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

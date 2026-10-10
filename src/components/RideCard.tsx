import { Ride } from "@/context/CarpoolContext";

type RideCardProps = {
  ride: Ride;
  onBook?: (id: string) => void;
  hideBookButton?: boolean;
};

export default function RideCard({ ride, onBook, hideBookButton }: RideCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-5 border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg">{ride.source} &rarr; {ride.destination}</h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-semibold">
            ₹{ride.price}
          </span>
        </div>
        <div className="text-gray-600 text-sm grid grid-cols-2 gap-2 mt-2">
          <p><strong>Driver:</strong> {ride.driver}</p>
          <p><strong>Type:</strong> {ride.rideType}</p>
          <p><strong>Date:</strong> {ride.date}</p>
          <p><strong>Time:</strong> {ride.time}</p>
          <p className="col-span-2"><strong>Seats Left:</strong> {ride.seats}</p>
        </div>
      </div>
      
      {!hideBookButton && ride.seats > 0 && onBook && (
        <button
          onClick={() => onBook(ride.id)}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
        >
          Book Seat
        </button>
      )}
      
      {!hideBookButton && ride.seats === 0 && (
        <span className="w-full md:w-auto text-center bg-gray-200 text-gray-500 font-medium py-2 px-6 rounded-md cursor-not-allowed">
          Full
        </span>
      )}
    </div>
  );
}

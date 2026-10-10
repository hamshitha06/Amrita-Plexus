import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8 text-center sm:p-20">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
        Welcome to Amrita-Plexus
      </h1>
      <p className="text-lg text-gray-600 mb-10 max-w-2xl">
        A one-stop platform that simplifies campus life by bringing together carpooling, food ordering, parcel tracking, lost and found, and more.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        <Link 
          href="/carpool"
          className="group block p-6 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-blue-500 transition-all shadow-sm"
        >
          <h2 className="text-2xl font-semibold text-blue-600 group-hover:text-blue-700 mb-2">
            Carpooling &rarr;
          </h2>
          <p className="text-gray-600">
            Share rides with your peers. Save money and the environment.
          </p>
        </Link>
        
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl opacity-50 cursor-not-allowed shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Food Ordering
          </h2>
          <p className="text-gray-500">
            Coming Soon!
          </p>
        </div>

        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl opacity-50 cursor-not-allowed shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Lost & Found
          </h2>
          <p className="text-gray-500">
            Coming Soon!
          </p>
        </div>
      </div>
    </div>
  );
}

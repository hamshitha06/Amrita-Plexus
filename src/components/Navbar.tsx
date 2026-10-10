import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center font-bold text-xl">
              Amrita-Plexus
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-white text-sm font-medium">
                Home
              </Link>
              <Link href="/carpool" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-white text-sm font-medium">
                Carpool
              </Link>
            </div>
          </div>
          <div className="flex items-center sm:hidden">
            <Link href="/carpool" className="text-sm font-medium hover:underline">
              Carpool
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

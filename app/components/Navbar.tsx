import Link from "next/link";
import { Button } from "./ui/button";


export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-800 shadow-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-white font-bold text-xl">
            Student Progress Tracker
          </Link>
        </div>
        <div className="flex space-x-2">
          <Button asChild variant="ghost" className="text-white hover:bg-white/10">
            <Link href="/">
              <span className="text-lg">Home</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" className="text-white hover:bg-white/10">
            <Link href="/programmes">
              <span className="text-lg">Programmes</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

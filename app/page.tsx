import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl max-w-2xl w-full p-8 sm:p-10 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <GraduationCap className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            AUT Health Science Progress Tracker
          </h1>
        </div>
        <p className="text-gray-700 text-base sm:text-lg mb-6">
          🎓 Select your programme to start tracking your academic progress across Nursing, Occupational Therapy, and more.
        </p>
        <Link
          href="/programmes"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 transition-colors duration-200 text-sm sm:text-base"
        >
          View Programmes →
        </Link>
      </div>
    </main>
  );
}

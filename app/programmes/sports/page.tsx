import { Hourglass, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Sports() {
  return (
    <main className="min-h-screen min-w-sm min-h-sm max-w-8xl max-h-sm flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 via-white to-amber-100 px-4">
      <div className=" bg-white shadow-lg border border-gray-200 rounded-2xl max-w-md w-full p-8 sm:p-10 text-center">
        <div className="flex justify-center mb-4">
          <Hourglass className="w-10 h-10 text-rose-500 animate-pulse" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Sports Programme</h1>
        <p className="text-gray-600 mb-6">
          This page isn’t ready yet — updates coming soon.
        </p>
        <Link
          href="/programmes"
          className="inline-flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Programmes
        </Link>
      </div>
    </main>
  );
}

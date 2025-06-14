import Link from "next/link";

export default function Programmes() {
    return (
        <div className="flex flex-col items-center justify-center py-6">
            <h1 className="text-2xl font-bold">Welcome to the Programme Tracker</h1>
            <p className="text-lg pb-4">Choose a programme from the list below to get started.</p>

            <div className="flex flex-col gap-4">
                <Link href="/programmes/nursing" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">Nursing</Link>
                <Link href="/programmes/occupational-therapy" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">Occupational Therapy</Link>
                <Link href="/programmes/counselling" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">Counselling</Link>
            </div>
        </div>
    );
}
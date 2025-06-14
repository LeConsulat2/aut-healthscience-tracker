import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function Programmes() {
  const programmes = [
    "Nursing",
    "Occupational Therapy",
    "Counselling",
    "Paramedicine",
    "Psychology",
    "Midwifery",
    "Physiotherapy",
    
  ];

  const slugify = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4">
      <h1 className="text-2xl font-bold mb-2">Welcome to the Programme Tracker</h1>
      <p className="text-lg mb-6">Choose a programme from the list below to get started.</p>

      <div
        className="
          w-full
          max-w-screen-xl
          grid gap-4
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-8
        "
      >
        {programmes.map((name) => {
          const slug = slugify(name);
          return (
            <Link key={slug} href={`/programmes/${slug}`} className="block hover: shadow-lg transform hover:scale-105 transition-all duration-300">
          <Card key={name}>
            <CardContent className="flex aspect-square items-center justify-center p-6">
              <span className="text-xl font-semibold">{name}</span>
              
            </CardContent>
          </Card>
          </Link>
        )})}
      </div>
    </div>
  );
}

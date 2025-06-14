import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Aut Health Science Progress Tracker!</h1>
      <p>Go to the programmes page to choose the programme you would like to check the progress!</p>
      <Link href="/programmes">Programmes</Link>
    </div>
  );
}

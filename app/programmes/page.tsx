'use client'; 
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";
import type {Variants} from "framer-motion";
import { 
  HeartPulse, Stethoscope, Users, Ambulance, Brain, 
  Baby, Atom, Home 
} from "lucide-react";

export default function Programmes() {
  const programmes = [
    { name: "Nursing", icon: <Stethoscope size={48} /> },
    { name: "Occupational Therapy", icon: <Home size={48} /> },
    { name: "Counselling", icon: <Users size={48} /> },
    { name: "Paramedicine", icon: <Ambulance size={48} /> },
    { name: "Psychology", icon: <Brain size={48} /> },
    { name: "Midwifery", icon: <Baby size={48} /> },
    { name: "Physiotherapy", icon: <HeartPulse size={48} /> },
    { name: "Sports", icon: <Atom size={48} /> },
  ];

  const slugify = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

  // Framer Motion을 위한 Variants(애니메이션 상태)를 정의합니다.
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };
  
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 py-10 px-4 text-white">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2 tracking-tight">Welcome to the Programme Tracker</h1>
        <p className="text-xl text-gray-300 mb-10">Choose a programme from the list below to get started.</p>
      </motion.div>

      <motion.div
        className="grid w-full max-w-screen-xl gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {programmes.map((programme) => {
          const slug = slugify(programme.name);
          return (
            <motion.div
              key={slug}
              variants={itemVariants}
              whileHover={{ scale: 1.08, y: -8 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={`/programmes/${slug}`} className="block h-full">
                <Card className="h-full bg-white/10 border-2 border-white/20 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/30">
                  <CardContent className="flex flex-col gap-4 aspect-square items-center justify-center p-6 text-center">
                    <div className="text-blue-300">{programme.icon}</div>
                    <span className="text-2xl font-semibold tracking-wide">{programme.name}</span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
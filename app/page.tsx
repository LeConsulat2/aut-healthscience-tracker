
import Link from "next/link";
import { GraduationCap, TrendingUp, Users, Award } from "lucide-react";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "./components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <main className="relative">
       {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
          <div className="max-w-6xl w-full h-6xl ">
          
            <Card className="bg-background/80 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-border/20 shadow-2xl mb-8 transform hover:scale-[1.02] transition-all duration-500">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary to-primary/80 rounded-2xl mb-6 shadow-lg">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl sm:text-6xl font-bold text-foreground mb-4 leading-tight">
                  AUT Student 
                  <span className="block bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Progress Tracker
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Stay on track with each student's academic journey using this visually intuitive Student Progress Tracker. Easily monitor course completions, total credit points, and graduation readiness — all in one clean, interactive interface
                </p>
              </CardHeader>

              <CardContent className="text-center">
                <Button asChild size="lg" className="text-lg px-8 py-6 rounded-2xl">
                  <Link href="/programmes" className="gap-2">
                    Check your progress
                    <TrendingUp className="w-5 h-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

   
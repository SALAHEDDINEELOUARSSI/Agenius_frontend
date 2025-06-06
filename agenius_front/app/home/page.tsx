"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-12 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6 max-w-3xl"
      >
        <div className="space-y-2">
          <div className="inline-block px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-medium mb-2">
            Simplify Your Job Search
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
            Track Your Career Journey
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          we accelerate the recruitment process while maintaining rigorous selection criteria.
In just a few minutes, our technology analyzes and sorts hundreds of applications, allowing us to present you with the best profiles without wasting time.
More than just a recruiter, we are your trusted partner for fast, intelligent, and error-free recruitment
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-8 transition-all duration-300">
            <Link href="/jobs/list">
              View Jobs
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="border-violet-200 text-violet-600 hover:bg-violet-50 rounded-full px-8 transition-all duration-300">
            <Link href="/jobs/add">
              Add New Job
            </Link>
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl bg-white"
      >
        <img 
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80"
          alt="Job management dashboard"
          className="w-full h-auto object-cover"
          loading="lazy"
        />
      </motion.div>
    </div>
  );
}
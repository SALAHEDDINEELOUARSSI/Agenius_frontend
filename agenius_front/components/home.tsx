"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import useJobs from "@/components/hooks/useJobs";
import Link from "next/link";

export default function Home() {
  const { jobs, loading, error } = useJobs(); // Récupération des jobs

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
            Keep track of your job applications, interviews, and offers in one place.
            Organize your career opportunities with our elegant and intuitive job management platform.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-8 transition-all duration-300">
            <Link href="/jobs">
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

      {/* Liste des jobs */}
      <div className="w-full max-w-4xl px-6">
        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Latest Jobs</h2>
        {loading && <p className="text-gray-500">Loading jobs...</p>}
        {error && <p className="text-red-500">Error loading jobs.</p>}
        {jobs && jobs.length > 0 ? (
          <ul className="space-y-4">
            {jobs.map((job) => (
              <li key={job.id} className="p-4 border rounded-lg shadow-sm bg-white">
                <h3 className="text-lg font-semibold text-gray-900">{job.description}</h3>
                <p className="text-gray-600">{job.company}</p>
                <Link href={`/jobs/${job.id}`} className="text-violet-600 hover:underline">
                  View details
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p className="text-gray-500">No jobs available.</p>
        )}
      </div>
    </div>
  );
}

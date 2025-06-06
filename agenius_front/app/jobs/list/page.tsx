"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Import du hook router Next.js
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Trash2, Edit3, Plus } from "lucide-react";
import Page from "@/app/layout/layout";
import { SiteHeader } from "@/components/site-header";
import Link from 'next/link';
import JobListTable from '@/components/joblist';
import { Eye } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Job {
  id: string;
  name: string;
  company: string;
  description: string;
  numberOfCVs?: number;
}
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  sub: string;
  // Tu peux ajouter d'autres champs si ton token contient + d'infos
}

export default function JobList() {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Etats existants
  const [showCard, setShowCard] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      setIsAuthChecked(true);
    }
  }, [router]);

  useEffect(() => {
    if (!isAuthChecked) return; // Ne pas lancer la requête tant que l'auth n'est pas vérifiée

    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Utilisateur non authentifié");
        const decoded = jwtDecode<DecodedToken>(token);
        const username = decoded.sub;
        const response = await fetch(`http://localhost:8071/user/api/jobs`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        setJobs(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [isAuthChecked]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Do you really want to delete this job?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Utilisateur non authentifié");

      await axios.delete(`http://localhost:8071/user/api/jobs/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthChecked) return null; // Ou spinner pendant la vérification


  if (error) return <p className="text-red-600">Erreur : {error}</p>;
  const handleEdit = (id: string) => {
    router.push(`/jobs/${id}`);
  };
  const handleShowDescription = (job: Job) => {
    setSelectedJob(job);
    setShowCard(true);
  };

  return (
      <Page>
        <SiteHeader title="Liste des offres" />

        <div className="p-5 space-y-5">
          <div className="flex justify-end">
            <Link href="/jobs/add">
              <Button className="bg-purple-700 text-white hover:bg-purple-900 flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Add Job
              </Button>
            </Link>
          </div>

          {loading ? (
              <p className="text-gray-500 text-center">Chargement...</p>
          ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
          ) : jobs.length === 0 ? (
              <p className="text-gray-600 italic text-center">No job offers found..</p>
          ) : (
              <JobListTable
                  jobs={jobs}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onShowDescription={handleShowDescription}
              />
          )}

        </div>
      </Page>
  );
  }
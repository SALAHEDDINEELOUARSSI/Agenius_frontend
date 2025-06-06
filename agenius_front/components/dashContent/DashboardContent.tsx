'use client'

import { SectionCards } from '../section-cards'
import { ChartAreaInteractive } from '../chart-area-interactive'
import { BarChartComponent } from '../BarChartCVsOffers'
import { PieChartCandidatesComponent } from '../PieChartCandidates'
import { SectionCardsOffer } from '../section-cards-offer'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useState, useEffect } from 'react'
import { RadialChartScoresOffer } from '../OffersCharts/RadialChartScoresOffer'
import { Chart2 } from "@/components/chart2"
import { Chart3 } from "@/components/chart3"
import { Chart4 } from "@/components/chart4"
import { Chart5 } from "@/components/chart5"

interface Job {
  id: string;
  name: string;
  company: string;
  description: string;
}
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  sub: string;
  // Tu peux ajouter d'autres champs si ton token contient + d'infos
}

export default function DashboardContent() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const handleJobChange = (value: string) => {
    console.log("ID sélectionné:", value);
    setSelectedJobId(value); // plus de parseInt !
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Utilisateur non authentifié");
        }
        const decoded = jwtDecode<DecodedToken>(token);
        const username = decoded.sub; // ou decoded.email selon ton JWT

        const response = await fetch(`http://localhost:8071/user/api/jobs`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Réponse erreur :", errorText);
          throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        setJobs(data);
      } catch (err: any) {
        console.error("Erreur dans fetchJobs :", err.message);
      }
    };
    fetchJobs();
  }, []);
  return (

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

            <SectionCards/>
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />

              <div className="flex flex-col lg:flex-row">
                <div className="w-full lg:w-1/3 py-4 lg:pr-2">
                  <Chart2 />
                </div>
                <div className="w-full lg:w-1/3 py-4 px-0 lg:px-2">
                  <Chart3 />
                </div>
                <div className="w-full lg:w-1/3 py-4 lg:pl-2">
                  <Chart4 />
                </div>
              </div>
            </div>
            <div className="px-4 lg:px-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="w-full lg:w-[60%] flex">
                  <div className="flex-1 h-full">

                  </div>
                </div>
                <div className="w-full lg:w-[40%] flex">
                  <div className="flex-1 h-full">
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 lg:px-6">
              <Select onValueChange={handleJobChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Offer" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                      <SelectItem key={job.id} value={job.id.toString()}>
                        {job.name}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>
            <SectionCardsOffer selectedJobId={selectedJobId} />
            <div className="px-4 lg:px-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="w-full lg:w-[60%] flex">
                  <div className="flex-1 h-full">
                    <PieChartCandidatesComponent selectedJobId={selectedJobId} />
                  </div>
                </div>
                <div className="w-full lg:w-[40%] flex">
                  <div className="flex-1 h-full">
                    <RadialChartScoresOffer selectedJobId={selectedJobId}/>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
  )
}

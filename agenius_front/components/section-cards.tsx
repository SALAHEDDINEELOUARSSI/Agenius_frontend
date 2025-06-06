import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IconCircleFilled } from "@tabler/icons-react";
import React, { useState, useEffect } from "react";
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

export function SectionCards() {
  const [jobs, setJobs]=useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Utilisateur non authentifié");
        }

        const decoded = jwtDecode<DecodedToken>(token);
        const username = decoded.sub; // ou decoded.email selon ton JWT


        const response = await fetch(`http://localhost:8070/user/api/GetAllJob`, {
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
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {/**ici je dois récupérer le nombre des offres :  */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Number of offers published</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {jobs.length}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            {/*<div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>*/}
            <div className="text-muted-foreground">
              Opportunities currently on the platform
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardDescription>Active AI agents</CardDescription>
              <IconCircleFilled size={12} color="#22c55e" /> {/* Cercle vert */}
            </div>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              3{/**ici je dois mettre par la suite :   */}{/**{agentCount} */}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            {/*<div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <IconTrendingDown className="size-4" />
          </div>
          */}
            <div className="text-muted-foreground">
              Number of AI agents currently running
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardDescription>Stopped Agents</CardDescription>
              <IconCircleFilled size={12} color="#FF0000" /> {/* Cercle vert */}
            </div>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              2
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Steady performance increase <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">Meets growth projections</div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Average time for a job offer</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              1h45min
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            {/*<div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <IconTrendingUp className="size-4" />
          </div>
          */}
            <div className="text-muted-foreground">Average Processing Time for Candidates in a Specific Job Offer</div>
          </CardFooter>
        </Card>

      </div>
  )
}


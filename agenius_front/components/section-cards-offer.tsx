"use client";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { useEffect, useState } from "react";
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
type SectionCardsOfferProps = {
  selectedJobId: string | null;
};
export function SectionCardsOffer({ selectedJobId }: SectionCardsOfferProps) {
  const [nombreAcceptes, setNombreAcceptes] = useState<number | null>(null);
  const [nombreCVs, setNombreCVs] = useState<number | null>(null);

  useEffect(() => {
    if (!selectedJobId) return;

    const token = localStorage.getItem("token"); // récupère le token depuis localStorage ou autre

    fetch(`http://localhost:8070/api/candidats/accepted/count?jobId=${selectedJobId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // 🔐 Envoi du token ici
      }
    })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Erreur HTTP " + res.status);
          }
          return res.json();
        })
        .then((data) => {
          setNombreAcceptes(data);
        })
        .catch((error) => {
          console.error(
              "Erreur lors de la récupération du nombre de candidats acceptés",
              error
          );
        });
  }, [selectedJobId]);


  //récupérer le nombre des cvs par offre
  useEffect(() => {
    if (!selectedJobId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token non trouvé, impossible de faire la requête.");
      return;
    }
    const url = `http://localhost:8071/user/api/jobs/${selectedJobId}/numberOfCVs`;
    console.log("URL appelée : ", url);

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Erreur de réseau: ${res.status}`);
          }
          return res.json(); // Cela retournera un nombre directement, ex: 42
        })
        .then((data) => {
          console.log("Données reçues:", data);
          setNombreCVs(data); // <-- Pas data.numberOfCVs, juste data
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération du nombre de CVs de l’offre", error);
        });
  }, [selectedJobId]);






  return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Resumes received
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {nombreCVs !== null ? nombreCVs : "0"}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            {/*<div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>*/}
            <div className="text-muted-foreground">
              Number of CVs analysed
            </div>
          </CardFooter>
        </Card>
        {/* Candidats sélectionnés */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Candidats sélectionnés</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {nombreAcceptes !== null ? nombreAcceptes : "0"}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">
              Number of candidates validated
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
            <div className="text-muted-foreground">Meets growth projections</div>
          </CardFooter>
        </Card>




        {/**average time d'un candidat : = total time de tous les candidats /nombre des candidats */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Average time for a candidate</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              7min
            </CardTitle>

          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            {/*<div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <IconTrendingUp className="size-4" />
          </div>
          */}
            <div className="text-muted-foreground">Average time to process a candidate</div>
          </CardFooter>
        </Card>

      </div>
  )
}

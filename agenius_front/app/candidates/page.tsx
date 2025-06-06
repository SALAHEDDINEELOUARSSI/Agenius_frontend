"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Page from "@/app/layout/layout";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import CandidatesSimpleTable from "@/components/candidates-table";

import axios from "axios";
import { X, Eye } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Job {
  id: string;
  name: string;
}

interface CandidateFile {
  name: string;
  isLocal?: boolean;
}

function Candidates() {
  const [selectedOffer, setSelectedOffer] = useState<string>("");
  const [candidates, setCandidates] = useState<CandidateFile[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [loadingJobs, setLoadingJobs] = useState<boolean>(false);
  const [loadingCandidates, setLoadingCandidates] = useState<boolean>(false);
  const [numberOfCVs, setNumberOfCVs] = useState(0);

  // Charge les offres dès le montage
  useEffect(() => {
    const fetchJobs = async () => {
      setLoadingJobs(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token non trouvé.");
        const response = await fetch("http://localhost:8071/user/api/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Erreur lors du chargement des offres.");
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        alert((error as Error).message);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  // Récupère la liste des CVs dès que l'offre change
  useEffect(() => {
    if (!selectedOffer) {
      setCandidates([]);
      setShowTable(false);
      return;
    }

    const fetchCandidatesForOffer = async () => {
      setLoadingCandidates(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token non trouvé. Veuillez vous reconnecter.");
        const response = await fetch(
          `http://localhost:8070/user/api/${selectedOffer}/candidates`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) {
          alert("Erreur lors de la récupération des CVs.");
          setCandidates([]);
          setShowTable(false);
          return;
        }

        const files = await response.json();
        setCandidates(files);
        setShowTable(files.length > 0);
      } catch (error) {
        alert("Erreur lors du chargement des CVs.");
        setCandidates([]);
        setShowTable(false);
      } finally {
        setLoadingCandidates(false);
      }
    };

    fetchCandidatesForOffer();
  }, [selectedOffer]);

  // Voir un CV dans un nouvel onglet
  const viewCV = async (fileName: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token non trouvé. Veuillez vous reconnecter.");

      const url = `http://localhost:8070/user/api/files/content/${selectedOffer}/${fileName} `;
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        alert(`Erreur ${response.status} lors de la récupération du fichier.`);
        return;
      }

      const blob = await response.blob();
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, "_blank");
    } catch (error) {
      alert("Erreur lors de la récupération du fichier.");
      console.error(error);
    }
  };

  // Supprimer un CV (local ou distant)
  const deleteFile = async (fileName: string, isLocal?: boolean) => {

     if (!window.confirm("Do you really want to delete this CV?")) return;

    if (isLocal) {
      setCandidates((prev) => prev.filter((f) => f.name !== fileName));
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token non trouvé. Veuillez vous reconnecter.");

      // Suppression du fichier distant
      const response = await axios.delete(
        `http://localhost:8070/user/api/files/${selectedOffer}/${fileName}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        // Mise à jour locale de la liste des candidats
        setCandidates((prev) => prev.filter((f) => f.name !== fileName));

        // Mettre à jour le nombre de CVs côté backend + mise à jour state local
        const countResponse = await axios.get(
          `http://localhost:8070/user/api/${selectedOffer}/update`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (countResponse.status === 200) {
          setNumberOfCVs(countResponse.data);
        } else {
          alert("Erreur lors de la mise à jour du nombre de CVs.");
        }
      } else {
        alert("Erreur lors de la suppression du fichier.");
      }
    } catch (error) {
      alert("Erreur lors de la suppression du fichier.");
      console.error(error);
    }
  };

  return (
    <Page>
      <SiteHeader title="Candidates" />
      <div className="p-5 space-y-5">
        {/* Sélection de l'offre */}

            <div className="space-y-2">
              <Select
                id="job-select"
                onValueChange={(value) => setSelectedOffer(value)}
                disabled={loadingJobs}
              >
                <SelectTrigger className="w-[250px]  ">
                  <SelectValue placeholder={loadingJobs ? "Loading..." : "Choose an Offer"} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {jobs.length > 0 &&
                    jobs.map((job) => (
                      <SelectItem key={job.id} value={job.name}>
                        {job.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>


        {/* Affichage conditionnel du tableau ou message */}
        {loadingCandidates && (
          <div className="text-center text-gray-500">Loading candidates...</div>
        )}

        {!loadingCandidates && selectedOffer && candidates.length === 0 && (
          <div className="text-center text-gray-600 italic">No candidates found for this offer.</div>
        )}


        {showTable && candidates.length > 0 && (
          <CandidatesSimpleTable
            candidates={candidates}
            onView={(candidate) => viewCV(candidate.name)}
            onDelete={(candidate) => deleteFile(candidate.name, candidate.isLocal)}
          />
        )}
      </div>
    </Page>
  );
}

export default Candidates;
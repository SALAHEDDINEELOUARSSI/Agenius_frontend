"use client";

import { useRouter, useParams } from "next/navigation";
import JobOffersForm from "@/components/jobsOffers-form";
import { useEffect, useState } from "react";
import Page from "@/app/layout/layout";
import { SiteHeader } from "@/components/site-header";

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const [id, setId] = useState<string | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // ✅ Étape 1 : Vérification du token avant tout
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      setIsAuthChecked(true); // ⚠️ Ce flag permet de continuer uniquement si auth ok
    }
  }, [router]);

  // ✅ Étape 2 : Extraction de l'ID SEULEMENT si auth ok
  useEffect(() => {
    if (isAuthChecked && params?.id) {
      const jobId = Array.isArray(params.id) ? params.id[0] : params.id;
      console.log("ID détecté :", jobId);
      setId(jobId);
    }
  }, [isAuthChecked, params]);

  // (Facultatif) Log de debug pour ID
  useEffect(() => {
    if (id) console.log("Job Offer ID:", id);
  }, [id]);

  // ✅ Fonction pour enregistrer les modifications
  function handleSave(job: { name: string; description: string; company: string }) {
    if (!id) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    fetch(`http://localhost:8071/user/api/jobs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(job),
      mode: "cors",
    })
      .then((res) => res.json())
      .then(() => {
        router.push("/jobs/list");
      })
      .catch((err) => console.error("Erreur lors de la mise à jour :", err));
  }

  // ✅ UI si auth pas encore vérifiée
if (!id || !isAuthChecked) return null;

  return (
    <Page>
      <SiteHeader title="Modifier Offre" />
      <div className="max-w-2xl mx-auto mt-10">
        <JobOffersForm jobId={id} onSave={handleSave} />
      </div>
    </Page>
  );
}

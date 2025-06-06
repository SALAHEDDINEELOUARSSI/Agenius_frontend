"use client";  
import Page from "@/app/layout/layout";
import JobOffersForm from "@/components/jobsOffers-form";
import { SiteHeader } from "@/components/site-header";
import { useRouter } from "next/navigation";  
import { useEffect, useState } from "react";
import { useTheme } from "next-themes"; // ✅ Ajout ici

export default function AddJobPage() {
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const { theme } = useTheme(); // ✅ Utilisation ici
  console.log("🎨 Thème actif :", theme); // ✅ Debug pour voir si le thème est appliqué

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      setIsAuthChecked(true);
    }
  }, [router]);

  if (!isAuthChecked) return null; // ou un spinner, ou un message "Chargement..."

      
  function handleSave(job: { name: string; description: string; company: string }) {
    try {
      const token = localStorage.getItem("token");
            if (!token) {
              throw new Error("Utilisateur non authentifié");
            }
    fetch("http://localhost:8071/user/api/jobs", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
         "Authorization": `Bearer ${token}`,
        },
      body: JSON.stringify(job),
    }).then((res)  => res.json())
      .then(() => {
        router.push("/jobs/list");
      })
      .catch((err) => console.error("Erreur lors de l'ajout :", err));
    } 
  catch (err: any) {
    console.error("Erreur dans fetchJobs :", err.message);
  }
  } 

  return (
    <Page>
      <SiteHeader title="Ajouter Offre" /> {/* la barre en haut */}
      <div className="max-w-2xl mx-auto mt-10">
        <JobOffersForm onSave={handleSave} />
      </div>
    </Page>
  );
}

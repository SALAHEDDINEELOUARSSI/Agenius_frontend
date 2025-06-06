import { useState, useEffect } from "react";

interface Job {
  id: number;
  name: string;
  description: string;
  company: string;
}

const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token"); // Récupérer le token JWT du stockage local
        if (!token) {
          throw new Error("Utilisateur non authentifié");
        }

        const response = await fetch("http://localhost:8686/api/jobs", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`, // Ajouter le token dans l'en-tête
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des jobs");
        }

        const data:Job[] = await response.json();
        console.log("Jobs reçus :", data); // ✅ Vérification de la structure des données
        setJobs(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return { jobs, loading, error };
};

export default useJobs;

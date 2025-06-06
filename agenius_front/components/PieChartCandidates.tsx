"use client"

import { Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

import { useEffect, useState } from "react"
import { m } from "framer-motion"

// Typage des données du graphique
type CandidateScoreData = {
  browser: string
  Candidates: number
  fill: string
}

// Configuration du graphique
const chartConfig: ChartConfig = {
  Candidates: { label: "Candidates" },
  ScoreGt70: { label: "High Performers", color: "hsl(var(--chart-1))" },
  ScoreGt50: { label: "Average Performers", color: "hsl(var(--chart-2))" },
  scoreLt50: { label: "Low Performers", color: "hsl(var(--chart-3))" },
}

// ✅ Données par défaut à utiliser si aucune offre n'est sélectionnée
const defaultData: CandidateScoreData[] = [
  { browser: "ScoreGt70", Candidates: 0, fill: "var(--color-ScoreGt70)" },
  { browser: "ScoreGt50", Candidates: 0, fill: "var(--color-ScoreGt50)" },
  { browser: "scoreLt50", Candidates: 1, fill: "var(--color-scoreLt50)" },
]

interface Props {
  selectedJobId: string | null
}

export function PieChartCandidatesComponent({ selectedJobId }: Props) {
  const [chartData, setChartData] = useState<CandidateScoreData[]>(defaultData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEmptyData, setIsEmptyData] = useState(false);

  useEffect(() => {
    const fetchScoreStats = async () => {
      setLoading(true);
      setError("");

      if (!selectedJobId) {
        setChartData(defaultData);
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token"); // récupère ton token stocké

      try {
        const response = await fetch(`http://localhost:8070/api/candidats/score-stats/${selectedJobId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // 🔐 Ajout ici
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const reussis = Number(data.reussis);
        const moyens = Number(data.moyens);
        const echoues = Number(data.echoues);
        console.log(`${reussis} ${moyens} ${echoues}`);

        if (reussis === 0 && moyens === 0 && echoues === 0) {
          setChartData(defaultData);
          setIsEmptyData(true);
        } else {
          const formattedData: CandidateScoreData[] = [
            { browser: "ScoreGt70", Candidates: reussis, fill: "var(--color-ScoreGt70)" },
            { browser: "ScoreGt50", Candidates: moyens, fill: "var(--color-ScoreGt50)" },
            { browser: "scoreLt50", Candidates: echoues, fill: "var(--color-scoreLt50)" },
          ];
          setChartData(formattedData);
          setIsEmptyData(false);
        }

      } catch (err: any) {
        console.error("Erreur :", err.message);
        setError(err.message);
        setChartData(defaultData); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchScoreStats();
  }, [selectedJobId]);


  const descriptionMessage = !selectedJobId
      ? "No job selected — displaying default data"
      : isEmptyData
          ? "Aucune réponse des candidats pour le moment"
          : "Breakdown of candidates based on their obtained scores"

  return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Distribution of Candidates Scores</CardTitle>
          <CardDescription>{descriptionMessage}</CardDescription>

        </CardHeader>
        <CardContent className="flex-1 pb-0">
          {loading ? (
              <p className="text-center text-gray-500">Chargement des données...</p>
          ) : error ? (
              <p className="text-center text-red-500">Erreur : {error}</p>
          ) : (
              <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-[300px]"
              >
                <PieChart>
                  <Pie data={chartData} dataKey="Candidates" />
                  <ChartLegend
                      content={<ChartLegendContent nameKey="browser" />}
                      className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                  />
                </PieChart>
              </ChartContainer>
          )}
        </CardContent>
      </Card>
  )
}


"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis,ResponsiveContainer } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"
import axios from "axios"

const chartConfig = {
    mobile: {
        label: "Mobile",
        color: "hsl(272.1 71.7% 47.1%)",
    },
} satisfies ChartConfig
// Typage des données du graphique
type ChartDataItem = {
    Offre: string;
    Candidats: number;
};
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
    sub: string;
    // Tu peux ajouter d'autres champs si ton token contient + d'infos
}
export function Chart3() {
    const [chartData, setChartData] = useState<ChartDataItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAllScores = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Utilisateur non authentifié");
                const decoded = jwtDecode<DecodedToken>(token);
                const username = decoded.sub;
                const response = await axios.get(
                    `http://localhost:8070/user/api/GetCandidatsSelectedbyoffres`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                const rawData = response.data as Record<string, number>;
                const formattedData = Object.entries(rawData).map(([offre, score]) => ({
                    Offre: offre,
                    Candidats: score,
                }));

                setChartData(formattedData);
            } catch (err) {
                console.error(err);
                setError("Erreur lors du chargement des scores.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllScores();
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>raha tjib selected khass accepted</CardTitle>
                <CardDescription>Accepted Candidates per offer</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            data={chartData}
                            margin={{ top: 10, right: 30, left: 10, bottom: -30 }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="Offre"
                                tickLine={false}
                                axisLine={false}
                                interval={0}
                                tick={false}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dashed" />}
                            />
                            <Bar dataKey="Candidats" fill="var(--color-mobile)" radius={4} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>

            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Comparative Statistics
                </div>
                <div className="leading-none text-muted-foreground">
                    Number of Candidates per Offer

                </div>
            </CardFooter>
        </Card>
    )
}

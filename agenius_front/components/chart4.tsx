"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts"
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
type ChartDataItem = {
    Offre: string
    Candidats_ayant_reçu_le_test: number
    Candidats_ayant_répondu_au_test: number
}

const chartConfig = {
    Candidats_ayant_reçu_le_test: {
        label: "Candidats ayant reçu le test",
        color: "271.5 81.3% 55.9%",
    },
    Candidats_ayant_répondu_au_test: {
        label: "Candidats ayant répondu au test",
        color: "270 95.2% 75.3%",
    },
} satisfies ChartConfig
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
    sub: string;
    // Tu peux ajouter d'autres champs si ton token contient + d'infos
}
export function Chart4() {
    const [chartData, setchartData] = useState<ChartDataItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchAllScores = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Utilisateur non authentifié");
                const decoded = jwtDecode<DecodedToken>(token);
                const username = decoded.sub;
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const response = await axios.get(`http://localhost:8070/user/api/GetCandidatsSelectedbyoffres`, config);
                const response1 = await axios.get(`http://localhost:8070/user/api/GetCandidatsSelectedbyscore`, config);

                const offresData = response.data as Record<string, number>
                const scoresData = response1.data as Record<string, number>

                const allOffres = new Set([
                    ...Object.keys(offresData),
                    ...Object.keys(scoresData),
                ])

                const formattedData = Array.from(allOffres).map((offre) => ({
                    Offre: offre,
                    Candidats_ayant_reçu_le_test: Number(offresData[offre] || 0),
                    Candidats_ayant_répondu_au_test: Number(scoresData[offre] || 0),
                }))

                setchartData(formattedData)
            } catch (err) {
                console.error(err)
                setError("Erreur lors du chargement des données.")
            } finally {
                setLoading(false)
            }
        }

        fetchAllScores()
    }, [])

    return (
        <Card className="h-auto">
            <CardHeader>
                <CardTitle>khass tbedel</CardTitle>
                <CardDescription>khass tbedel</CardDescription>
            </CardHeader>

            <CardContent>
                {loading ? (
                    <p>Chargement...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
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
                                <Bar
                                    dataKey="Candidats_ayant_reçu_le_test"
                                    fill="hsl(271.5, 81.3%, 55.9%)"
                                    radius={4}
                                />
                                <Bar
                                    dataKey="Candidats_ayant_répondu_au_test"
                                    fill="hsl(270, 95.2%, 75.3%)"
                                    radius={4}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                )}
            </CardContent>

            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Comparative Statistics
                </div>
                <div className="leading-none text-muted-foreground">
                    Shortlisted candidates vs. those who responded
                </div>
            </CardFooter>
        </Card>
    )
}





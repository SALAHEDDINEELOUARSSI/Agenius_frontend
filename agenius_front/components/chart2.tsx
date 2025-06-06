"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart } from "recharts"
import React, { useEffect, useState } from 'react'
import axios from 'axios'

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

// Typage des données du graphique
type ChartDataItem = {
    Offre: string;
    Score: number;
};

// Configuration du graphique
const chartConfig = {
    visitors: {
        label: "Score moyen",
        color: "hsl(var(--chart-1))", // tu peux changer pour un autre HSL si besoin
    },
} satisfies ChartConfig;
const ActiveDotWithLabel = (props: any) => {
    const { cx, cy, payload } = props
    if (cx === undefined || cy === undefined) return null
    return (
        <g>
            <circle cx={cx} cy={cy} r={6} fill={chartConfig.visitors.color} />
            <text
                x={cx}
                y={cy - 10}
                textAnchor="middle"
                fill="#000"
                fontSize={12}
                fontWeight="bold"
                pointerEvents="none"
            >
                {payload.Offre}
            </text>
        </g>
    )
}
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
    sub: string;
    // Tu peux ajouter d'autres champs si ton token contient + d'infos
}


export function Chart2() {
    const [chartData, setChartData] = useState<ChartDataItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllScores = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Utilisateur non authentifié");
                const decoded = jwtDecode<DecodedToken>(token);
                const username = decoded.sub;
                const response = await axios.get(
                    `http://localhost:8070/user/api/GetScoreMeduime`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );                const rawData = response.data  as Record<string, number> ;
                // Conversion d’un Map<String, Double> vers tableau utilisable par recharts
                const formattedData = Object.entries(rawData).map(([offre, score]) => ({
                    Offre: offre,
                    Score: Number(score),
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
                <CardTitle>Average candidate scores by job offer</CardTitle>
                <CardDescription>Candidate score visualization</CardDescription>
            </CardHeader>
            <CardContent>
                {loading && <p>Chargement...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {!loading && !error && (
                    <ChartContainer config={chartConfig}>
                        <LineChart
                            data={chartData}
                            margin={{ top: 10, left: 24, right: 24 }}
                        >
                            <CartesianGrid vertical={false} />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        indicator="line"
                                        nameKey="Offre" // ✅ correction ici
                                        hideLabel={false}
                                    />
                                }
                            />
                            <Line
                                dataKey="Score"
                                type="natural"
                                stroke={chartConfig.visitors.color}
                                strokeWidth={2}
                                dot={{ fill: chartConfig.visitors.color }}
                                activeDot={<ActiveDotWithLabel />}
                            />

                        </LineChart>
                    </ChartContainer>
                )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Comparative Statistics
                </div>
                <div className="leading-none text-muted-foreground">
                    Average scores per offer
                </div>
            </CardFooter>
        </Card>
    );
}

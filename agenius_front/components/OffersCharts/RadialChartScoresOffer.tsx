"use client"

import { TrendingUp } from "lucide-react"
import {
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
    Label,
} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [{ name: "Score moyen", score: 76, max: 100 }];

const chartConfig = {
    score: {
        label: "Score moyen",
        color: "hsl(var(--chart-1))", // vert par ex.
    },
    max: {
        label: "Reste",
        color: "#e5e7eb", // gris clair (gray-200)
    },
};
import { useState, useEffect } from "react";
interface Props {
    selectedJobId: string | null;
}
export function RadialChartScoresOffer({ selectedJobId }: Props) {
    const moyenne = chartData[0].score;
    const [averageScore, setAverageScore] = useState(0);
    useEffect(() => {
        if (!selectedJobId) return;

        const token = localStorage.getItem("token"); // ou sessionStorage selon ton app

        fetch(`http://localhost:8070/api/candidats/average-score/${selectedJobId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 🔐 Ajout du token ici
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération de la moyenne des scores");
                }
                return response.json();
            })
            .then(data => {
                setAverageScore(data);
            })
            .catch(error => {
                console.error("Erreur :", error);
            });
    }, [selectedJobId]);


    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Mean Candidate Score</CardTitle>
                <CardDescription>Percentage of Maximum Score</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 items-center pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square w-full max-w-[250px]"
                >
                    <RadialBarChart
                        data={chartData}
                        startAngle={180}
                        endAngle={0}
                        innerRadius={100}
                        outerRadius={150}
                        barCategoryGap="10%"
                    >
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <PolarRadiusAxis
                            domain={[0, 100]}
                            tick={false}
                            axisLine={false}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) - 16}
                                                    className="fill-foreground text-2xl font-bold"
                                                >
                                                    {Math.floor(averageScore)}%

                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 4}
                                                    className="fill-muted-foreground text-sm"
                                                >
                                                    Average Score
                                                </tspan>
                                            </text>
                                        );
                                    }
                                    return null;
                                }}
                            />
                        </PolarRadiusAxis>

                        {/* Zone grise (max = 100%) */}
                        <RadialBar
                            dataKey="max"
                            fill={chartConfig.max.color}
                            cornerRadius={0}
                            background
                        />

                        {/* Zone verte = score */}
                        <RadialBar
                            dataKey="score"
                            fill={chartConfig.score.color}
                            cornerRadius={5}
                        />
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Candidate Score Overview
                </div>
                <div className="leading-none text-muted-foreground">
                    Based on Candidate Assessments
                </div>
            </CardFooter>
        </Card>
    );
}

"use client";
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { Chart2 } from "@/components/chart2"
import { Chart3 } from "@/components/chart3"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import data from "./data.json"
import { BarChartComponent } from "@/components/BarChartCVsOffers"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SectionCardsOffer } from "@/components/section-cards-offer"
import { PieChartCandidatesComponent } from "@/components/PieChartCandidates"

import React, { useState, useEffect } from "react";
import DashboardContent from "@/components/dashContent/DashboardContent";
import JobList from "../jobs/list/page";
import Page from "../layout/layout";
import { useRouter } from "next/navigation"; // hook de navigation Next.js

export default function DashBoardPage() {
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      setIsAuthChecked(true);
    }
  }, [router]);

  if (!isAuthChecked) return null; // ou un spinner, ou un message "Chargement..."

  return (
    <Page>
      <SiteHeader title="Dashboard" />
      <DashboardContent />
    </Page>
  );
}

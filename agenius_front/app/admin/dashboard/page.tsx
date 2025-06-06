"use client";
import { SiteHeader } from "@/components/site-header"

import React, { useState, useEffect } from "react";
import DashboardContent from "@/components/admin/dashContent/DashboardContent";
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

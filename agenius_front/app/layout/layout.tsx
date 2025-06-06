
"use client";
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
//pour les toast 

import React, { useState, useEffect } from "react";
interface PageProps {
    children: React.ReactNode;
  }
  {/**J'ai ajouté PageProps pour préciser que Page accepte une propriété children.

On utilise {children} pour afficher dynamiquement ce qu'on veut dedans.

Tu n'écris pas JobList ou DashboardContent directement ici. */}
import { Toaster } from "@/components/ui/sonner"; // ⬅️ IMPORT ajouté ici

  export default function Page({ children }: PageProps) {
    return (
      <SidebarProvider
        style={{
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties}
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          
          
          {children} {/* ici on injecte le contenu spécifique de chaque page */}
          <Toaster />
        </SidebarInset>
      </SidebarProvider>
    );
  }
  
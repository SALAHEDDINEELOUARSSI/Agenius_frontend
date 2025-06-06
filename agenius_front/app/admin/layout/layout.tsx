
"use client";
import { AppSidebar } from "@/components/admin/sideBar/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"; // ⬅️ IMPORT ajouté ici

import React, { useState, useEffect } from "react";
interface PageProps {
    children: React.ReactNode;
  }
  {/**J'ai ajouté PageProps pour préciser que Page accepte une propriété children.

On utilise {children} pour afficher dynamiquement ce qu'on veut dedans.

Tu n'écris pas JobList ou DashboardContent directement ici. */}
  
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
            <Toaster /> {/* ⬅️ Ajouté ici pour que toutes les pages aient accès au système de toast */}

        </SidebarInset>
      </SidebarProvider>
    );
  }
  
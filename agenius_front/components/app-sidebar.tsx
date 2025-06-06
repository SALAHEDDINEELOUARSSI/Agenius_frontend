"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconBriefcase,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondaryUser"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"


import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
interface DecodedToken {
  sub: string;
  // Tu peux ajouter d'autres champs si ton token contient + d'infos
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [email, setEmail] = useState<string>("Utilisateur inconnu");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        console.log("Token décodé:", decoded);
        setEmail(decoded.sub); // ou decoded.email selon ton token
      } catch (error) {
        console.error("Erreur de décodage du token:", error);
      }
    }
  }, []);
  //Générer l'URL de l'avatar dynamiquement
  const getAvatarUrl = (email: string): string => {
    const firstLetter = email.charAt(0).toUpperCase();
    return `https://ui-avatars.com/api/?name=${firstLetter}&background=6d28d9&color=fff&rounded=true`;
  };
  const data = {
    user: {
      email: email, 
      avatar: getAvatarUrl(email),

    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
      },
      {
        title: "Offers",
        url: "/jobs/list",
        icon: IconBriefcase,
      },
      {
        title: "Import CVs",
        url: "/import-cvs", 
        icon: IconFileDescription,  
      },
    {
        title: "Process agent",
        url: "/process-agent",
        icon: IconListDetails,
      },
      
    ],
    navClouds: [
      {
        title: "Capture",
        icon: IconCamera,
        isActive: true,
        url: "#",
        items: [
          { title: "Active Proposals", url: "#" },
          { title: "Archived", url: "#" },
        ],
      },
      {
        title: "Proposal",
        icon: IconFileDescription,
        url: "#",
        items: [
          { title: "Active Proposals", url: "#" },
          { title: "Archived", url: "#" },
        ],
      },
      {
        title: "Prompts",
        icon: IconFileAi,
        url: "#",
        items: [
          { title: "Active Proposals", url: "#" },
          { title: "Archived", url: "#" },
        ],
      },
    ],
    navSecondary: [
     
      {
        title: "About us",
        url: "/about-us",
        icon: IconHelp,
      },
      
    ],
    documents: [
      {
        name: "Candidates",
        url: "/candidates",
        icon: IconDatabase,
      },
      {
        name: "Agent Results",
        url: "/result-agent",
        icon: IconReport,
      },
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Agenius</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

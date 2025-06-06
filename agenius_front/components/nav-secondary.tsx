"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: Icon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [pendingUrl, setPendingUrl] = React.useState<string | null>(null)

  const handleClick = (itemTitle: string, itemUrl: string) => {
    if (itemTitle === "Mode user") {
      // ouvrir la confirmation
      setPendingUrl(itemUrl)
      setDialogOpen(true)
    } else {
      // navigation directe pour les autres
      router.push(itemUrl)
    }
  }

  const handleConfirm = () => {
    if (pendingUrl) {
      router.push(pendingUrl)
      setDialogOpen(false)
      setPendingUrl(null)
    }
  }

  return (
    <>
      <SidebarGroup {...props}>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 w-full text-left"
                    onClick={() => handleClick(item.title, item.url)}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la navigation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir passer en mode utilisateur ? Vous pouvez revenir en arrière à tout moment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDialogOpen(false)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Confirmer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

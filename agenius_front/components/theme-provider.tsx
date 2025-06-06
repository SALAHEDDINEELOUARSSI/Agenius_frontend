"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = React.useState(false)

  // S'assurer que le thème est défini uniquement côté client (pour résoudre probleme d'hydratation)
  React.useEffect(() => {
    setMounted(true)
  }, [])
  // Ne pas rendre le composant avant que le client soit prêt (pour éviter l'erreur d'hydratation)
  if (!mounted) {
    return null // Rien à afficher avant le montage côté client
  }



  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

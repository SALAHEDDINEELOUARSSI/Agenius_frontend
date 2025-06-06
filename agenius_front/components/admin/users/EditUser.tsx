import * as React from "react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import router from "next/router"
import { toast } from "sonner"
type Role = {
  id: string | null;
  roleName: string | null;
};

export type AppUser = {
  id: string;
  username: string;
  actived: boolean;
  roles: Role[];
};
type RoleName = "ADMIN" | "USER";

type DrawerDialogDemoProps = {
  user: AppUser | null
  open: boolean
  setOpen: (open: boolean) => void
onUserUpdated?: (updatedUser: AppUser) => void
}

export function DrawerDialogDemo({ user, open, setOpen, onUserUpdated }: DrawerDialogDemoProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (!user) return null // Sécurité
  console.log("User passed to DrawerDialogDemo:", user)

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier {user.username}</DialogTitle>
            <DialogDescription>Modifier rôle et statut</DialogDescription>
          </DialogHeader>
          <EditUserForm user={user} setOpen={setOpen} onUserUpdated={onUserUpdated}/>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Modifier {user.username}</DrawerTitle>
          <DrawerDescription>Modifier rôle et statut</DrawerDescription>
        </DrawerHeader>
        <EditUserForm user={user}  setOpen={setOpen}  onUserUpdated={onUserUpdated} className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Annuler</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}function EditUserForm({
  user,
  className,
  setOpen,
  onUserUpdated,

}: { user: AppUser ;
  setOpen: (open: boolean) => void
onUserUpdated?: (updatedUser: AppUser) => void
} & React.ComponentProps<"form">) {
  // On extrait le rôle sous forme scalar (string) pour le Select
const initialRoleRaw = user.roles && user.roles.length > 0 && user.roles[0].roleName
    ? user.roles[0].roleName.toUpperCase()
    : "USER";

  // On force à "ADMIN" ou "USER"
  const initialRole: RoleName = initialRoleRaw === "ADMIN" ? "ADMIN" : "USER";

  const [role, setRole] = React.useState<RoleName>(initialRole);
  const [status, setStatus] = React.useState(user.actived ? "enabled" : "disabled");

  React.useEffect(() => {
    const roleName = user.roles && user.roles.length > 0 && user.roles[0].roleName
    ? user.roles[0].roleName.toUpperCase()
    : "USER";

    const newRole: RoleName = roleName === "ADMIN" ? "ADMIN" : "USER";


    setRole(newRole);
    setStatus(user.actived ? "enabled" : "disabled");
  }, [user]);

  console.log("username =" + user.username);
  console.log("role =", user.roles);
  console.log("status =", user.actived);

  return (
    <form
      className={cn("grid gap-4", className)}
      onSubmit={async (e) => {
        e.preventDefault();
        const payload = {
        actived: status === "enabled",
        role: role,  // "admin" ou "user"
      };


        try {
          const token = localStorage.getItem("token");
          if (!token) {
            router.replace("/login");
            return;
          }
          const response = await fetch(`http://localhost:8686/admin/api/users/${user.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // si besoin
            },
            body: JSON.stringify(payload),
            mode:"cors"
          });

          if (!response.ok) {
            throw new Error("Erreur lors de la mise à jour");
          }

          const updatedUser = await response.json();
          toast("Mise à jour réussie");
          console.log("Mise à jour réussie :", updatedUser);
          setOpen(false); // <-- Ferme le drawer/dialog
          if (onUserUpdated) onUserUpdated(updatedUser)
            
            // Tu peux déclencher une mise à jour de l'UI ici (fermer le drawer, recharger la liste, etc.)
          } catch (err) {
            console.error("Erreur :", err);
            toast("erreur");
            // Affiche une notification d'erreur par exemple
          }
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="role">Rôle</Label>
        <Select value={role} onValueChange={(value) => setRole(value as RoleName)}>
          <SelectTrigger id="role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">ADMIN</SelectItem>
            <SelectItem value="USER">USER</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="status">Statut</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="enabled">Activé</SelectItem>
            <SelectItem value="disabled">Désactivé</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Enregistrer</Button>
    </form>
  );
}
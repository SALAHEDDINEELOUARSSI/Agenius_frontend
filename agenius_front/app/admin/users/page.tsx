"use client";

import { useEffect, useState } from "react";
import Page from "@/app/admin/layout/layout";
import { SiteHeader } from "@/components/site-header";
import { DataTable } from "@/components/admin/users/data-table";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  username: string;
  actived: boolean;
  roles: { id: string | null; roleName: string | null }[]
  // autres champs si nécessaire
}

interface DecodedToken {
  sub: string;
  // autres champs du token si nécessaire
}

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      setIsAuthChecked(true);
    }
  }, [router]);

  useEffect(() => {
    if (!isAuthChecked) return;

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Utilisateur non authentifié");

        const decoded = jwtDecode<DecodedToken>(token);
        const username = decoded.sub;
        console.log("Contenu du token :", decoded);
        const response = await fetch("http://localhost:8686/admin/api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
    console.log("Réponse du backend :", data); // 👈 ICI

        // si Mongo renvoie `_id`, on le transforme en `id`
        const formattedUsers = data.map((user: any) => ({
          id: user._id?.$oid || user._id || user.id,
          username: user.username,
          actived: user.actived,
          roles: user.roles
        }));

        setUsers(formattedUsers);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAuthChecked]);


  const handleUserUpdated = (updatedUser: User) => {
  setUsers((prevUsers) =>
    prevUsers.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    )
  );
};

  return (
    <Page>
      <SiteHeader title="Users" />
      <div className="p-5 space-y-5">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <DataTable data={users} onUserUpdated={handleUserUpdated} />
        )}
      </div>
    </Page>
  );
}

export default Users;

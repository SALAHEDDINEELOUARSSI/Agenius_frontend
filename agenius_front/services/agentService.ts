// services/agentService.ts

export const fetchAgentsCount = async (): Promise<number> => {
    try {
      const res = await fetch("http://localhost:8070/api/agents/en-cours/count");
      if (!res.ok) {
        throw new Error("Erreur lors de la récupération du nombre d’agents.");
      }
      const count = await res.json();
      return count;
    } catch (error) {
      console.error("Erreur dans fetchAgentsCount:", error);
      return 0;
    }
  };
  
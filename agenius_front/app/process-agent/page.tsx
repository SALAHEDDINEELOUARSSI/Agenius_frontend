// app/process-agent/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import AgentTable from '@/components/Offer-table';
import { Offer, PhaseData } from '@/types/offer';
import { fetchJobs, startAgent, stopAgent, fetchPhaseData} from '@/services/offerProcessService';
import { connectWebSocket } from '@/utils/websocket';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';
import Page from '../layout/layout';
import { SiteHeader } from '@/components/site-header';
import { Client } from '@stomp/stompjs';

export default function ProcessAgentPage() {
  const [token, setToken] = useState<string>('');
  const [offers, setOffers] = useState<Offer[]>([]);
  const [phaseData, setPhaseData] = useState<PhaseData[]>([]);
  const [clients, setClients] = useState<{ [offerName: string]: Client }>({});
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/login');
      return;
    }
    setToken(storedToken);

    const loadInitialData = async () => {
      try {
        const offersData = await fetchJobs(storedToken);
        const phaseDataResults = await Promise.all(
          offersData.map((offer: Offer) => fetchPhaseData(offer.name, storedToken))
        );

        const normalizedOffers = offersData.map((offer, index) => ({
          ...offer,
          steps: offer.steps ?? [],
          phaseData: phaseDataResults[index],
          isAgentRunning: false,
        }));


        setOffers(normalizedOffers);
      } catch (error) {
        console.error("Failed to load initial data:", error);
      }
    };

    loadInitialData();
  }, []);

  const handleWebSocketMessage = (offer: Offer, data: any) => {
    const tool = data.tool ?? 'Step';
    const progress = data.progress ?? 0;
    const status = data.status ?? 'in-progress';

    setOffers(prevOffers =>
      prevOffers.map(o => {
        if (o.name === offer.name) {
          const currentPhaseStatus = o.phaseData?.phaseStatus ?? 0;

          const updatedSteps = o.steps.map(s =>
            s.name === tool ? { ...s, completed: progress === 100 } : s
          );

          const isPhase1Complete = tool === 'Save the selected candidate' && progress === 100 && currentPhaseStatus === 0;
          const isQCMSent = tool === 'Send the QCM HTML template by email' && progress === 100;

          let newStatus = status;
          let newProgress = progress;

          if (isPhase1Complete) {
            newStatus = 'finished-phase1';
            newProgress = 100;
          } else if (isQCMSent) {
            newStatus = 'waiting-responses';
            newProgress = 80;
          }

          return {
            ...o,
            progressPercent: newProgress,
            steps: updatedSteps,
            status: newStatus,
            lastUpdated: new Date()
          };
        }
        return o;
      })
    );


    const isQCMSent =
      tool === 'Send the QCM HTML template by email to all selected candidates for the given job title !' &&
      progress === 100;

    const isPhase1Completed =
      tool === 'Save the selected candidate to the CandidatsSelected entity !' &&
      offer.phaseData?.phaseStatus === 0;

    const isStepCompleted = progress === 100;

    if (isQCMSent) {
      toast.success(`QCMs sent for ${offer.name}. Waiting for candidate responses...`);
    } else if (isPhase1Completed) {
      toast.success(`Phase 1 completed for ${offer.name}`);
      
    } else if (isStepCompleted) {
      toast.success(`Step completed: ${tool} for ${offer.name}`);
    }

    if (progress < 100) {
      toast.info(`${tool} → ${progress}%`, { duration: 1000 });
    }

  };

  const resetOfferState = (id: string) => {
    setOffers(prev =>
      prev.map(o =>
        o.id === id
          ? {
            ...o,
            status: 'in-progress',
            progressPercent: 0,
            steps: o.steps?.map(s => ({ ...s, completed: false, completedAt: undefined })) || []
          }
          : o
      )
    );
  };


const handleStart = async (offer: Offer) => {
  try {
    if (clients[offer.name]) {
      clients[offer.name].deactivate();
    }

    const client = connectWebSocket(token, offer.name, (data) => {
      handleWebSocketMessage(offer, data);
    });

    setClients(prev => ({ ...prev, [offer.name]: client }));

    resetOfferState(offer.id);

    const phaseStatus = offer.phaseData?.phaseStatus ?? 0;
    await startAgent(offer.name, phaseStatus, token);

    toast.success(`Agent started for ${offer.name}`);
  } catch (error) {
    console.error(`Failed to start agent for ${offer.name}:`, error);
    toast.error(`Failed to start agent for ${offer.name}`);
  }
};

  const handleStop = async (offer: Offer) => {
    try {
      await stopAgent(offer.name, token);

      if (clients[offer.name]) {
        clients[offer.name].deactivate();
        const updated = { ...clients };
        delete updated[offer.name];
        setClients(updated);
      }

      setOffers(prev =>
        prev.map(o =>
          o.id === offer.id ? { ...o, status: 'failed' } : o
        )
      );

      toast.error(`Agent stopped for ${offer.name}`);
    } catch (error) {
      console.error('Error stopping agent:', error);
      toast.error(`Failed to stop agent for ${offer.name}`);
    }
  };

  useEffect(() => {
    return () => {
      Object.values(clients).forEach((client) => {
        client.deactivate();
      });
    };
  }, []);

  const handleViewResults = (offer: Offer) => {
    router.push(`/result/${offer.name}`);
  };

  return (
    <Page>
      <main className="p-6">
        <SiteHeader title="Process Agent" />
        <AgentTable
          offers={offers}
          onStart={handleStart}
          onStop={handleStop}
          onViewResults={handleViewResults}
        />
      </main>
      <Toaster position="bottom-right" />
    </Page>
  );
}
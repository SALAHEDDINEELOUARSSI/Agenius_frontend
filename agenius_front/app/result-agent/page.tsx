"use client";

import React, { useEffect, useState } from "react";
import Page from "@/app/layout/layout";
import { Offer } from "@/types/offer";
import { SiteHeader } from "@/components/site-header";
import {
  Tabs, TabsList, TabsTrigger, TabsContent
} from "@/components/ui/tabs";
import {
  Card, CardContent
} from "@/components/ui/card";
import { StepTimeline } from "@/components/StepTimeline";
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem
} from "@/components/ui/select";
import { TrendingUp, Check, Award, Users } from "lucide-react";
import {
  fetchJobs, fetchSelectedCandidates,
  fetchAcceptedCandidates, fetchAcceptedDefinitif,
  fetchPhaseData
} from "@/services/offerProcessService";
import { CandidateSelected, CandidateAccepted } from "@/services/offerProcessService";
import {CandidateTablePhase1,CandidateTableAccepted} from "@/components/result-table";

const ResultsAgentPage = () => {
  const [jobs, setJobs] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<string>("");
  const [selected, setSelected] = useState<CandidateSelected[]>([]);
  const [accepted, setAccepted] = useState<CandidateAccepted[]>([]);
  const [final, setFinal] = useState<CandidateAccepted[]>([]);
  const [phaseStatus, setPhaseStatus] = useState<number>(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetchJobs(token).then(setJobs).catch(console.error);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !selectedOffer) return;
    fetchJobs(token).then(setJobs).catch(console.error);
    fetchSelectedCandidates(selectedOffer, token).then(setSelected);
    fetchAcceptedCandidates(selectedOffer, token).then(setAccepted);
    fetchAcceptedDefinitif(selectedOffer, token).then(setFinal);
    fetchPhaseData(selectedOffer, token).then((data) => setPhaseStatus(data.phaseStatus));
  }, [selectedOffer]);
const selectedJob = jobs.find((job) => job.name === selectedOffer);
const stats = {
  nbr: selectedJob?.numberOfCVs ?? 0,
  totalSelected: selected.length,
  totalAccepted: accepted.length,
  acceptanceRate: selected.length ? Math.round((accepted.length / selected.length) * 100) : 0,
  //  totalHired: final.filter(c => c.status === "hired").length,
   // hiringRate: accepted.length ? Math.round((final.filter(c => c.status === "hired").length / accepted.length) * 100) : 0,
  };

  return (
    <Page>
      <SiteHeader title="Agent Results" />
      <div className="container mx-auto px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Agent Results</h1>

        <div className="flex gap-6 items-center">
          <label className="font-semibold text-lg">Job Offer</label>
          <Select onValueChange={setSelectedOffer}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Choose an Offer" />
            </SelectTrigger>
            <SelectContent>
              {jobs.map((job) => (
                <SelectItem key={job.id} value={job.name}>
                  {job.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedOffer && (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-primary border">
                <CardContent className="p-4 ">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-primary-foreground">total candidates</p>
                      <p className="text-2xl font-bold">{stats.nbr}</p>
                    </div>
                    <Users className="text-primary-foreground"/>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-primary border">
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-primary-foreground">Selected</p>
                      <p className="text-2xl font-bold">{stats.totalSelected}</p>
                    </div>
                    <TrendingUp className="text-primary-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-primary border">
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-primary-foreground">Accepted </p>
                      <p className="text-2xl font-bold">{stats.totalAccepted}</p>
                    </div>
                    <Check className="text-primary-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-primary border">
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-primary-foreground">Final Accepted</p>
                      <p className="text-2xl font-bold">{/*stats.totalHired*/}</p>
                    </div>
                    <Award className="text-primary-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="phase1" className="mt-6">
              <TabsList className="grid grid-cols-3 w-full h-12">
                <TabsTrigger value="phase1">Phase 1 : Candidats Selected</TabsTrigger>
                <TabsTrigger value="phase2" disabled={phaseStatus < 1}>Phase 2 : QCM Accepted</TabsTrigger>
                <TabsTrigger value="phase3" disabled={phaseStatus < 2}>Phase 3 : Final Accepted</TabsTrigger>
              </TabsList>

              <TabsContent value="phase1" >
                <CandidateTablePhase1 title="Selected Candidates" candidates={selected} />
              </TabsContent>
              <TabsContent value="phase2">
                <CandidateTableAccepted title="QCM Accepted Candidates" candidates={accepted} />
              </TabsContent>
              <TabsContent value="phase3">
                <CandidateTableAccepted title="Final Accepted Candidates" candidates={final} />
              </TabsContent>
            </Tabs>
           {selectedJob && <StepTimeline offer={selectedJob} />}

          </>
        )}
      </div>
      

    </Page>
  );
};

export default ResultsAgentPage;


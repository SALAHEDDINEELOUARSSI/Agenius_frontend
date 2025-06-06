"use client";

import React, { useEffect, useState, use } from "react";
import Page from "@/app/layout/layout";
import { SiteHeader } from "@/components/site-header";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import {
  CandidateSelected,
  CandidateAccepted,
  fetchSelectedCandidates,
  fetchAcceptedCandidates,
  fetchAcceptedDefinitif,
  fetchPhaseData
} from "@/services/offerProcessService";
import { Button } from "@/components/ui/button";
import router from "next/router";
import { ChevronLeft } from "lucide-react";

// Main page component
export default function ResultOfferPage({ params }: { params: Promise<{ offerName: string }> }) {
  const { offerName } = use(params);
  const decodedOfferName = decodeURIComponent(offerName);

  return (
    <Page>
      <SiteHeader title={"Result Page"} />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Results for : {decodedOfferName}</h1>
        <CandidateTabs decodedOfferName={decodedOfferName} />
      </div>
    </Page>
  );
}

// Candidate Tabs Component
interface CandidateTabsProps {
  decodedOfferName: string;
}

const CandidateTabs: React.FC<CandidateTabsProps> = ({ decodedOfferName }) => {
  const [selected, setSelected] = useState<CandidateSelected[]>([]);
  const [accepted, setAccepted] = useState<CandidateAccepted[]>([]);
  const [acceptedInterview, setAcceptedInterview] = useState<CandidateAccepted[]>([]);
  const [phaseStatus, setPhaseStatus] = useState<number>(0);
  const [activeTab, setActiveTab] = useState("phase1");
  const [errorPhase1, setErrorPhase1] = useState<string | null>(null);
  const [errorPhase2, setErrorPhase2] = useState<string | null>(null);
  const [errorPhase3, setErrorPhase3] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!decodedOfferName || !token) {
      setErrorPhase1("Missing offer or token");
      setErrorPhase2("Missing offer or token");
      setErrorPhase3("Missing offer or token");
      return;
    }

    // Reset errors before fetching
    setErrorPhase1(null);
    setErrorPhase2(null);
    setErrorPhase3(null);

    // Fetch selected candidates (Phase 1)
    fetchSelectedCandidates(decodedOfferName, token)
      .then((candidates) =>
        setSelected(
          candidates.map((c) => ({
            ...c,
            id: String(c.id),
            phone: c.phone ?? "—",
            address: c.address ?? "—",
            country: c.country ?? "—",
            city: c.city ?? "—",
            name: c.name ?? "—",
          }))
        )
      )
      .catch(() => setErrorPhase1("Failed to load selected candidates"));

    // Fetch QCM accepted candidates (Phase 2)
    fetchAcceptedCandidates(decodedOfferName, token)
      .then((candidates) =>
        setAccepted(
          candidates.map((c) => ({
            ...c,
            id: String(c.id),
            score: c.score ?? 0,
          }))
        )
      )
      .catch(() => setErrorPhase2("Failed to load QCM accepted candidates"));

    // Fetch final accepted candidates (Phase 3)
    fetchAcceptedDefinitif(decodedOfferName, token)
      .then((candidates) =>
        setAcceptedInterview(
          candidates.map((c) => ({
            ...c,
            id: String(c.id),
            score: c.score ?? 0,
          }))
        )
      )
      .catch(() => setErrorPhase3("Failed to load final accepted candidates"));

    // Fetch phase status
    fetchPhaseData(decodedOfferName, token)
      .then((data) => setPhaseStatus(data.phaseStatus))
      .catch(console.error);
  }, [decodedOfferName]);

  return (
    <div className="w-full">
       <div className="w-full max-w-3xl px-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] mb-4"
        >
          <ChevronLeft className="mr-2 h-5 w-5" /> Back
        </button>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="phase1">Phase 1: Candidats Selected</TabsTrigger>
          <TabsTrigger value="phase2" disabled={phaseStatus < 1}>
            Phase 2: QCM Accepted
          </TabsTrigger>
          <TabsTrigger value="phase3" disabled={phaseStatus < 2}>
            Phase 3: Final Accepted
          </TabsTrigger>
        </TabsList>

        {/* Phase 1 Content */}
        <TabsContent value="phase1">
          <CandidateTablePhase1
            title="Selected Candidates"
            candidates={selected}
            error={errorPhase1}
          />
        </TabsContent>

        {/* Phase 2 Content */}
        <TabsContent value="phase2">
          <CandidateTableAccepted
            title="Candidates Accepted After QCM"
            candidates={accepted}
            error={errorPhase2}
          />
        </TabsContent>

        {/* Phase 3 Content */}
        <TabsContent value="phase3">
          <CandidateTableAccepted
            title="Candidates Accepted After Interview"
            candidates={acceptedInterview}
            error={errorPhase3}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Phase 1 Table Component
interface CandidateTablePhase1Props {
  title: string;
  candidates: CandidateSelected[];
  error?: string | null;
}

const CandidateTablePhase1: React.FC<CandidateTablePhase1Props> = ({
  title,
  candidates,
  error,
}) => {
  const [page, setPage] = useState(1);
  const perPage = 7;
  const totalPages = Math.ceil(candidates.length / perPage);

  useEffect(() => {
    setPage(1);
  }, [candidates]);

  const pagedCandidates = candidates.slice((page - 1) * perPage, page * perPage);

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <Table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="border-b">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr>
                <td colSpan={6} className="py-4 text-center text-red-600 font-semibold">
                  {error}
                </td>
              </tr>
            ) : candidates.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-500">
                  No candidates found.
                </td>
              </tr>
            ) : (
              pagedCandidates.map((c) => (
                <tr key={c.id} className="border-b hover:bg-muted/30">
                  <td className="py-2 px-4">{c.name}</td>
                  <td className="py-2 px-4">{c.email}</td>
                  <td className="py-2 px-4">{c.phone}</td>
                  <td className="py-2 px-4">
                    {c.address}, {c.city}
                  </td>
                  <td className="py-2 px-4">{c.country}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
        
         {/* Pagination */}
      <div className="flex justify-between items-center px-4 py-2 bg-white border-t">
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
      <div className="flex items-center gap-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => setPage(prev => Math.max(prev - 1, 1))}
      disabled={page === 1}
    >
      Previous
    </Button>

    {/* Page Numbers */}
    {Array.from({ length: totalPages }, (_, index) => (
      <Button
        key={index}
        variant={index + 1 === page ? 'default' : 'outline'}
        size="sm"
        className="px-3"
        onClick={() => setPage(index + 1)}
      >
        {index + 1}
      </Button>
    ))}

    <Button
      variant="outline"
      size="sm"
      onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
      disabled={page === totalPages}
    >
      Next
    </Button>
  </div>
      </div>
        
      </CardContent>
    </Card>
  );
};

// Phase 2 & 3 Table Component
interface CandidateTableAcceptedProps {
  title: string;
  candidates: CandidateAccepted[];
  error?: string | null;
}

const CandidateTableAccepted: React.FC<CandidateTableAcceptedProps> = ({
  title,
  candidates,
  error,
}) => {
  const [page, setPage] = useState(1);
  const perPage = 10;
  const totalPages = Math.ceil(candidates.length / perPage);

  useEffect(() => {
    setPage(1);
  }, [candidates]);

  const pagedCandidates = candidates.slice((page - 1) * perPage, page * perPage);

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <Table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="border-b">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr>
                <td colSpan={3} className="py-4 text-center text-red-600 font-semibold">
                  {error}
                </td>
              </tr>
            ) : candidates.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-4 text-center text-gray-500">
                  No candidates found.
                </td>
              </tr>
            ) : (
              pagedCandidates.map((c) => (
                <tr key={c.id} className="border-b hover:bg-muted/30">
                  <td className="py-2 px-4">{c.name}</td>
                  <td className="py-2 px-4">{c.email}</td>
                  <td className="py-2 px-4">{c.score}%</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
        {/* Pagination */}
      <div className="flex justify-between items-center px-4 py-2 bg-white border-t">
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
      <div className="flex items-center gap-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => setPage(prev => Math.max(prev - 1, 1))}
      disabled={page === 1}
    >
      Previous
    </Button>

    {/* Page Numbers */}
    {Array.from({ length: totalPages }, (_, index) => (
      <Button
        key={index}
        variant={index + 1 === page ? 'default' : 'outline'}
        size="sm"
        className="px-3"
        onClick={() => setPage(index + 1)}
      >
        {index + 1}
      </Button>
    ))}

    <Button
      variant="outline"
      size="sm"
      onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
      disabled={page === totalPages}
    >
      Next
    </Button>
  </div>
      </div>
      </CardContent>
    </Card>
  );
};
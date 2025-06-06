'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CandidateSelected, CandidateAccepted } from '@/services/offerProcessService'; // adapte les chemins si nécessaire

// Pagination controls component
interface PaginationControlsProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ page, totalPages, setPage }) => (
  <div className="flex justify-between items-center px-4 py-2 border-t bg-background">
    <span className="text-sm text-gray-600">
      Page {page} of {totalPages}
    </span>
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPage(Math.max(page - 1, 1))}
        disabled={page === 1}
      >
        Previous
      </Button>
      {Array.from({ length: totalPages }, (_, i) => (
        <Button
          key={i}
          variant={i + 1 === page ? 'default' : 'outline'}
          size="sm"
          className="px-3"
          onClick={() => setPage(i + 1)}
        >
          {i + 1}
        </Button>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPage(Math.min(page + 1, totalPages))}
        disabled={page === totalPages}
      >
        Next
      </Button>
    </div>
  </div>
);

// Phase 1 Table Component
interface CandidateTablePhase1Props {
  title: string;
  candidates: CandidateSelected[];
  error?: string | null;
}

export const CandidateTablePhase1: React.FC<CandidateTablePhase1Props> = ({
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
    <Card >
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <Table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-muted">
            <tr className="border-b">
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">Country</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr className='bg-background'>
                <td colSpan={5} className="py-4 text-center text-red-600 font-semibold">
                  {error}
                </td>
              </tr>
            ) : candidates.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500">
                  No candidates found.
                </td>
              </tr>
            ) : (
              pagedCandidates.map((c) => (
                <tr key={c.id} className="border-b hover:bg-muted/30 bg-background">
                  <td className="py-2 px-4">{c.name}</td>
                  <td className="py-2 px-4">{c.email}</td>
                  <td className="py-2 px-4">{c.phone}</td>
                  <td className="py-2 px-4">{c.address}, {c.city}</td>
                  <td className="py-2 px-4">{c.country}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
        <PaginationControls page={page} totalPages={totalPages} setPage={setPage} />
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

export const CandidateTableAccepted: React.FC<CandidateTableAcceptedProps> = ({
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
          <thead className="bg-muted">
            <tr className="border-b">
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">Score</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr className='bg-background'>
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
                <tr key={c.id} className="border-b hover:bg-muted/30 bg-background">
                  <td className="py-2 px-4">{c.name}</td>
                  <td className="py-2 px-4">{c.email}</td>
                  <td className="py-2 px-4">{c.score}%</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
        <PaginationControls page={page} totalPages={totalPages} setPage={setPage} />
      </CardContent>
    </Card>
  );
};

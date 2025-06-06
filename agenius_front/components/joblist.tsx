'use client';

import React, { useState } from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';

interface Job {
  id: string;
  name: string;
  company: string;
  description: string;
  numberOfCVs?: number;
}

interface Props {
  jobs: Job[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onShowDescription: (job: Job) => void;
}


const ITEMS_PER_PAGE = 7;

 function JobListTable({ jobs, onDelete, onEdit }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(jobs.length / ITEMS_PER_PAGE);

  const [expandedJobs, setExpandedJobs] = useState<string[]>([]);

  const toggleDescription = (id: string) => {
    setExpandedJobs((prev) =>
        prev.includes(id) ? prev.filter((jobId) => jobId !== id) : [...prev, id]
    );
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedJobs = jobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showCard, setShowCard] = useState(false);

  const handleShowDescription = (job: Job) => {
    setSelectedJob(job);
    setShowCard(true);
  };
  return (
      <div>
        <div className="border rounded-lg overflow-hidden flex flex-col">
          {/* Tableau (partie du haut) */}
          <div className="min-h-[380px]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Job Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Company</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Candidates</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {paginatedJobs.map((job) => {
                const isExpanded = expandedJobs.includes(job.id);
                const shortDesc = job.description.split(' ').slice(0, 4).join(' ') + '...';
                return (
                    <tr key={job.id} className='bg-background'>
                      <td className="px-4 py-3 font-medium ">{job.name}</td>
                      <td className="px-4 py-3">{job.company}</td>
                      <td className="px-4 py-3">{job.numberOfCVs ?? 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-3">
                          <Eye className="h-5 w-5 cursor-pointer text-foreground" onClick={() => handleShowDescription(job)} />
                          <Edit3 className="h-5 w-5 cursor-pointer" onClick={() => onEdit(job.id)} />
                          <Trash2 className="h-5 w-5 text-red-600 hover:text-red-800 cursor-pointer" onClick={() => onDelete(job.id)} />
                        </div>
                      </td>
                    </tr>
                );
              })}
              </tbody>
            </table>
          </div>
          {showCard && selectedJob && (
            <div className="absolute inset-0 z-50 bg-background/70 backdrop-blur-sm flex items-center justify-center">

                <Card className="w-[400px] shadow-lg z-50 bg-card">
                  <CardHeader>
                    <CardTitle className="text-card-foreground" >Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-card-foreground">{selectedJob.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="default"  onClick={() => setShowCard(false)}>
                      Close
                    </Button>
                  </CardFooter>
                </Card>
              </div>
          )}
        </div>
        <div>
          {/* Pagination fixée en bas, centrée */}
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, index) => (
                    <PaginationItem key={index}>
                      <button
                          onClick={() => setCurrentPage(index + 1)}
                          className={`px-3 py-1 rounded-md text-sm ${
                              currentPage === index + 1
                                  ? 'bg-primary text-white'
                                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                          }`}
                      >
                        {index + 1}
                      </button>
                    </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
  );
}
export default JobListTable;
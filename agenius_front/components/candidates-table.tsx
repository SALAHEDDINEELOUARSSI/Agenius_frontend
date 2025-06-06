'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Eye, Trash } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';

interface Candidate {
  id?: string;
  name: string;
}

interface Props {
  candidates: Candidate[];
  onView: (candidate: Candidate) => void;
  onDelete: (candidate: Candidate) => void;
}

const ITEMS_PER_PAGE = 6;

export default function CandidatesSimpleTable({ candidates, onView, onDelete }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(candidates.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCandidates = candidates.slice(startIndex, startIndex + ITEMS_PER_PAGE);

 return (
     <div>
   <div className="border rounded-lg overflow-hidden flex flex-col">
     {/* Zone scrollable avec min-height */}
     <div className="min-h-[380px]">
       <table className="min-w-full divide-y divide-gray-200">
         <thead className="bg-muted">
           <tr>
             <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">Candidate Name</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">Actions</th>
           </tr>
         </thead>
         <tbody className="bg-white divide-y divide-gray-200">
           {paginatedCandidates.map((candidate) => (
             <tr key={candidate.id ?? candidate.name} className='bg-background'>
               <td className="px-6 py-4 whitespace-nowrap font-medium">
                 {candidate.name.replace(/\.pdf$/i, '')}
               </td>
               <td className="px-6 py-4 whitespace-nowrap">
                 <div className="flex gap-4" >
                   <span
                     title="View"
                     onClick={() => onView(candidate)}
                     className="text-gray-700 hover:text-black cursor-pointer"
                   >
                     <Eye className="h-5 w-5 text-foreground" />
                   </span>
                   <span
                     title="Delete"
                     onClick={() => onDelete(candidate)}
                     className="text-red-600 hover:text-red-800 cursor-pointer"
                   >
                     <Trash className="h-5 w-5" />
                   </span>
                 </div>
               </td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>
</div>
<div>
     {/* Pagination */}
     <Pagination className="mt-4">
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
 );
}
'use client';

import React, { useEffect } from 'react';
import { Offer } from '../types/offer';
import StatusBadge from './StatusBadge';
import { Button } from './ui/button';
import { Play, StopCircle, Eye, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  offers: Offer[];
  onStart: (offer: Offer) => void;
  onStop?: (offer: Offer) => void;
  onViewResults: (offer: Offer) => void;
}

const formatDate = (date?: Date) => {
  if (!date) return '';
  return new Date(date).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function AgentTable({ offers, onStart, onStop, onViewResults }: Props) {
  const [prevOffers, setPrevOffers] = React.useState<Offer[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 7;

  const totalPages = Math.ceil(offers.length / itemsPerPage);
  const paginatedOffers = offers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getPhaseStatusText = (offer: Offer) => {
    if (!offer.phaseData) return 'Not configured';
    return offer.phaseData.phaseStatus === 0
      ? 'Phase 1 Only'
      : `Phase 2 (Deadline: ${offer.phaseData.deadline || 'Not set'})`;
  };

  useEffect(() => {
  offers.forEach(offer => {
    const prevOffer = prevOffers.find(o => o.id === offer.id);

    if (!prevOffer || JSON.stringify(offer.steps) !== JSON.stringify(prevOffer.steps)) {
     

      if (prevOffer && prevOffer.status !== offer.status) {
        let message = '';
        let type: 'success' | 'info' | 'error' = 'info';

        switch (offer.status) {
          case 'in-progress':
            message = `Processing started for ${offer.name}`;
            break;
          case 'finished-phase1':
            message = `Phase 1 completed for ${offer.name}`;
            type = 'success';
            break;
          case 'finished':
            message = `Processing completed for ${offer.name}`;
            type = 'success';
            break;
          case 'failed':
            message = `Processing failed for ${offer.name}`;
            type = 'error';
            break;
        }

        if (message) {
          toast[type](message, { position: 'bottom-right' });
        }
      }
    }
  });

  setPrevOffers(offers);
}, [offers, prevOffers]);


  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto max-h-[600px]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">CVs</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">Phase</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">Progress</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedOffers.map((offer) => {
              const effectiveStatus = offer.progressPercent === 100 ? 'finished' : offer.status;
              const isPhase1Completed = offer.phaseData?.phaseStatus === 0 && offer.status === 'finished-phase1';

              return (
                <tr key={offer.id} className='bg-background'>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{offer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{offer.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{offer.numberOfCVs}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={effectiveStatus} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-foreground">
                    {getPhaseStatusText(offer)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-green-500 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${offer.progressPercent}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {offer.progressPercent ?? 0}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      {effectiveStatus === 'not-started' && (
                        <Button
                          className="w-32"
                          size="sm"
                          onClick={() => onStart(offer)}
                          disabled={isPhase1Completed}
                          title={isPhase1Completed ? "Phase 1 already completed" : ""}
                        >
                          <Play className="h-4 w-4 mr-2" />Start
                        </Button>
                      )}

                     { }

                      {(effectiveStatus === 'failed' || (effectiveStatus === 'in-progress' && offer.progressPercent < 100)) && (
                        <Button variant="default" size="sm" className="w-32" onClick={() => onStart(offer)}>
                          <Play className="h-4 w-4 mr-2" /> Restart
                        </Button>
                      )}

                      {['waiting-responses','finished-phase1', 'finished'].includes(effectiveStatus) && (
                        <Button variant="secondary" size="sm" className="w-32 text-center" onClick={() => onViewResults(offer)}>
                          <Eye className="h-4 w-4 mr-2" /> Results
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center px-4 py-2 bg-background border-t">
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
      <div className="flex items-center gap-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
    >
      Previous
    </Button>

    {/* Page Numbers */}
    {Array.from({ length: totalPages }, (_, index) => (
      <Button
        key={index}
        variant={index + 1 === currentPage ? 'default' : 'outline'}
        size="sm"
        className="px-3"
        onClick={() => setCurrentPage(index + 1)}
      >
        {index + 1}
      </Button>
    ))}

    <Button
      variant="outline"
      size="sm"
      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
    >
      Next
    </Button>
  </div>
      </div>
    </div>
  );
}/* if (offer.steps?.forEach) {
        offer.steps.forEach(step => {
          if (
            step.completed &&
            (!prevOffer || !prevOffer.steps?.find(s =>
              s.name === step.name && s.completed !== step.completed
            ))
          ) {
            toast.success(
              <div className="flex items-start gap-3">
               
                <div>
                  <p className="font-medium">{step.name}</p>
                  {step.completedAt && (
                    <p className="text-xs text-gray-500">
                      Completed: {formatDate(step.completedAt)}
                    </p>
                  )}
                </div>
              </div>,
              { duration: 5000, position: 'bottom-right' }
            );
          }
        });
      }*//*onStop && effectiveStatus === 'in-progress' && offer.progressPercent === 100 && (
                        <Button variant="destructive" size="sm" className="w-32" onClick={() => onStop(offer)}>
                          <StopCircle className="h-4 w-4 mr-2" /> Stop
                        </Button>
                      )*/
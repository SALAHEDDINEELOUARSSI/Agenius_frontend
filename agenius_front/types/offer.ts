//types/offer.ts
export interface Offer {
  id: string;
  name: string;
  description?: string;
  company: string;
  numberOfCVs: number;
  status: 'not-started' | 'in-progress' | 'finished-phase1' | 'finished' | 'failed'|'waiting-responses';
  progressPercent: number;
  steps: ProcessingStep[];
  competencies?: string[];
  lastUpdated?: Date;
  phaseData?: PhaseData; // Add phase data reference
}

export interface ProcessingStep {
  name: string;
  completed: boolean;
  completedAt?: Date;
}

export interface PhaseData {
  offerName: string;
  phaseStatus: number; // 0 or 1
  deadline?: string;
  emailSent?: boolean; // Add email sent status
}


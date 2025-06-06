// utils/statusMapper.ts
import { Offer } from '../types/offer';
export const normalizeStatus = (status?: string): Offer['status'] => {
  switch ((status || '').toUpperCase()) {
    case 'NOT_STARTED': return 'not-started';
    case 'IN_PROGRESS': return 'in-progress';
    case 'FINISHED_PHASE1': return 'finished-phase1';
    case 'FINISHED': return 'finished';
    case 'FAILED': return 'failed';
    default: return 'not-started';
  }
};
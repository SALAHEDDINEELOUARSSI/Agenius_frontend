// service/offerProcessService.ts
// service/offerProcessService.ts
import axios from "axios";
import { Offer, PhaseData } from "@/types/offer";

const JOB_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8071";
const AGENT_BASE = process.env.NEXT_PUBLIC_AGENT_URL || "http://localhost:8070";


export const fetchJobs = async (token: string): Promise<Offer[]> => {
  const response = await axios.get(`${JOB_BASE}/user/api/jobs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data  as Offer[];
};

export const fetchPhaseData = async (
  offerName: string,
  token: string
): Promise<PhaseData> => {
  const response = await axios.get(`${JOB_BASE}/user/api/jobs/get-phase-data/${offerName}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data as PhaseData;
};

export const startAgent = async (offerName: string, phaseStatus: number, token: string) => {
  const endpoint = phaseStatus === 0 
    ? `/CandidatsSelected1/${encodeURIComponent(offerName)}`
    : `/CandidatsSelected/${encodeURIComponent(offerName)}`;
  
  await axios.get(`${AGENT_BASE}/user/api${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const stopAgent = async (offerName: string, token: string) => {
  await axios.post(
    `${AGENT_BASE}/user/api/stop-agent/${encodeURIComponent(offerName)}`,
    {}, // corps vide
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const savePhaseData = async (data: PhaseData, token: string) => {
  await axios.post(`${JOB_BASE}/user/api/jobs/save-phase-data`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const sendAcceptanceEmails = async (offerName: string, token: string): Promise<void> => {
  await axios.post(
    `${AGENT_BASE}/api/candidats/envoyer-mails`,
    { offerName },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

/*export const scheduleEmails = async (offerName: string, deadline: string, token: string) => {
  await axios.post(`${AGENT_BASE}/api/candidats/schedule-emails`, {
    offerName,
    deadline
  }, {
    headers: { Authorization: `Bearer ${token}` },
  });
}*/
// app/services/candidatService.ts
export interface CandidateSelected {
  id: string;
  name: string | undefined;
  email: string;
  phone: string | undefined;
  address: string | undefined;
  city: string  | undefined;
  country: string | undefined;
}

export interface CandidateAccepted extends CandidateSelected {
  score: number;
}

export const fetchSelectedCandidates = async (offerName: string, token: string): Promise<CandidateSelected[]> => {
  const response = await axios.get(`${AGENT_BASE}/user/api/getCandidatsSelected/${offerName}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data as CandidateSelected[];
};

export const fetchAcceptedCandidates = async (offerName: string, token: string): Promise<CandidateAccepted[]> => {
  const response = await axios.get(`${AGENT_BASE}/user/api/getCandidatsAccepted/${offerName}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("Response data:", response.data); // Debug log
  return response.data as CandidateAccepted[];
};

export const fetchAcceptedDefinitif = async (
  offerName: string,
  token: string
): Promise<CandidateAccepted[]> => {
  const response = await axios.get(
    `${AGENT_BASE}/user/api/getCandidatsAcceptedDefinitif/${offerName}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data as CandidateAccepted[];
};

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Briefcase, Building, FileText, ChevronLeft, X } from "lucide-react";
import useJobs from "@/components/hooks/useJobs";

interface JobData {
  name: string;
  description: string;
  company: string;
}

interface JobOfferFormProps {
  jobId?: string;
  onSave: (job: JobData) => void;
}

const JobOffersForm: React.FC<JobOfferFormProps> = ({ jobId, onSave }) => {
  const [job, setJob] = useState<JobData>({ name: "", description: "", company: "" });
  const [loading, setLoading] = useState<boolean>(!!jobId);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Partial<JobData>>({});
  const router = useRouter();

  useEffect(() => {
    if (!jobId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Utilisateur non authentifié");
      setLoading(false);
      return;
    }

    const fetchJob = async () => {
      try {
        const res = await fetch(`http://localhost:8071/user/api/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Impossible de récupérer l'offre d'emploi.");
        }

        const data = await res.json();
        setJob({ name: data.name, description: data.description, company: data.company });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setJob({ ...job, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let errors: Partial<JobData> = {};
    if (!job.name.trim()) errors.name = "Job name is required";
    if (!job.company.trim()) errors.company = "Company name is required";
    if (!job.description.trim()) errors.description = "Description is required";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSave(job);
  };

  return (
<div className="flex flex-col justify-center items-center min-h-screen max-h-screen overflow-y-auto px-4 py-6">
      <div className="w-full max-w-3xl px-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] mb-4"
        >
          <ChevronLeft className="mr-2 h-5 w-5" /> Back
        </button>
      </div>
      <div className="w-full px-8 md:px-20 lg:px-40">
  <div className="text-center mb-8">
    <p className="text-[color:var(--muted-foreground)] text-sm">
      Track a new job opportunity with details
    </p>
  </div>
          {loading ? (
            <p className="text-center text-[color:var(--muted-foreground)]">Loading job details...</p>
          ) : error ? (
            <p className="text-center text-[color:var(--destructive)]">{error}</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Name */}
              <div>
                <Label className="text-base font-medium flex items-center gap-2 m-2">
                  <Briefcase className="h-5 w-5 text-[color:var(--primary)]" /> Job name
                </Label>
                <Input
                  name="name"
                  placeholder="e.g. Frontend Developer"
                  value={job.name}
                  onChange={handleChange}
                  className={`border ${
                    validationErrors.name
                      ? "border-[color:var(--destructive)]"
                      : "border-[color:var(--border)]"
                  } focus:ring-[color:var(--primary)]`}
                />
                {validationErrors.name && (
                  <p className="text-[color:var(--destructive)] text-sm mt-1">{validationErrors.name}</p>
                )}
              </div>

              {/* Company */}
              <div>
                <Label className="text-base font-medium flex items-center gap-2 m-2">
                  <Building className="h-5 w-5 text-[color:var(--primary)]" /> Company
                </Label>
                <Input
                  name="company"
                  placeholder="e.g. Acme Inc."
                  value={job.company}
                  onChange={handleChange}
                  className={`border ${
                    validationErrors.company
                      ? "border-[color:var(--destructive)]"
                      : "border-[color:var(--border)]"
                  } focus:ring-[color:var(--primary)]`}
                />
                {validationErrors.company && (
                  <p className="text-[color:var(--destructive)] text-sm mt-1">{validationErrors.company}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label className="text-base font-medium flex items-center gap-2 m-2">
                  <FileText className="h-5 w-5 text-[color:var(--primary)]" /> Description
                </Label>
                <Textarea
                  name="description"
                  placeholder="Job description, requirements, or your notes about this opportunity..."
                  value={job.description}
                  onChange={handleChange}
                  rows={5}
                  className={`border ${
                    validationErrors.description
                      ? "border-[color:var(--destructive)]"
                      : "border-[color:var(--border)]"
                  } focus:ring-[color:var(--primary)]`}
                />
                {validationErrors.description && (
                  <p className="text-[color:var(--destructive)] text-sm mt-1">{validationErrors.description}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-[color:var(--border)] text-[color:var(--muted-foreground)] hover:bg-[color:var(--accent)] hover:text-[color:var(--accent-foreground)] ml-2 px-6 py-2 rounded-lg"
                >
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[color:var(--primary)] hover:bg-[color:var(--primary)]/90 text-[color:var(--primary-foreground)] px-6 py-2 rounded-lg"
                >
                  {jobId ? "Save Changes" : "Save Job"}
                </Button>
              </div>
            </form>
          )}
        </div>
    </div>
  );
};

export default JobOffersForm;

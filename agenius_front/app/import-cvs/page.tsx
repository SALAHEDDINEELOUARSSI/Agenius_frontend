

"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Page from "@/app/layout/layout";
import { SiteHeader } from "@/components/site-header";
import axios from "axios";
import * as React from "react";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  FileUpload,
  FileUploadTrigger,
  FileUploadDropzone,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemProgress,
  FileUploadItemDelete,
  FileUploadClear,
  useFileUpload,
} from "@/components/ui/file-upload";



interface Job {
  id: string;
  name: string;
}

interface CandidateFile {
  name: string;
}

function ImportCVs() {
  const [selectedOffer, setSelectedOffer] = useState<string>("");
  const [candidates, setCandidates] = useState<CandidateFile[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [endDate, setEndDate] = useState<string>("");
  const [endDate2, setEndDate2] = useState<string>("");
  const [selectedPhases, setSelectedPhases] = useState<string[]>([]);
  const [numberOfCVs, setNumberOfCVs] = useState(0);
  const [localFiles, setLocalFiles] = useState<File[]>([]); // Pour stocker les fichiers sélectionnés
  const [files, setFiles] = React.useState<File[]>([]);
  const [phaseStatus, setPhaseStatus] = useState(0);
  const [phase3, setPhase3] = useState(0);

  const [showUploader, setShowUploader] = useState(false);
  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8071/user/api/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setJobs(data);
    };

    fetchJobs();
  }, []);





  // Fonction upload + mise à jour du nombre de CVs + alerte
  const saveFilesAndUpdateCVCount = async () => {
    if (!selectedOffer) {
      alert("Veuillez sélectionner une offre avant de sauvegarder les fichiers.");
      return;
    }
    if (localFiles.length === 0) {
      alert("Aucun fichier sélectionné pour l'upload.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      localFiles.forEach((file) => formData.append("files", file, file.name));

      // Upload des fichiers
      const uploadResponse = await axios.post(
          `http://localhost:8070/user/api/${selectedOffer}/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
      );

      if (uploadResponse.status === 200) {
        // Mettre à jour la liste des candidats
        const updatedResponse = await axios.get(
            `http://localhost:8071/user/api/jobs/import-cvs/${selectedOffer}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
        );
        setCandidates(updatedResponse.data);

        // Mettre à jour le nombre de CVs dans la BDD (backend)
        const countResponse = await axios.get(
            `http://localhost:8070/user/api/${selectedOffer}/update `,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (countResponse.status === 200) {
          setNumberOfCVs(countResponse.data);
          alert("Data saved successfully!");
          setLocalFiles([]); // Reset fichiers locaux après upload réussi
        } else {
          alert("Erreur lors de la mise à jour du nombre de CVs.");
        }
      } else {
        alert("Erreur lors de l'upload des fichiers.");
      }
    } catch (err) {
      console.error("Erreur lors de l'upload:", err);
      alert("Erreur lors de l'upload des fichiers.");
    }
  };
  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);


  const saveData = async () => {
    const phaseStatus = selectedPhases.includes("Evaluation")? 1 : 0;
    const deadline = selectedPhases.includes("Evaluation") ? endDate : null;
    const phase3 = selectedPhases.includes("Final Selection") ? 1 : 0;
    const deadline2 = selectedPhases.includes("Final Selection") ? endDate2 : null;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
          "http://localhost:8071/user/api/jobs/save-phase-data",
          {
            phaseStatus,
            deadline,
            deadline2,
            phase3,
            offerName: selectedOffer,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
      );

      if (response.status === 200) {
        alert("Phase and deadline saved successfully!");
      } else {
        alert("Error saving phase data");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
      <Page>
        <SiteHeader title="Import CVs" />
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block font-medium mb-2 text-gray-700">Job Offer</label>
            <Select
                onValueChange={(value) => {
                  setSelectedOffer(value);
                }}
            >
              <SelectTrigger className="w-[250px] border border-gray-300 rounded-md">
                <SelectValue placeholder="Choose an Offer" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-md">
                {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.name}>
                      {job.name}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bouton Upload : ouvre la sélection fichiers et stocke localement */}
          <Button
              onClick={() => {
                if (!selectedOffer) {
                  alert("Please select a job offer");
                  return;
                }
                setShowUploader(true);
              }}
          >
            Upload CVs
          </Button>
          {showUploader && (
              <>
                {/* Arrière-plan flou */}
                <div className="fixed inset-0 bg-white/40 backdrop-blur-sm z-10" />

                {/* Boîte centrée avec FileUpload */}
                <div className="fixed inset-0 flex items-center justify-center z-20">
                  <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl">
                    <FileUpload
                        maxFiles={500}
                        maxSize={5 * 1024 * 1024}
                        className="w-full"
                        value={files}
                        onValueChange={setFiles}
                        onFileReject={onFileReject}
                        multiple
                    >
                      <FileUploadDropzone>
                        <div className="flex flex-col items-center gap-1 text-center">
                          <div className="flex items-center justify-center rounded-full border p-2.5">
                            <Upload className="size-6 text-muted-foreground" />
                          </div>
                          <p className="font-medium text-sm">Drag & drop files here</p>
                          <p className="text-muted-foreground text-xs">
                            Or click to browse (max 500 files, up to 5MB each)
                          </p>
                        </div>
                        <FileUploadTrigger asChild>
                          <Button variant="outline" size="sm" className="mt-2 w-fit" >
                            Browse files
                          </Button>
                        </FileUploadTrigger>
                      </FileUploadDropzone>

                      <FileUploadList className="max-h-60 overflow-y-auto">
                        {files.map((file, index) => (
                            <FileUploadItem key={index} value={file}>
                              <FileUploadItemPreview />
                              <FileUploadItemMetadata />
                              <FileUploadItemDelete asChild>
                                <Button variant="ghost" size="icon" className="size-7">
                                  <X />
                                </Button>
                              </FileUploadItemDelete>
                            </FileUploadItem>
                        ))}
                      </FileUploadList>

                      {/* Bouton Fermer */}
                      <div className="flex justify-end mt-4">
                        <Button
                            onClick={() => {
                              if (!selectedOffer) {
                                alert("Veuillez sélectionner une offre");
                                return;
                              }

                              if (files.length === 0) {
                                alert("Veuillez d'abord ajouter des fichiers.");
                                return;
                              }

                              // Étape essentielle : on copie les fichiers dans localFiles
                              setLocalFiles(files);

                              // On peut fermer la modale
                              setShowUploader(false);
                            }}
                        >
                          Ok
                        </Button>

                        <Button variant="ghost" onClick={() => setShowUploader(false)}>
                          Close
                        </Button>
                      </div>
                    </FileUpload>
                  </div>
                </div>
              </>
          )}




          {/* Nouveau bouton Save pour envoyer les fichiers au backend */}
          <div className="flex justify-end mt-4">

            <Button onClick={saveFilesAndUpdateCVCount} disabled={localFiles.length === 0} className="w-[150px]" >
              Save CVs
            </Button>
          </div>
          {/* Phases */}
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Hiring Workflow</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {["Pre-selection", "Evaluation", "Final Selection"].map((phase, index) => (
                  <label key={index} className="flex items-center gap-2 text-gray-700">
                    <input
                        type="checkbox"
                        value={phase}
                        checked={selectedPhases.includes(phase)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setSelectedPhases((prev) =>
                              checked
                                  ? [...prev, phase]
                                  : prev.filter((p) => p !== phase)
                          );
                        }}
                        className="accent-indigo-600"
                    />
                    <span>Phase {index + 1}: {phase}</span>
                  </label>
              ))}
            </div>
          </div>
          <div></div>
          {/* Deadline pour la phase 2 */}
          {selectedPhases.includes("Evaluation") && (
              <div className="mt-4">
                <label className="block font-medium mb-2 text-gray-700">Deadline (Phase 2)</label>
                <input
                    type="date"
                    className="border border-gray-300 rounded-md p-2"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                />
              </div>
          )}

          {/* Deadline pour la phase 3 */}
          {selectedPhases.includes("Final Selection") && (
              <div className="mt-4">
                <label className="block font-medium mb-2 text-gray-700">Deadline (Phase 3)</label>
                <input
                    type="date"
                    className="border border-gray-300 rounded-md p-2"
                    value={endDate2}
                    onChange={(e) => setEndDate2(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                />
              </div>
          )}


          {/* Enregistrement des phases */}
          <div className="flex justify-end mt-6">
            <Button
                onClick={saveData}
                disabled={!selectedOffer || selectedPhases.length === 0}
                className="w-[150px]"
            >
              Save Phases
            </Button>
          </div>
        </div>
      </Page>
  );
}

export default ImportCVs;
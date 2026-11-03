import { serverFetch } from "@/lib/serverFetch";
import { IPrescription, IPrescriptionItem } from "@/types/doctor.interface";

export const searchDrugs = async (query: string) => {
  try {
    const res = await serverFetch.get(`/prescription/drugs?q=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Failed to search drugs:", error);
    return [];
  }
};

export const getPrescriptions = async (query?: {
  page?: number;
  limit?: number;
  patientId?: string;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: string;
}) => {
  try {
    const params = new URLSearchParams();
    if (query?.page) params.append("page", query.page.toString());
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.patientId) params.append("patientId", query.patientId);
    if (query?.searchTerm) params.append("searchTerm", query.searchTerm);
    if (query?.sortBy) params.append("sortBy", query.sortBy);
    if (query?.sortOrder) params.append("sortOrder", query.sortOrder);

    const res = await serverFetch.get(`/prescription?${params.toString()}`);
    if (!res.ok) return { data: [], meta: { page: 1, limit: 10, total: 0, totalPage: 1 } };
    return await res.json();
  } catch (error) {
    console.error("Failed to get prescriptions:", error);
    return { data: [], meta: { page: 1, limit: 10, total: 0, totalPage: 1 } };
  }
};

export const getMyPrescriptions = async (): Promise<IPrescription[]> => {
  try {
    const res = await serverFetch.get("/prescription/my-prescriptions", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Failed to get patient prescriptions:", error);
    return [];
  }
};

export const getPrescriptionById = async (id: string): Promise<IPrescription | null> => {
  try {
    const res = await serverFetch.get(`/prescription/${id}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error("Failed to get prescription:", error);
    return null;
  }
};

export const createPrescription = async (payload: {
  patientId: string;
  appointmentId?: string;
  chiefComplaints?: string | string[];
  clinicalFindings?: string;
  diagnosis?: string;
  diagnoses?: string[];
  advice?: string;
  adviceBangla?: string;
  adviceEnglish?: string;
  followUpDate?: string;
  nextFollowUpDate?: string;
  items: IPrescriptionItem[];
}) => {
  const normalizedItems = (payload.items || []).map((item) => ({
    drugName: item.brandName || (item as any).drugName || "Medicine",
    genericName: item.genericName || undefined,
    form: item.form || "Tablet",
    strength: item.strength || undefined,
    dose: item.dosage || (item as any).dose || "1 tablet",
    frequency: item.dosage || (item as any).frequency || "1+0+1",
    duration: item.duration || "5 days",
    instruction: item.instruction || "After meal",
    route: (item as any).route || "Oral",
  }));

  const normalizedPayload = {
    patientId: payload.patientId,
    appointmentId: payload.appointmentId || undefined,
    chiefComplaints:
      typeof payload.chiefComplaints === "string"
        ? payload.chiefComplaints
          ? [payload.chiefComplaints]
          : []
        : payload.chiefComplaints || [],
    diagnoses:
      payload.diagnoses || (payload.diagnosis ? [payload.diagnosis] : []),
    adviceEnglish: payload.adviceEnglish || payload.advice || undefined,
    nextFollowUpDate:
      (payload.nextFollowUpDate || payload.followUpDate || "").trim() ||
      undefined,
    items: normalizedItems,
  };

  const res = await serverFetch.post("/prescription", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(normalizedPayload),
  });
  return res.json();
};

export const verifyPrescription = async (token: string) => {
  try {
    const res = await serverFetch.get(`/prescription/verify/${token}`);
    if (!res.ok) return { valid: false, message: "Invalid or expired prescription verification token." };
    const json = await res.json();
    return { valid: true, data: json.data };
  } catch (error) {
    return { valid: false, message: "Verification failed. Please contact the chamber." };
  }
};

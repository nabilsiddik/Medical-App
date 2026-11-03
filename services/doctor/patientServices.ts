import { serverFetch } from "@/lib/serverFetch";
import { IPatient, IVitalSign } from "@/types/doctor.interface";

export const getPatients = async (query?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  gender?: string;
  bloodGroup?: string;
  sortBy?: string;
  sortOrder?: string;
}) => {
  try {
    const params = new URLSearchParams();
    if (query?.page) params.append("page", query.page.toString());
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.searchTerm) params.append("searchTerm", query.searchTerm);
    if (query?.gender && query.gender !== "ALL") params.append("gender", query.gender);
    if (query?.bloodGroup && query.bloodGroup !== "ALL") params.append("bloodGroup", query.bloodGroup);
    if (query?.sortBy) params.append("sortBy", query.sortBy);
    if (query?.sortOrder) params.append("sortOrder", query.sortOrder);

    const res = await serverFetch.get(`/patient?${params.toString()}`);
    if (!res.ok) return { data: [], meta: { page: 1, limit: 10, total: 0, totalPage: 1 } };
    return await res.json();
  } catch (error) {
    console.error("Failed to load patients:", error);
    return { data: [], meta: { page: 1, limit: 10, total: 0, totalPage: 1 } };
  }
};

export const getPatientById = async (id: string): Promise<(IPatient & { timeline?: any[] }) | null> => {
  try {
    const res = await serverFetch.get(`/patient/${id}`);
    if (!res.ok) return null;
    const json = await res.json();
    const data = json.data;
    if (data && data.patient) {
      return {
        ...data.patient,
        timeline: data.timeline || [],
      };
    }
    return data || null;
  } catch (error) {
    console.error("Failed to load patient:", error);
    return null;
  }
};

export const createPatient = async (data: Partial<IPatient>) => {
  const res = await serverFetch.post("/patient", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const recordVitalSign = async (patientId: string, vitals: Partial<IVitalSign>) => {
  const res = await serverFetch.post(`/patient/${patientId}/vitals`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vitals),
  });
  return res.json();
};

import { serverFetch } from "@/lib/serverFetch";
import { IPatient, IVitalSign } from "@/types/doctor.interface";

export const getPatients = async (query?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  gender?: string;
}) => {
  try {
    const params = new URLSearchParams();
    if (query?.page) params.append("page", query.page.toString());
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.searchTerm) params.append("searchTerm", query.searchTerm);
    if (query?.gender) params.append("gender", query.gender);

    const res = await serverFetch.get(`/patient?${params.toString()}`);
    if (!res.ok) return { data: [], meta: { page: 1, limit: 10, total: 0, totalPage: 1 } };
    return await res.json();
  } catch (error) {
    console.error("Failed to load patients:", error);
    return { data: [], meta: { page: 1, limit: 10, total: 0, totalPage: 1 } };
  }
};

export const getPatientById = async (id: string): Promise<IPatient | null> => {
  try {
    const res = await serverFetch.get(`/patient/${id}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
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

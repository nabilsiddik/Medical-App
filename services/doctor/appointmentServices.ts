import { serverFetch } from "@/lib/serverFetch";
import { IAppointment, IQueueItem, AppointmentStatus } from "@/types/doctor.interface";

export const getAvailableSlots = async (
  chamberId: string,
  date: string,
  serviceId?: string
) => {
  try {
    const params = new URLSearchParams({ chamberId, date });
    if (serviceId) params.append("serviceId", serviceId);
    const res = await serverFetch.get(`/appointment/availability?${params.toString()}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data?.slots || json.data || [];
  } catch (error) {
    console.error("Failed to load slots:", error);
    return [];
  }
};

export const bookAppointment = async (payload: {
  chamberId?: string;
  chamberLocationId?: string;
  serviceId?: string;
  appointmentDate: string;
  startTime: string;
  patientName?: string;
  fullName?: string;
  patientPhone?: string;
  phone?: string;
  patientEmail?: string;
  email?: string;
  patientAge?: number;
  patientGender?: "MALE" | "FEMALE" | "OTHER";
  gender?: string;
  chiefComplaint?: string;
  reasonForVisit?: string;
  type?: "IN_PERSON" | "VIDEO_CALL";
}) => {
  const normalizedPayload = {
    chamberLocationId: payload.chamberLocationId || payload.chamberId,
    serviceId: payload.serviceId || undefined,
    appointmentDate: payload.appointmentDate,
    startTime: payload.startTime,
    fullName: payload.fullName || payload.patientName,
    phone: payload.phone || payload.patientPhone,
    email: payload.email || payload.patientEmail || undefined,
    gender: payload.gender || payload.patientGender || "MALE",
    reasonForVisit: payload.reasonForVisit || payload.chiefComplaint || "General consultation",
  };

  const res = await serverFetch.post("/appointment/book", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(normalizedPayload),
  });
  return res.json();
};

export const getAppointments = async (query?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
  date?: string;
  chamberId?: string;
}) => {
  try {
    const params = new URLSearchParams();
    if (query?.page) params.append("page", query.page.toString());
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.searchTerm) params.append("searchTerm", query.searchTerm);
    if (query?.status) params.append("status", query.status);
    if (query?.date) params.append("date", query.date);
    if (query?.chamberId) params.append("chamberId", query.chamberId);

    const res = await serverFetch.get(`/appointment?${params.toString()}`);
    if (!res.ok) return { data: [], meta: { page: 1, limit: 10, total: 0, totalPage: 1 } };
    const json = await res.json();
    return json;
  } catch (error) {
    console.error("Failed to get appointments:", error);
    return { data: [], meta: { page: 1, limit: 10, total: 0, totalPage: 1 } };
  }
};

// Patient: Fetch own appointments
export const getMyAppointments = async (): Promise<IAppointment[]> => {
  try {
    const res = await serverFetch.get("/appointment/my-appointments", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Failed to get patient appointments:", error);
    return [];
  }
};

// Patient: Cancel appointment (Non-refundable per policy, slot freed)
export const cancelAppointmentByPatient = async (
  id: string,
  reason?: string
) => {
  const res = await serverFetch.patch(`/appointment/${id}/cancel`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason: reason || "Cancelled by patient" }),
  });
  return res.json();
};

// Doctor: Cancel appointment (Option to refund)
export const cancelAppointmentByDoctor = async (
  id: string,
  payload: {
    reason: string;
    isRefunded?: boolean;
    refundAmount?: number;
  }
) => {
  const res = await serverFetch.patch(`/appointment/${id}/cancel-by-doctor`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
};

// Doctor: Issue refund for cancelled appointment
export const refundAppointment = async (
  id: string,
  payload: {
    refundAmount: number;
    reason?: string;
  }
) => {
  const res = await serverFetch.post(`/appointment/${id}/refund`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const updateAppointmentStatus = async (
  id: string,
  status: AppointmentStatus
) => {
  const res = await serverFetch.patch(`/appointment/${id}/status`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return res.json();
};

export const checkInAppointment = async (id: string) => {
  const res = await serverFetch.post(`/appointment/${id}/check-in`);
  return res.json();
};

export const callNextInQueue = async (chamberLocationId?: string) => {
  try {
    const query = chamberLocationId ? `?chamberLocationId=${chamberLocationId}` : "";
    const res = await serverFetch.post(`/appointment/queue/next${query}`);
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err?.message || "Failed to advance queue" };
  }
};

export const getLiveQueue = async (chamberId?: string): Promise<IQueueItem[]> => {
  try {
    const url = chamberId ? `/appointment/queue?chamberId=${chamberId}` : "/appointment/queue";
    const res = await serverFetch.get(url, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    if (Array.isArray(json.data)) return json.data;
    if (json.data && typeof json.data === "object") {
      const items: IQueueItem[] = [];
      if (json.data.nowServing) items.push(json.data.nowServing);
      if (Array.isArray(json.data.waitingList)) items.push(...json.data.waitingList);
      if (Array.isArray(json.data.upcomingToday)) items.push(...json.data.upcomingToday);
      return items;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch live queue:", error);
    return [];
  }
};

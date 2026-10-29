import { serverFetch } from "@/lib/serverFetch";
import {
  IClinicSettings,
  IPublicSiteConfig,
  IChamberLocation,
} from "@/types/doctor.interface";

export const getPublicSiteConfig = async (): Promise<IPublicSiteConfig | null> => {
  try {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000/api/v1";
    const res = await fetch(`${serverUrl}/public/site-config`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error("Failed to load public site config:", error);
    return null;
  }
};

export const getClinicSettings = async (): Promise<IClinicSettings | null> => {
  try {
    const res = await serverFetch.get("/clinic/settings");
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error("Failed to fetch clinic settings:", error);
    return null;
  }
};

export const updateClinicSettings = async (data: Partial<IClinicSettings>) => {
  const res = await serverFetch.patch("/clinic/settings", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateBranding = async (data: {
  primaryColor?: string;
  secondaryColor?: string;
  brandName?: string;
  clinicName?: string;
  brandTagline?: string;
  logoUrl?: string;
  faviconUrl?: string;
}) => {
  const res = await serverFetch.patch("/clinic/branding", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getChamberLocations = async (): Promise<IChamberLocation[]> => {
  try {
    const res = await serverFetch.get("/clinic/locations");
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Failed to fetch chambers:", error);
    return [];
  }
};

export const createChamberLocation = async (data: Partial<IChamberLocation>) => {
  const res = await serverFetch.post("/clinic/locations", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateChamberLocation = async (
  id: string,
  data: Partial<IChamberLocation>
) => {
  const res = await serverFetch.patch(`/clinic/locations/${id}`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteChamberLocation = async (id: string) => {
  const res = await serverFetch.delete(`/clinic/locations/${id}`);
  return res.json();
};

export const updateLocationSchedules = async (
  chamberLocationId: string,
  schedules: any[]
) => {
  const res = await serverFetch.post(
    `/clinic/locations/${chamberLocationId}/schedules`,
    {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schedules }),
    }
  );
  return res.json();
};

export const getServices = async () => {
  try {
    const res = await serverFetch.get("/service", { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
};

export const getServiceBySlug = async (slug: string) => {
  try {
    const res = await serverFetch.get(`/service/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error("Failed to fetch service by slug:", error);
    return null;
  }
};

export const createService = async (data: any) => {
  const res = await serverFetch.post("/service", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateService = async (id: string, data: any) => {
  const res = await serverFetch.patch(`/service/${id}`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteService = async (id: string) => {
  const res = await serverFetch.delete(`/service/${id}`);
  return res.json();
};

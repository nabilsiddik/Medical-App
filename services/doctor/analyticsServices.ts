import { serverFetch } from "@/lib/serverFetch";
import { IDoctorAnalytics } from "@/types/doctor.interface";

export const getDoctorAnalyticsOverview = async (): Promise<IDoctorAnalytics | null> => {
  try {
    const res = await serverFetch.get("/analytics/overview", {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error("Failed to load doctor analytics overview:", error);
    return null;
  }
};


import { serverFetch } from "@/lib/serverFetch";
import { IReportKPI } from "@/types/doctor.interface";

export const getDashboardOverview = async (): Promise<IReportKPI | null> => {
  try {
    const res = await serverFetch.get("/report/overview", {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error("Failed to load dashboard overview:", error);
    return null;
  }
};

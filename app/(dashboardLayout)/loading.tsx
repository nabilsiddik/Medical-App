import MedicalSpikeLoader from "@/components/shared/MedicalSpikeLoader";

export default function DashboardLoading() {
  return (
    <div className="py-20 flex items-center justify-center min-h-[60vh]">
      <MedicalSpikeLoader
        text="Loading Doctor Dashboard"
        subText="Fetching live appointments, schedules, and clinical telemetry..."
      />
    </div>
  );
}


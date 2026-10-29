import MedicalSpikeLoader from "@/components/shared/MedicalSpikeLoader";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <MedicalSpikeLoader
        text="Loading Medical Portal"
        subText="Connecting clinical database & active chamber schedules..."
      />
    </div>
  );
}


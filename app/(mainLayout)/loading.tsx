import MedicalSpikeLoader from "@/components/shared/MedicalSpikeLoader";

export default function MainLayoutLoading() {
  return (
    <div className="py-24 flex items-center justify-center min-h-[50vh]">
      <MedicalSpikeLoader
        text="Loading Medical Care Chamber"
        subText="Preparing healthcare information & verified doctor appointments..."
      />
    </div>
  );
}


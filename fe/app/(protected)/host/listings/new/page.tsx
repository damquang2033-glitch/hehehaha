"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import StepAboutPlace from "./_steps/StepAboutPlace";
import StepStructure from "./_steps/StepStructure";
import StepLocation from "./_steps/StepLocation";
import StepGuests from "./_steps/StepGuests";
import StepAmenities from "./_steps/StepAmenities";
import StepPhotos from "./_steps/StepPhotos";
import StepDescription from "./_steps/StepDescription";
import StepPrice from "./_steps/StepPrice";

function StepRenderer() {
  const searchParams = useSearchParams();
  const step = parseInt(searchParams.get("step") ?? "1");

  switch (step) {
    case 1: return <StepAboutPlace />;
    case 2: return <StepStructure />;
    case 3: return <StepLocation />;
    case 4: return <StepGuests />;
    case 5: return <StepAmenities />;
    case 6: return <StepPhotos />;
    case 7: return <StepDescription />;
    case 8: return <StepPrice />;
    default: return <StepAboutPlace />;
  }
}

export default function NewListingPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <StepRenderer />
    </Suspense>
  );
}
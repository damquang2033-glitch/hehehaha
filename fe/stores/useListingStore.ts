import { create } from "zustand";

export type ListingFormData = {
  // Step 1 - About your place
  propertyType: string;
  rentalType: "entire" | "private" | "shared" | "";

  // Step 2 - Structure
  structure: string;

  // Step 3 - Location
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;

  // Step 4 - Guests
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;

  // Step 5 - Amenities
  amenities: string[];

  // Step 6 - Photos
  photos: string[];

  // Step 7 - Title & Description
  title: string;
  description: string;

  // Step 8 - Price
  pricePerNight: number;
};

type ListingStore = {
  step: number;
  totalSteps: number;
  formData: ListingFormData;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<ListingFormData>) => void;
  reset: () => void;
};

const initialFormData: ListingFormData = {
  propertyType: "",
  rentalType: "",
  structure: "",
  address: "",
  city: "",
  country: "Việt Nam",
  latitude: undefined,
  longitude: undefined,
  maxGuests: 1,
  bedrooms: 1,
  beds: 1,
  bathrooms: 1,
  amenities: [],
  photos: [],
  title: "",
  description: "",
  pricePerNight: 0,
};

export const useListingStore = create<ListingStore>((set) => ({
  step: 1,
  totalSteps: 8,
  formData: initialFormData,

  setStep: (step) => set({ step }),

  nextStep: () =>
    set((state) => ({
      step: Math.min(state.step + 1, state.totalSteps),
    })),

  prevStep: () =>
    set((state) => ({
      step: Math.max(state.step - 1, 1),
    })),

  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  reset: () => set({ step: 1, formData: initialFormData }),
}));
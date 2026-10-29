"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { IBrandingConfig, IPublicSiteConfig } from "@/types/doctor.interface";
import { generateCssVariables } from "@/utils/colorUtils";

interface BrandingContextType {
  branding: IBrandingConfig;
  updateBrandingState: (newBranding: Partial<IBrandingConfig>) => void;
  siteConfig: IPublicSiteConfig | null;
}

const defaultBranding: IBrandingConfig = {
  brandName: "Dr. Sarah's Care Chamber",
  brandTagline: "Trusted Clinical Care & Preventive Health",
  primaryColor: "#0284c7", // Sky/Teal 600
  secondaryColor: "#0f766e", // Teal 700
  primaryForeground: "#ffffff",
  secondaryForeground: "#ffffff",
};

const BrandingContext = createContext<BrandingContextType>({
  branding: defaultBranding,
  updateBrandingState: () => {},
  siteConfig: null,
});

export const useBranding = () => useContext(BrandingContext);

interface BrandingProviderProps {
  initialConfig?: IPublicSiteConfig | null;
  children: React.ReactNode;
}

export function BrandingProvider({
  initialConfig,
  children,
}: BrandingProviderProps) {
  const [branding, setBranding] = useState<IBrandingConfig>(() => {
    if (typeof window !== "undefined") {
      try {
        const local = localStorage.getItem("clinic_branding");
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed?.primaryColor) return { ...defaultBranding, ...parsed };
        }
      } catch {}
    }
    return initialConfig?.branding || defaultBranding;
  });

  const [siteConfig, setSiteConfig] = useState<IPublicSiteConfig | null>(
    initialConfig || null
  );

  // Sync with server and local storage
  useEffect(() => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000/api/v1";

    fetch(`${serverUrl}/public/site-config`, { cache: "no-store" })
      .then((res) => res.json())
      .then((res) => {
        if (res.data?.branding) {
          setBranding((prev) => ({
            ...prev,
            ...res.data.branding,
          }));
          setSiteConfig(res.data);
          try {
            localStorage.setItem("clinic_branding", JSON.stringify(res.data.branding));
          } catch {}
        }
      })
      .catch(() => {});

    // Listen to cross-tab storage changes
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "clinic_branding" && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          setBranding((prev) => ({ ...prev, ...updated }));
        } catch {}
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const updateBrandingState = (newBranding: Partial<IBrandingConfig>) => {
    setBranding((prev) => {
      const merged = { ...prev, ...newBranding };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("clinic_branding", JSON.stringify(merged));
        } catch {}
      }
      return merged;
    });
  };

  const dynamicStyles = generateCssVariables(
    branding.primaryColor || "#0284c7",
    branding.secondaryColor || "#0f766e"
  );

  return (
    <BrandingContext.Provider
      value={{
        branding,
        updateBrandingState,
        siteConfig,
      }}
    >
      <style
        id="dynamic-branding-vars"
        dangerouslySetInnerHTML={{ __html: dynamicStyles }}
      />
      {children}
    </BrandingContext.Provider>
  );
}

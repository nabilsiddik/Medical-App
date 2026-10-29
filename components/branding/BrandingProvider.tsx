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
  const [branding, setBranding] = useState<IBrandingConfig>(
    initialConfig?.branding || defaultBranding
  );
  const [siteConfig, setSiteConfig] = useState<IPublicSiteConfig | null>(
    initialConfig || null
  );

  useEffect(() => {
    if (!initialConfig) {
      // Client-side fallback fetch
      fetch("/api/v1/public/site-config")
        .then((res) => res.json())
        .then((res) => {
          if (res.data?.branding) {
            setBranding(res.data.branding);
            setSiteConfig(res.data);
          }
        })
        .catch(() => {
          // Gracefully keep defaultBranding
        });
    }
  }, [initialConfig]);

  const updateBrandingState = (newBranding: Partial<IBrandingConfig>) => {
    setBranding((prev) => ({
      ...prev,
      ...newBranding,
    }));
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

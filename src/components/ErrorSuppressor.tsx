"use client";

import { useEffect } from "react";

/**
 * Suppresses known non-critical third-party console errors 
 * to prevent the Next.js development overlay from hijacking the screen.
 */
export function ErrorSuppressor() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const originalConsoleError = console.error;

    console.error = (...args: any[]) => {
      // Travelpayouts script throws "config is not valid" internally
      // because of local development environment or missing external parameters.
      if (typeof args[0] === "string" && args[0].includes("config is not valid")) {
        return; 
      }
      
      // Pass through all other errors
      originalConsoleError.apply(console, args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  return null;
}

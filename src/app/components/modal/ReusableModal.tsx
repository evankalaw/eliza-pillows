"use client";

import React, { useState, useEffect } from "react";
import { HexagonBorder } from "../borders/HexagonBorder";

interface ReusableModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string; // Optional class for the outer div
  borderClassName?: string; // Optional class for NotchedBorder
  noOffset?: boolean; // Prop for NotchedBorder
}

const ANIMATION_DURATION = 300; // ms

export default function ReusableModal({
  open,
  onClose,
  children,
  className = "",
  borderClassName = "",
  noOffset = true,
}: ReusableModalProps) {
  const [isVisible, setIsVisible] = useState(open);
  const [shouldRender, setShouldRender] = useState(open);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let visibilityTimeoutId: NodeJS.Timeout; // Add timeout ID for visibility

    if (open) {
      setShouldRender(true);
      // Use a slightly longer timeout to ensure the component renders with opacity-0 first
      visibilityTimeoutId = setTimeout(() => {
        setIsVisible(true);
      }, 50); // Increased delay (e.g., 50ms)
    } else {
      setIsVisible(false);
      timeoutId = setTimeout(() => {
        setShouldRender(false);
      }, ANIMATION_DURATION);
    }

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(visibilityTimeoutId); // Clear the visibility timeout on cleanup
    };
  }, [open]);

  // Only render the DOM if shouldRender is true
  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center ${className} flex flex-col transition-opacity duration-300 ease-out ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      // pointer-events-none when hidden prevents interaction during fade-out
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content using NotchedBorder - apply transition too */}
      <HexagonBorder
        className={`relative z-10 max-w-3xl w-full transition-all duration-300 ease-out ${borderClassName} ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        noOffset={noOffset}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </HexagonBorder>

      {/* Close Button - apply transition too */}
      <div
        className={`cursor-pointer border-1 transition-all duration-300 ease-out hover:bg-white hover:text-black border-white p-2 bg-black relative z-20 mt-4 ${
          isVisible ? "opacity-100" : "opacity-0"
        } w-10 h-10 flex items-center justify-center`}
        onClick={onClose}
      >
        <span className="">X</span>
      </div>
    </div>
  );
}

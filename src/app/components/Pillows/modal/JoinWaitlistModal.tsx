"use client";

import React, { useState, useEffect } from "react";
// import { HexagonBorder } from "@/components/border/HexagonBorder"; // Assuming path, adjust if needed - COMMENTED OUT
// import HexagonButton from "@/components/button/HexagonButton"; // Assuming path, adjust if needed - COMMENTED OUT
// import useMailchimpSubscribe from "@/hooks/useMailchimpSubscribe"; // Assuming path, adjust if needed - COMMENTED OUT

interface JoinWaitlistModalProps {
  open: boolean;
  onClose: () => void;
}

export default function JoinWaitlistModal({
  open,
  onClose,
}: JoinWaitlistModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");

  // --- Mock Mailchimp Hook --- (Replace with actual import when available)
  const useMailchimpSubscribe = () => ({
    mutateAsync: async (email: string) => {
      console.log("Mock Mailchimp Submit:", email);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
      // Simulate success/error
      if (email.includes("error"))
        throw new Error("Mock error: Invalid email.");
      return { success: true };
    },
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
  });
  const { mutateAsync, isPending, isSuccess, isError, error } =
    useMailchimpSubscribe();
  // --- End Mock Mailchimp Hook ---

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose(); // Call the original onClose passed via props
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await mutateAsync(email);
      // Only clear email on successful submission (or handle based on actual hook behavior)
      // setEmail(""); // You might want success state handling before clearing
    } catch (submitError) {
      console.error("Submission Error:", submitError);
    }
  };

  useEffect(() => {
    // Clear email field upon successful submission
    if (isSuccess) {
      setEmail("");
    }
  }, [isSuccess]);

  if (!isVisible && !open) return null; // Keep this check

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center ${
        isVisible ? "visible" : "invisible"
      } ${isAnimating ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: isAnimating
            ? "rgba(0, 0, 0, 0.50)"
            : "rgba(0, 0, 0, 0)",
          transitionProperty: "background-color",
          transitionDuration: "300ms",
          transitionTimingFunction: "ease-in-out",
          pointerEvents: isAnimating ? "auto" : "none",
        }}
        onClick={handleClose}
      />

      {/* Modal Content Wrapper - Apply transition here */}
      {/* Using a simple div instead of HexagonBorder for now */}
      <div
        className={`relative z-10 transform transition-all duration-300 ease-in-out max-w-md w-full bg-black border border-white ${
          // TEMP BORDER
          isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{ pointerEvents: "auto" }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()} // Prevent clicks inside modal from closing it
      >
        {/* Inner Content Styling */}
        <div className="py-6 px-12 text-white font-ptserif shadow-xl">
          <div className="flex justify-between items-center mb-4 text-center">
            <h2 className="text-[20px] sm:text-[24px] font-bold mx-auto">
              Join Waitlist
            </h2>
          </div>
          <div className="flex flex-col gap-4 mt-4 text-center">
            {!isSuccess && (
              <p className="text-[24px] sm:text-[24px]">
                Enter your information to get notified of future drops.
              </p>
            )}
            {isSuccess && (
              <p className="text-green-500 text-[20px] sm:text-[24px]">
                You&apos;ve successfully signed up to receive updates.
              </p>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {!isSuccess && (
                <input
                  type="email"
                  placeholder="Email"
                  required
                  className="bg-black border-1 border-white px-4 py-2 text-center outline-none text-[16px] sm:text-[18px]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isPending}
                />
              )}
              {!isSuccess && (
                <p className="text-[20px] sm:text-[24px]">
                  By submitting your email, you&apos;re giving Eliza permission
                  to send you emails.
                </p>
              )}
              {isError && (
                <p
                  className={`text-[14px] sm:text-[16px] ${
                    // Check if error is an object and has status 400 for yellow, otherwise red
                    typeof error === "object" &&
                    error !== null &&
                    "status" in error &&
                    (error as { status?: number }).status === 400
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {/* Display error message safely */}
                  {typeof error === "object" &&
                  error !== null &&
                  "message" in error
                    ? String((error as Error).message)
                    : String(error)}
                </p>
              )}
              <div className="flex justify-center">
                {/* Placeholder Button - Remove when HexagonButton is available */}
                {!isSuccess ? (
                  <button
                    type="submit"
                    disabled={isPending}
                    className="bg-white text-black px-4 py-2 rounded-md cursor-pointer disabled:opacity-50"
                  >
                    {isPending ? "Submitting..." : "Submit"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleClose}
                    className="bg-white text-black px-4 py-2 rounded-md cursor-pointer"
                  >
                    Close
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

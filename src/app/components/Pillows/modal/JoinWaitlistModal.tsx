"use client";

import React, { useState, useEffect } from "react";
import ReusableModal from "../../modal/ReusableModal"; // Import the reusable modal
import useMailchimpSubscribe from "@/app/hooks/useMailchimpSubscribe";
import HexagonButton from "../../HexagonButton";

interface JoinWaitlistModalProps {
  open: boolean;
  onClose: () => void;
}

export default function JoinWaitlistModal({
  open,
  onClose,
}: JoinWaitlistModalProps) {
  const [email, setEmail] = useState("");

  const { mutateAsync, isPending, isSuccess, isError, error } =
    useMailchimpSubscribe();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await mutateAsync(email);
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

  return (
    // Use ReusableModal component
    <ReusableModal
      open={open}
      onClose={onClose}
      borderClassName="max-w-md w-full bg-black"
      noOffset={true}
    >
      {/* Inner Content Styling */}
      <div className="py-6 px-12 text-white font-ptserif shadow-xl">
        <div className="flex justify-between items-center mb-4 text-center">
          <h2 className="text-[20px] sm:text-[24px] font-bold mx-auto">
            Join Waitlist
          </h2>
        </div>
        <div className="flex flex-col gap-4 mt-4 text-center">
          <p className="text-[24px] sm:text-[24px]">
            Enter your information to get notified of future drops.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              required
              className="bg-black border-1 border-white px-4 py-2 text-center outline-none text-[16px] sm:text-[18px]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
            />
            {isSuccess && (
              <p className="text-studios-orange text-[20px] sm:text-[24px]">
                You&apos;ve successfully signed up to receive updates.
              </p>
            )}
            {isError && (
              <p
                className={`text-[20px] sm:text-[24px] ${
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
            <p className="text-[20px] sm:text-[24px]">
              By submitting your email, you&apos;re giving Eliza permission to
              send you emails.
            </p>
            <div className="flex justify-center">
              <HexagonButton
                type="submit"
                disabled={isPending}
                className="bg-white text-black px-4 py-2 rounded-md cursor-pointer disabled:opacity-50"
              >
                {isPending ? "Submitting..." : "Submit"}
              </HexagonButton>
            </div>
          </form>
        </div>
      </div>
    </ReusableModal>
  );
}

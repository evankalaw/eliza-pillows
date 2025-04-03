"use client";

import React, { useState } from "react";
import ReusableModal from "../../modal/ReusableModal";

interface JoinWaitlistModalProps {
  open: boolean;
  onClose: () => void;
}

export default function JoinWaitlistModal({
  open,
  onClose,
}: JoinWaitlistModalProps) {
  const [email, setEmail] = useState("");

  return (
    <ReusableModal open={open} onClose={onClose} borderClassName="p-10">
      <div className="py-6 px-12 text-white font-ptserif bg-black shadow-xl">
        <div className="flex justify-between items-center mb-4 text-center">
          <h2 className="text-[24px] font-bold mx-auto">Join Waitlist</h2>
        </div>
        <div className="flex flex-col gap-4 mt-4 text-center">
          <p className="text-[36px]">
            Enter your information to get notified of future drops.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("submit", email);
              onClose();
            }}
            className="flex flex-col gap-4"
          >
            <input
              type="email"
              placeholder="Email"
              required
              className="bg-black border-1 border-white px-4 py-2 text-center outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-[36px]">
              By submitting your email, you&apos;re giving Eliza permission to
              send you emails.
            </p>
            <button
              type="submit"
              className="bg-white text-black px-4 py-2 rounded-md cursor-pointer"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </ReusableModal>
  );
}

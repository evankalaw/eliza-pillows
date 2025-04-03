"use client";

import { useState } from "react";
import PillowDetailsModal from "./PillowsDetailsModal";
export default function DetailsButton() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <button className="cursor-pointer" onClick={() => setShowModal(true)}>
        Details
      </button>
      <PillowDetailsModal
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}

import { Vote } from "@/app/types/votes";
import GLBViewer from "../Pillows/3d/GLBViewer";
import React from "react";

interface VoteSquareProps {
  vote: Vote;
  onVoteFor: () => void;
  onVoteAgainst: () => void;
  pillowPath: string;
}

// Define initialRotation outside the component for stable reference
const fixedInitialRotation = { x: 1.6, y: 0, z: 0 };

const VoteSquareComponent = (props: VoteSquareProps) => {
  const { vote, onVoteFor, onVoteAgainst, pillowPath } = props;

  return (
    <div className="flex flex-col gap-4 bg-red-500 h-full">
      <h1 className="text-4xl font-bold">Vote {vote.id}</h1>
      <GLBViewer
        modelPath={pillowPath}
        initialRotation={fixedInitialRotation}
        backgroundColor={null}
      />
      <div className="flex flex-row gap-6">
        <button
          className="px-6 py-2 border-white border-1 rounded-md cursor-pointer"
          onClick={onVoteAgainst}
        >
          dump
        </button>
        <button className="px-6 py-2 border-white border-1 rounded-md cursor-pointer">
          buy
        </button>
        <button
          className="px-6 py-2 border-white border-1 rounded-md cursor-pointer"
          onClick={onVoteFor}
        >
          pump
        </button>
      </div>
    </div>
  );
};

// Memoize VoteSquare
const VoteSquare = React.memo(VoteSquareComponent);

export default VoteSquare;

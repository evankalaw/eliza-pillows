import { Vote } from "@/app/types/votes";

interface VoteSquareProps {
  vote: Vote;
  onVoteFor: () => void;
  onVoteAgainst: () => void;
}

export default function VoteSquare(props: VoteSquareProps) {
  const { vote, onVoteFor, onVoteAgainst } = props;

  return (
    <div className="flex flex-col gap-4 bg-red-500 h-full">
      <h1 className="text-4xl font-bold">Vote {vote.id}</h1>
      <div className="flex flex-row gap-6">
        <button
          className="px-6 py-2 border-white border-1 rounded-md cursor-pointer"
          onClick={onVoteAgainst}
        >
          Vote Against
        </button>
        <button className="px-6 py-2 border-white border-1 rounded-md cursor-pointer">
          Other button
        </button>
        <button
          className="px-6 py-2 border-white border-1 rounded-md cursor-pointer"
          onClick={onVoteFor}
        >
          Vote for
        </button>
      </div>
    </div>
  );
}

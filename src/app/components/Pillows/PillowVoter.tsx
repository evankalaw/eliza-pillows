import VotablePillow from "./VotablePillow";

const pillows = [
  {
    id: 1,
    name: "Pillow 1",
  },
  {
    id: 2,
    name: "Pillow 2",
  },
  {
    id: 3,
    name: "Pillow 3",
  },
];

export default function PillowVoter() {
  return (
    <div className="flex flex-col gap-4">
      <div>Pillow Voter</div>
      <div>
        {pillows.map((pillow) => (
          <VotablePillow key={pillow.id} name={pillow.name} />
        ))}
      </div>
    </div>
  );
}

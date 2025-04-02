interface VotablePillowProps {
  name: string;
}

export default function VotablePillow({ name }: VotablePillowProps) {
  return <div>{name}</div>;
}

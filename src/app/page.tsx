import { NotchedBorder } from "./components/NotchedBorder";
import PillowVoter from "./components/Pillows/PillowVoter";
import PillowPageFirst from "./components/Pillows/PillowPageFirst";

export default function Home() {
  return (
    <div className="h-screen w-screen">
      <NotchedBorder className="h-full w-full" size="large">
        <PillowPageFirst />
      </NotchedBorder>
    </div>
  );
}

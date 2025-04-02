import { NotchedBorder } from "./components/NotchedBorder";
import PillowVoter from "./components/Pillows/PillowVoter";

export default function Home() {
  return (
    <div className="h-screen w-screen">
      <NotchedBorder className="h-full w-full" size="large">
        <div className="p-10 h-full flex flex-col items-center justify-center">
          <div className="flex flex-row gap-6">
            <div>nav-1</div>
            <div>nav-2</div>
            <div>nav-3</div>
          </div>
          <PillowVoter />
        </div>
      </NotchedBorder>
    </div>
  );
}

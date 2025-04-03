import Link from "next/link";
import PillowHeader from "./PillowHeader";
import DetailsButton from "./DetailsButton";
import Image from "next/image";
export default function PillowSiteNav() {
  return (
    <div className="flex flex-col items-center w-full justify-between gap-10 mt-10">
      <Image
        src="/VisualSpacer.svg"
        alt="Visual Spacer"
        width={250}
        height={100}
      />
      <nav className="flex flex-row justify-between items-center w-full px-16">
        <Link href="/gallery">Gallery</Link>
        <div className="flex flex-row">
          <PillowHeader />
        </div>
        <DetailsButton />
      </nav>
    </div>
  );
}

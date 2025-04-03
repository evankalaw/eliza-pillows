import Link from "next/link";

export default function PillowHeader() {
  return (
    <div className="flex flex-col gap-2 relative text-center">
      <div className="absolute inset-0 bg-radial from-[#EB7BFF] to-[#808FFFBF] opacity-30 blur-3xl transform scale-70 z-[-1] rounded-[50%]"></div>

      <Link href="/vote">
        <h1 className="uppercase text-[32px] sm:text-[48px] md:text-[64px] lg:text-[80px] xl:text-[92px] leading-tight">
          The Sleeper Agent
        </h1>
      </Link>
      <h3 className="uppercase text-[18px] md:text-[28px]">Collection</h3>
    </div>
  );
}

"use client";

// import Image from "next/image";
import { useState } from "react";
import BodyPillowModal from "./modal/PillowPageModal";

export default function BodyPillow() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="h-full w-full bg-black font-cinzel text-white relative overflow-hidden">
      {/* <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[140%] h-[10vh] bg-[#808FFF80] blur-[150px] rounded-[50%] z-0"></div>
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[100%] h-[5vh] bg-[#EB7BFFBF] blur-[80px] rounded-[50%] z-0"></div> */}

      <div className="flex flex-col justify-between h-full w-full py-20 z-10 relative text-center">
        <div className="flex flex-col gap-2 relative">
          <div className="absolute inset-0 bg-radial from-[#EB7BFF] to-[#808FFFBF] opacity-30 blur-3xl transform scale-70 z-[-1] rounded-[50%]"></div>

          <h2 className="uppercase text-[18px] md:text-[32px]">
            It&apos;s not April Fools!
          </h2>
          {/* <Image
              src="/VisualSpacer.svg"
              alt="Visual Spacer"
              width={150}
              height={100}
              className="mx-auto mt-0 sm:mt-3"
            /> */}
          <h1 className="uppercase text-[32px] sm:text-[48px] md:text-[64px] lg:text-[80px] xl:text-[92px] leading-tight">
            The Sleeper Agent
          </h1>
          <h3 className="uppercase text-[18px] md:text-[28px]">Collection</h3>
        </div>
        <button
          className="hover:bg-white transition-all duration-500 hover:text-black border-1 border-white text-white px-4 py-2 rounded-full w-[200px] mx-auto uppercase text-[20px] cursor-pointer"
          onClick={() => {
            setModalOpen(true);
          }}
        >
          Join Waitlist
        </button>
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-2">
            <div className="uppercase text-[18px] md:text-[28px] tracking-[.2em]">
              Call you in 2 weeks
            </div>
            <div className="uppercase text-[18px] md:text-[28px] tracking-[.2em]">
              ELIZASLEEPSWITHYOU.COM
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {/* <Image
                src="/StudiosPresents.png"
                alt="Studios Presents"
                width={150}
                height={100}
                className="mx-auto"
                quality={100}
                unoptimized={true}
              /> */}
            <div className="uppercase text-[10px] md:text-[18px] tracking-[.2em]">
              PRESENTS
            </div>
          </div>
        </div>
      </div>
      <BodyPillowModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      />
    </div>
  );
}

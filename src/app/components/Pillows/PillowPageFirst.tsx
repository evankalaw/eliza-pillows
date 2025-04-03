"use client";

// import Image from "next/image";
import { useState } from "react";
import JoinWaitlistModal from "./modal/JoinWaitlistModal";

export default function BodyPillow() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="h-full w-full bg-black font-cinzel text-white relative overflow-hidden">
      {/* <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[140%] h-[10vh] bg-[#808FFF80] blur-[150px] rounded-[50%] z-0"></div>
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[100%] h-[5vh] bg-[#EB7BFFBF] blur-[80px] rounded-[50%] z-0"></div> */}

      <div className="flex flex-col justify-between h-full w-full py-20 z-10 relative text-center">
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
      <JoinWaitlistModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      />
    </div>
  );
}

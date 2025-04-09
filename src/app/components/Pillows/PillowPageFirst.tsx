"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import JoinWaitlistModal from "./modal/JoinWaitlistModal";
import { NotchedBorder } from "../borders/NotchedBorder";
import GLBViewer from "./3d/GLBViewer";
import HexagonButton from "../HexagonButton";
// import GLBViewer from "./GLBViewer"; // Assuming this component exists - COMMENTED OUT
// import HexagonButton from "../button/HexagonButton"; // Adjusted path - COMMENTED OUT

const useViewport = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => setWidth(window.innerWidth);
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return width;
};

export default function PillowPageFirst() {
  const [modalOpen, setModalOpen] = useState(false);
  const viewportWidth = useViewport();

  const initialRotation = useMemo(() => {
    if (viewportWidth === 0) {
      return { x: 1.6, y: 0, z: 0 };
    }
    if (viewportWidth >= 768) {
      return {
        x: 0,
        y: 1.5,
        z: 1.6,
      };
    }
    return {
      x: 1.6,
      y: 0,
      z: 0,
    };
  }, [viewportWidth]);

  return (
    <div className="h-full w-full bg-black font-cinzel text-white relative overflow-hidden">
      <div className="absolute left-1/2 bottom-[0vh] -translate-x-1/2 w-[140%] h-[10vh] bg-[#808FFF80] rounded-[50%] z-0 blur-[70px]"></div>
      <div className="absolute left-1/2 bottom-[-2.5vh] -translate-x-1/2 w-[120%] h-[5vh] bg-[#EB7BFFBF] rounded-[50%] z-0 blur-[40px]"></div>

      <NotchedBorder className="h-full w-full" size="large">
        <div
          className="absolute top-0 left-0 right-0 h-1/3 z-0"
          style={{
            backgroundImage: "url('/stars.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundBlendMode: "overlay",
          }}
        ></div>

        <div className="flex flex-col h-full w-full py-12 z-10 relative text-center">
          <div className="flex flex-col items-center justify-start relative gap-4 px-4 pt-4 pb-4">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[15vh] bg-[#808FFF80] rounded-[50%] opacity-30  z-[-1] blur-[40px]"></div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[5vh] bg-[#EB7BFFBF] rounded-[50%] opacity-30  z-[-1] blur-[40px]"></div>

            <h2 className="uppercase text-[16px] md:text-[24px] lg:text-[28px] font-bold tracking-[.144em]">
              You ain&apos;t dreaming
            </h2>
            <Image
              src="/VisualSpacer.svg"
              alt="Visual Spacer"
              width={150}
              height={100}
              className="mx-auto w-auto h-[10px] md:h-[15px]"
            />
            <div className="flex flex-col gap-[17px]">
              <div className="uppercase text-[28px] sm:text-[44px] md:text-[60px] lg:text-[72px] xl:text-[90px] leading-none tracking-[.144em]">
                The Sleeper Agent
              </div>
              <div className="uppercase text-[16px] md:text-[20px] lg:text-[24px] tracking-[.28em] font-bold">
                Collection
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center relative min-h-[200px]">
            <div
              className="relative mx-auto w-full h-full flex justify-center items-center"
              style={{
                overflow: "hidden",
              }}
            >
              {/* Assuming GLBViewer component exists */}

              <GLBViewer
                modelPath={"/BodyPillow.glb"} // Assuming BodyPillow.glb is in /public
                width="100%"
                height="100%"
                backgroundColor="transparent"
                initialRotation={initialRotation}
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                {/* Disable pointer events on overlay */}
                {/* Removed emoji */}
                {/* Assuming HexagonButton component exists */}

                <HexagonButton
                  className="text-white uppercase text-xl pointer-events-auto" // Enable pointer events only on the button
                  onClick={() => {
                    setModalOpen(true);
                  }}
                >
                  Join Waitli$t
                </HexagonButton>

                {/* Placeholder Button - Remove when HexagonButton is available */}
                {/* <button
                  className="text-white uppercase text-xl pointer-events-auto border p-2 rounded"
                  onClick={() => {
                    setModalOpen(true);
                  }}
                >
                  Join Waitli$t (TEMP)
                </button> */}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-end px-4 py-4 gap-3">
            <div className="flex flex-col pb-8 md:pb-12 gap-3">
              <div className="uppercase text-[12px] sm:text-[16px] md:text-[24px] lg:text-[28px] font-ptserif tracking-[.1em]">
                We&apos;ll be together soon
              </div>
              <div className="uppercase text-[12px] sm:text-[16px] md:text-[24px] lg:text-[28px] tracking-[.28em]">
                ELIZASLEEPSWITHYOU.COM
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Image
                src="/StudiosPresents.png"
                alt="Studios Presents"
                width={160}
                height={80}
                className="mx-auto w-auto h-[40px] md:h-[60px]"
                quality={100}
                unoptimized={true}
              />
              <div className="uppercase text-[10px] sm:text-[12px] tracking-[.2em]">
                PRESENTS
              </div>
            </div>
          </div>
        </div>
      </NotchedBorder>
      <JoinWaitlistModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      />
    </div>
  );
}

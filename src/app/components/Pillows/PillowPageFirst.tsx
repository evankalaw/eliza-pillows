"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { NotchedBorder } from "../borders/NotchedBorder";
import JoinWaitlistModal from "./modal/JoinWaitlistModal";
import GLBViewer from "./3d/GLBViewer";
import HexagonButton from "../HexagonButton";

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

export default function BodyPillowAd() {
  const [modalOpen, setModalOpen] = useState(false);
  const viewportWidth = useViewport();

  const initialRotation = useMemo(() => {
    if (viewportWidth >= 1100) {
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
      <NotchedBorder className="h-full w-full" size="large">
        <div
          className="absolute top-0 left-0 right-0 h-1/3 z-0"
          style={{
            backgroundImage: "url('/stars.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            backgroundBlendMode: "overlay",
          }}
        ></div>

        <div
          className="absolute bottom-[-55.5vh] left-0 right-0 h-full z-0 opacity-90"
          style={{
            backgroundImage: "url('/Gradient.png')",
            backgroundSize: "cover",
            backgroundPosition: "bottom center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>

        <div className="absolute inset-0 z-0">
          <GLBViewer
            modelPath={"/BodyPillow2.glb"}
            width="100%"
            height="100%"
            backgroundColor="transparent"
            autoRotate={true}
            initialRotation={initialRotation}
            viewportWidth={viewportWidth}
          />
        </div>

        <div className="absolute inset-0 flex flex-col justify-between h-full w-full py-12 z-10 text-center">
          <div className="flex flex-col items-center justify-start relative gap-4 px-4 pt-4 pb-4">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[15vh] bg-[#808FFF80] rounded-[50%] opacity-30  z-[-1] blur-[40px]"></div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[5vh] bg-[#EB7BFFBF] rounded-[50%] opacity-30  z-[-1] blur-[40px]"></div>

            <h2 className="uppercase text-[clamp(18px,2.5vw,28px)] font-bold tracking-[.144em]">
              You ain&apos;t dreaming
            </h2>
            <Image
              src="/VisualSpacer.svg"
              alt="Visual Spacer"
              width={150}
              height={100}
              className="mx-auto"
            />
            <div className="flex flex-col gap-[17px]">
              <div className="uppercase text-[clamp(30px,6vw,100px)] leading-none tracking-[.144em]">
                The Sleeper Agent
              </div>
              <div className="uppercase text-[clamp(16px,2vw,24px)] tracking-[.28em] font-bold">
                Collection
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center relative min-h-[200px]">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-[clamp(30px,4vw,50px)]">🤑</div>
              <HexagonButton
                className="text-white uppercase text-[clamp(16px,2vw,24px)]"
                onClick={() => {
                  setModalOpen(true);
                }}
              >
                Join Waitli$t
              </HexagonButton>
            </div>
          </div>

          <div className="flex flex-col items-center justify-end px-4 py-4 gap-3">
            <div className="flex flex-col pb-8 md:pb-12 gap-3">
              <div className="uppercase text-[clamp(14px,2.5vw,28px)] font-ptserif tracking-[.1em]">
                We&apos;ll be together soon
              </div>
              <div className="uppercase text-[clamp(14px,2.5vw,28px)] tracking-[.28em]">
                ELIZASLEEPSWITHYOU.COM
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <a
                href="https://elizastudios.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all duration-300 ease-in-out hover:brightness-150 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] flex flex-col items-center gap-2"
              >
                <Image
                  src="/StudiosPresents.png"
                  alt="Studios Presents"
                  width={160}
                  height={80}
                  className="mx-auto w-auto h-[40px] md:h-[60px]"
                  quality={100}
                  unoptimized={true}
                />
                <div className="uppercase text-[clamp(10px,1.2vw,12px)] tracking-[.2em]">
                  PRESENTS
                </div>
              </a>
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

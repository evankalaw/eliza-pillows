"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";
import { Navigation, Pagination, EffectCreative } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRef, useState } from "react";
import { VoteState } from "../types/votes";
import VoteSquare from "../components/voting/VoteSquare";

const voteOptions = [
  {
    id: 1,
    name: "Pillow 1",
    pillowPath: "/BodyPillow.glb",
  },
  {
    id: 2,
    name: "Pillow 2",
    pillowPath: "/BodyPillow.glb",
  },
  {
    id: 3,
    name: "Pillow 3",
    pillowPath: "/BodyPillow.glb",
  },
  {
    id: 4,
    name: "Pillow 4",
    pillowPath: "/BodyPillow.glb",
  },
  {
    id: 5,
    name: "Pillow 5",
    pillowPath: "/BodyPillow.glb",
  },
];

export default function Vote() {
  const [voteState, setVoteState] = useState<VoteState>({
    votes: voteOptions.map((option) => ({
      id: option.id,
      selected: false,
      userVoted: false,
      pillowPath: option.pillowPath,
    })),
  });

  const swiperRef = useRef<SwiperType>(null);

  const handleVoteFor = (id: number) => {
    setVoteState((prevState) => ({
      ...prevState,
      votes: prevState.votes.map((v) =>
        v.id === id ? { ...v, selected: true, userVoted: true } : v
      ),
    }));
  };

  const handleVoteAgainst = (id: number) => {
    setVoteState((prevState) => ({
      ...prevState,
      votes: prevState.votes.map((v) =>
        v.id === id ? { ...v, selected: false, userVoted: true } : v
      ),
    }));
  };

  const voteCount = voteState.votes.filter((vote) => vote.userVoted).length;

  const votesCompleted = voteState.votes.every((vote) => vote.userVoted);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center py-10 gap-6">
      <div>Vote count {voteCount}</div>
      <div className="w-full h-full">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Navigation, Pagination, EffectCreative]}
          navigation
          pagination={{ clickable: true }}
          className="w-full h-full"
          slidesPerView={1.5}
          spaceBetween={10}
          centeredSlides={true}
          loop={true}
          speed={1500}
          effect="creative"
          creativeEffect={{
            prev: {
              translate: ["-100%", 0, 0],
              scale: 0.9,
              shadow: true,
              opacity: 0.8,
            },
            next: {
              translate: ["100%", 0, 0],
              scale: 0.9,
              shadow: true,
              opacity: 0.8,
            },
          }}
        >
          {voteState.votes.map((vote) => (
            <SwiperSlide key={vote.id} className="w-full h-full">
              <VoteSquare
                vote={vote}
                onVoteFor={() => {
                  handleVoteFor(vote.id);
                  swiperRef.current?.slideNext();
                }}
                onVoteAgainst={() => {
                  handleVoteAgainst(vote.id);
                  swiperRef.current?.slideNext();
                }}
                pillowPath={vote.pillowPath}
              />
            </SwiperSlide>
          ))}
          <SwiperSlide className="w-full h-full">
            {votesCompleted ? (
              <div>you completed the votes</div>
            ) : (
              <div>not done</div>
            )}
            {JSON.stringify(voteState)}
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}

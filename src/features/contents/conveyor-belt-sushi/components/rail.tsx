"use client";

import Image from "next/image";
import React from "react";
import Marquee from "react-fast-marquee";

export const Rail = () => {
  return (
    <div className="relative mt-auto h-96 overflow-hidden">
      <div className="absolute top-40 w-screen">
        <Image
          alt="回転寿司のレール"
          className="size-full object-cover"
          height={1080}
          src="/rail-bg.jpg"
          width={1920}
        />
      </div>

      <Marquee direction="right" speed={100}>
        <div className="relative z-20 h-40 w-screen">
          <Image
            alt="回転寿司のレール"
            className="size-full"
            fill
            src="/rail.jpg"
          />
        </div>
      </Marquee>
    </div>
  );
};

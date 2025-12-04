import React, { useState } from "react";
import { Trophy, Calendar, Users, BarChart3 } from "lucide-react";

const highlights = [
  {
    icon: Users,
    title: "Team & Player Management",
    description:
      "Manage rosters, track player profiles, and organize teams across multiple sports programs.",
  },
  {
    icon: Calendar,
    title: "Scheduling & Events",
    description:
      "Schedule games, training sessions, and reserve facilities with an integrated calendar system.",
  },
  {
    icon: Trophy,
    title: "Tournaments & Leagues",
    description:
      "Create brackets, manage competitions, and track standings for all athletic events.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description:
      "Monitor athlete statistics and analyze team performance over time.",
  },
];

const images = [
  {
    src: "https://res.cloudinary.com/dzebi1atl/image/upload/v1764843027/assets/594324622_2099414874132514_2581763891711770559_n_jwpquj.jpg",
  },
  {
    src: "https://res.cloudinary.com/dzebi1atl/image/upload/v1764843028/assets/591270438_4333363946983482_1095040117327751911_n_kvpn64.jpg",
  },
  {
    src: "https://res.cloudinary.com/dzebi1atl/image/upload/v1764843029/assets/591619325_811138368579109_556836416777384057_n_t4aat2.jpg",
  },
  {
    src: "https://res.cloudinary.com/dzebi1atl/image/upload/v1764843027/assets/589606468_2631821477204070_4485445309845908090_n_bxauas.jpg",
  },
];

// Stack positions - each position has offset and rotation
const stackPositions = [
  { x: 0, y: 0, rotate: 0 }, // Front (top of stack)
  { x: 8, y: -8, rotate: 3 }, // Second
  { x: 16, y: -16, rotate: -2 }, // Third
  { x: 24, y: -24, rotate: 4 }, // Back (bottom of stack)
];

const AboutSection = () => {
  const [imageOrder, setImageOrder] = useState([0, 1, 2, 3]);

  const handleClick = () => {
    // Move front image to back, shift others forward
    setImageOrder((prev) => {
      const newOrder = [...prev];
      const first = newOrder.shift();
      newOrder.push(first);
      return newOrder;
    });
  };

  return (
    <section id="about" className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-5 lg:gap-12 items-center">
          {/* Stacked Images - Click to cycle */}
          <div className="relative order-1 lg:order-none h-[350px] lg:h-[400px] flex items-center justify-center">
            <div
              className="relative w-[280px] h-[280px] md:w-[70%] md:h-[320px] lg:w-[80%] lg:h-[400px] cursor-pointer"
              onClick={handleClick}
            >
              {imageOrder.map((imageIndex, stackIndex) => {
                const pos = stackPositions[stackIndex];
                const zIndex = images.length - stackIndex;

                return (
                  <div
                    key={imageIndex}
                    className="absolute inset-0 transition-all duration-500 ease-out"
                    style={{
                      transform: `translateX(${pos.x}px) translateY(${pos.y}px) rotate(${pos.rotate}deg)`,
                      zIndex: zIndex,
                    }}
                  >
                    <div className="bg-muted dark:bg-white dark:brightness-75 p-2 pb-4 rounded-lg shadow-xl h-full">
                      <img
                        src={images[imageIndex].src}
                        alt={`Sports ${imageIndex + 1}`}
                        className="w-full h-full object-cover rounded"
                        draggable={false}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content Side */}
          <div>
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              About The System
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-6">
              What is the{" "}
              <span className="text-primary">Sports Management</span> System?
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              A centralized platform built for{" "}
              <span className="text-primary font-medium">
                UPHSD Molino Campus
              </span>{" "}
              to digitize and streamline all athletic operations. Coaches can
              manage their teams, schedule training sessions, and track player
              performance. Athletes can view their schedules, access team
              documents, and monitor their progress.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Administrators have full control over sports programs, player
              registrations, facility reservations, and tournament organization
              — all in one integrated system.
            </p>

            {/* System Features */}
            <div className="grid sm:grid-cols-2 gap-4">
              {highlights.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

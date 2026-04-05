import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ShieldCheck, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const cards = [
  {
    title: "Leagues",
    description:
      "Browse league, teams, and season standings as a guest viewer.",
    icon: ShieldCheck,
    href: "/leagues",
    src: "https://res.cloudinary.com/dzebi1atl/image/upload/v1764843028/assets/591239270_810954241933371_571631130098765216_n_nsl1xh.jpg",
  },
  {
    title: "Tournaments",
    description:
      "Explore tournament brackets and game results as a guest viewer.",
    icon: Trophy,
    href: "/tournaments",
    src: "https://res.cloudinary.com/dzebi1atl/image/upload/v1764843028/assets/591270438_4333363946983482_1095040117327751911_n_kvpn64.jpg",
  },
];

const ScoreboardSection = () => {
  return (
    <section
      id="scoreboard"
      className= "py-16 lg:py-24 bg-muted/30 relative overflow-hidden"
    >
      <div className= "px-4">
        <div className= "text-center mb-12 relative z-10">
          <span className= "text-secondary font-semibold text-sm uppercase tracking-wider">
            Scoreboard
          </span>
          <h2 className= "text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-3">
            Explore as a <span className= "text-primary">Guest</span>
          </h2>
          <p className= "text-muted-foreground max-w-2xl">
            View real-time scores, league standings, and tournament brackets as
            a guest user. Experience the excitement of the game without needing
            an account.
          </p>
        </div>

        <div className= "grid md:grid-cols-2 gap-6 relative z-10">
          {cards.map((card) => (
            <Card
              key={card.title}
              className= "group border-primary/30 backdrop-blur-sm"
            >
              <CardHeader>
                <div className= "grid grid-cols-[auto_1fr] items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm`}
                  >
                    <card.icon className= "w-6 h-6" />
                  </div>
                  <div>
                    <h3 className= "text-xl font-bold text-foreground">
                      {card.title}
                    </h3>
                    <p className= "text-sm text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className= "flex flex-col h-full">
                <img
                  src={card.src}
                  alt={card.title}
                  className= "w-full md:h-[350px] object-cover rounded-lg mb-4"
                />

                <Button asChild size="lg" className= "mt-auto w-full">
                  <Link to={card.href}>
                    View {card.title} <ChevronRight />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScoreboardSection;

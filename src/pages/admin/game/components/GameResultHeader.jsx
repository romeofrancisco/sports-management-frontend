import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getContrastingTextStyle } from "@/utils/colorContrast";

const GameBoxScoreHeader = ({ game }) => {
  const { home_team, away_team, score_summary } = game;
  const { total, periods } = score_summary;

  const isHomeWinner = total?.home > total?.away;
  const isAwayWinner = total?.away > total?.home;

  return game.sport_requires_stats ? (
    <RequireStats
      home_team={home_team}
      away_team={away_team}
      total={total}
      periods={periods}
      isHomeWinner={isHomeWinner}
      isAwayWinner={isAwayWinner}
    />
  ) : (
    <NotRequireStats
      home_team={home_team}
      away_team={away_team}
      total={total}
      periods={periods}
      isHomeWinner={isHomeWinner}
      isAwayWinner={isAwayWinner}
    />
  );
};

export default GameBoxScoreHeader;

const NotRequireStats = ({
  total,
  home_team,
  away_team,
  periods,
  isHomeWinner,
  isAwayWinner,
}) => {
  return (
    <div className="w-full border-y shadow-lg">
      {/* Main header section */}
      <header className="flex h-20 lg:h-[400px] w-full">
        {/* Left panel */}
        <div className="hidden lg:block relative w-[288px] overflow-clip">
        {/* Slash stripes */}
        <div
          className="absolute right-15 -top-2 w-3 h-[420px] rotate-[10deg] opacity-80"
          style={{ backgroundColor: home_team?.color }}
        />
        <div
          className="absolute right-9 -top-2 w-3 h-[420px] rotate-[10deg] opacity-50"
          style={{ backgroundColor: home_team?.color }}
        />

        {/* Clipped background */}
        <div
          className="h-full flex flex-col items-center justify-center gap-5 pe-20"
          style={{
            backgroundColor: home_team?.color,
            clipPath: "polygon(0 100%, 0 0, 240px 0, 170px 100%)",
          }}
        >
          <Avatar className="size-28 border-2 border-primary/20">
            <AvatarImage src={home_team?.logo} alt={home_team?.name} />
            <AvatarFallback className="bg-muted/50 text-4xl text-muted-foreground ">
              {home_team?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h1 
            className="text-xl font-bold px-3 py-1 rounded-lg bg-black/30 backdrop-blur-sm border border-white/20" 
            style={getContrastingTextStyle(home_team?.color)}
          >
            {home_team?.name}
          </h1>
        </div>
      </div>

      {/* Center score section */}
      <div className="flex-1 grid grid-cols-[1fr_auto_1fr] gap-6 xl:gap-14 items-center px-4">
        {/* Home team info */}
        <div
          className={`flex items-center justify-end gap-3 relative ${
            !isHomeWinner ? "text-muted-foreground" : ""
          }`}
        >
          {isHomeWinner && (
            <svg
              className="w-3 h-3 fill-current absolute -right-5"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon points="15,0 5,10 15,20" />
            </svg>
          )}
          <div className="flex items-center gap-2">
            <span className="hidden md:block lg:hidden xl:block text-xl font-medium">
              {home_team?.name}
            </span>
            <Avatar className="lg:hidden w-12 h-12 border-2 border-primary/20 bg-muted/50">
              <AvatarImage src={home_team?.logo} alt={home_team?.name} />
              <AvatarFallback className="text-xl text-muted-foreground ">
                {home_team?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center">
            <span className="text-3xl xl:text-5xl font-black">{total?.home}</span>
            <span className="block md:hidden text-xs">
              {home_team?.abbreviation}
            </span>
          </div>
        </div>

        {/* Game info */}
        <div className="text-center font-medium md:text-xl xl:text-2xl mx-5">
          <h3>Final</h3>
          <table className="hidden lg:block text-[0.65rem] lg:text-sm mt-3">
            <thead className="border-b">
              <tr>
                <th className="px-5 lg:px-6 xl:px-7"></th>
                {periods.map((p, index) => (
                  <th key={index} className="text-muted-foreground px-3 xl:px-4">
                    {p.label}
                  </th>
                ))}
                <th className="px-3">T</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-start py-1">{home_team?.abbreviation}</td>
                {periods.map((p, index) => (
                  <td key={index} className="text-muted-foreground">
                    {p.home}
                  </td>
                ))}
                <td className="font-bold">{total?.home}</td>
              </tr>
              <tr>
                <td className="text-start">{away_team?.abbreviation}</td>
                {periods.map((p, index) => (
                  <td key={index} className="text-muted-foreground">
                    {p.away}
                  </td>
                ))}
                <td className="font-bold">{total?.away}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Away team info */}
        <div
          className={`flex items-center justify-start gap-3 relative ${
            !isAwayWinner ? "text-muted-foreground" : ""
          }`}
        >
          {isAwayWinner && (
            <svg
              className="w-3 h-3 fill-current absolute -left-5"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon points="5,0 15,10 5,20" />
            </svg>
          )}
          <div className="text-center">
            <span className="text-3xl lg:text-5xl font-black">{total?.away}</span>
            <span className="block md:hidden text-xs">
              {away_team?.abbreviation}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="lg:hidden w-12 h-12 border-2 border-primary/20 bg-muted/50">
              <AvatarImage src={away_team?.logo} alt={away_team?.name} />
              <AvatarFallback className="text-xl text-muted-foreground ">
                {away_team?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {/* <img src={away_team?.logo} alt={away_team?.name} className="w-12" /> */}
            <span className="hidden lg:hidden md:block xl:block text-xl font-medium">
              {away_team?.name}
            </span>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="hidden lg:block relative w-[288px] overflow-clip">
        {/* Slash stripes on the left now */}
        <div
          className="absolute right-54 -top-2 w-3 h-[420px] rotate-[-10deg] opacity-80"
          style={{ backgroundColor: away_team?.color }}
        />
        <div
          className="absolute right-60 -top-2 w-3 h-[420px] rotate-[-10deg] opacity-50"
          style={{ backgroundColor: away_team?.color }}
        />

        {/* Clipped background with reversed polygon */}
        <div
          className="h-full flex flex-col items-center justify-center gap-5 ps-20"
          style={{
            backgroundColor: away_team?.color,
            clipPath:
              "polygon(100% 0, 100% 100%, calc(100% - 170px) 100%, calc(100% - 240px) 0)",
          }}
        >
          <Avatar className="size-28 border-2 border-primary/20 bg-muted/50">
            <AvatarImage src={away_team?.logo} alt={away_team?.name} />
            <AvatarFallback className="bg-muted/50 border-2 border-primary/20 text-2xl text-muted-foreground ">
              {away_team?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h1 
            className="text-xl font-bold px-3 py-1 rounded-lg bg-black/30 backdrop-blur-sm border border-white/20" 
            style={getContrastingTextStyle(away_team?.color)}
          >
            {away_team?.name}
          </h1>
        </div>
      </div>
      </header>

      {/* Score table section */}
      <div className="w-full lg:hidden border-t">
        <div className="flex justify-center py-4">
          <table className="text-sm lg:text-base">
            <thead className="border-b">
              <tr>
                <th className="px-6 py-2 text-left"></th>
                {periods.map((p, index) => (
                  <th key={index} className="text-muted-foreground px-4 py-2">
                    {p.label}
                  </th>
                ))}
                <th className="px-4 py-2">T</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-left py-2 px-6 font-medium">{home_team?.abbreviation}</td>
                {periods.map((p, index) => (
                  <td key={index} className="text-muted-foreground text-center px-4 py-2">
                    {p.home}
                  </td>
                ))}
                <td className="font-bold text-center px-4 py-2">{total?.home}</td>
              </tr>
              <tr>
                <td className="text-left py-2 px-6 font-medium">{away_team?.abbreviation}</td>
                {periods.map((p, index) => (
                  <td key={index} className="text-muted-foreground text-center px-4 py-2">
                    {p.away}
                  </td>
                ))}
                <td className="font-bold text-center px-4 py-2">{total?.away}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const RequireStats = ({
  total,
  home_team,
  away_team,
  periods,
  isHomeWinner,
  isAwayWinner,
}) => {
  return (

      <header className="flex h-[7rem] md:h-[8rem] w-full">
      {/* Left panel */}
      <div className="hidden lg:block relative w-[10rem] overflow-clip">
        {/* Slash stripes */}
        <div
          className="absolute right-10 -top-5 w-2 h-[10rem] rotate-24 opacity-80"
          style={{ backgroundColor: home_team?.color }}
        />
        <div
          className="absolute right-7 w-2 -top-5 h-[10rem] rotate-24 opacity-50"
          style={{ backgroundColor: home_team?.color }}
        />

        {/* Clipped background */}
        <div
          className="h-full flex items-center ps-4"
          style={{
            backgroundColor: home_team?.color,
            clipPath: "polygon(0 100%, 0 0, 135px 0, 79px 100%)",
          }}
        >
          <Avatar className="w-18 h-18 border-2 border-primary/20">
            <AvatarImage src={home_team?.logo} alt={home_team?.name} />
            <AvatarFallback className="bg-muted/50 text-2xl text-muted-foreground ">
              {home_team?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {/* <img src={home_team?.logo} className="w-18" alt={home_team?.name} /> */}
        </div>
      </div>

      {/* Center score section */}
      <div className="flex-1 grid grid-cols-[1fr_auto_1fr] gap-5 items-center px-4">
        {/* Home team info */}
        <div
          className={`flex items-center justify-end gap-3 relative ${
            !isHomeWinner ? "text-muted-foreground" : ""
          }`}
        >
          {isHomeWinner && (
            <svg
              className="w-3 h-3 fill-current absolute -right-5"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon points="15,0 5,10 15,20" />
            </svg>
          )}
          <div className="flex items-center gap-2">
            <span className="hidden md:block text-xl font-medium">
              {home_team?.name}
            </span>
            <Avatar className="w-12 h-12 border-2 border-primary/20 bg-muted/50">
              <AvatarImage src={home_team?.logo} alt={home_team?.name} />
              <AvatarFallback className="text-xl text-muted-foreground ">
                {home_team?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center">
            <span className="text-3xl font-black">{total?.home}</span>
            <span className="block md:hidden text-xs">
              {home_team?.abbreviation}
            </span>
          </div>
        </div>

        {/* Game info */}
        <div className="text-center font-medium mx-5">
          <div>Final</div>
          <table className="hidden md:block text-[0.65rem] mt-3">
            <thead className="border-b">
              <tr>
                <th className="px-5"></th>
                {periods.map((p, index) => (
                  <th key={index} className="text-muted-foreground px-3">
                    {p.label}
                  </th>
                ))}
                <th className="px-3">T</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-start py-1">{home_team?.abbreviation}</td>
                {periods.map((p, index) => (
                  <td key={index} className="text-muted-foreground">
                    {p.home}
                  </td>
                ))}
                <td className="font-bold">{total?.home}</td>
              </tr>
              <tr>
                <td className="text-start">{away_team?.abbreviation}</td>
                {periods.map((p, index) => (
                  <td key={index} className="text-muted-foreground">
                    {p.away}
                  </td>
                ))}
                <td className="font-bold">{total?.away}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Away team info */}
        <div
          className={`flex items-center justify-start gap-3 relative ${
            !isAwayWinner ? "text-muted-foreground" : ""
          }`}
        >
          {isAwayWinner && (
            <svg
              className="w-3 h-3 fill-current absolute -left-5"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon points="5,0 15,10 5,20" />
            </svg>
          )}
          <div className="text-center">
            <span className="text-3xl font-black">{total?.away}</span>
            <span className="block md:hidden text-xs">
              {away_team?.abbreviation}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="w-12 h-12 border-2 border-primary/20 bg-muted/50">
              <AvatarImage src={away_team?.logo} alt={away_team?.name} />
              <AvatarFallback className="text-xl text-muted-foreground ">
                {away_team?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {/* <img src={away_team?.logo} alt={away_team?.name} className="w-12" /> */}
            <span className="hidden md:block text-xl font-medium">
              {away_team?.name}
            </span>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="hidden lg:block relative w-[10rem] overflow-clip">
        {/* Slash stripes on the left now */}
        <div
          className="absolute left-10 -top-5 w-2 h-[10rem] -rotate-24 opacity-80"
          style={{ backgroundColor: away_team?.color }}
        />
        <div
          className="absolute left-7 -top-5 w-2 h-[10rem] -rotate-24 opacity-50"
          style={{ backgroundColor: away_team?.color }}
        />

        {/* Clipped background with reversed polygon */}
        <div
          className="h-full flex items-center justify-end pe-4"
          style={{
            backgroundColor: away_team?.color,
            clipPath:
              "polygon(100% 100%, 100% 0, calc(100% - 135px) 0, calc(100% - 79px) 100%)",
          }}
        >
          <Avatar className="w-18 h-18 border-2 border-primary/20 bg-muted/50">
            <AvatarImage src={away_team?.logo} alt={away_team?.name} />
            <AvatarFallback className="bg-muted/50 border-2 border-primary/20 text-2xl text-muted-foreground ">
              {away_team?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {/* <img src={away_team?.logo} className="w-18" alt={away_team?.name} /> */}
        </div>
      </div>
    </header>
  );
};

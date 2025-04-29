import React from "react";

const GameBoxScoreHeader = ({ game }) => {
  const { home_team, away_team, score_summary } = game;
  const { total, periods } = score_summary;

  const isHomeWinner = total.home > total.away;
  const isAwayWinner = total.away > total.home;

  return (
    <header className="flex h-[7rem] md:h-[8rem] w-full border-y shadow-lg">
      {/* Left panel */}
      <div className="hidden lg:block relative w-[10rem] overflow-clip">
        {/* Slash stripes */}
        <div
          className="absolute right-10 -top-5 w-2 h-[10rem] rotate-24 opacity-80"
          style={{ backgroundColor: home_team.color }}
        />
        <div
          className="absolute right-7 w-2 -top-5 h-[10rem] rotate-24 opacity-50"
          style={{ backgroundColor: home_team.color }}
        />

        {/* Clipped background */}
        <div
          className="h-full flex items-center ps-4"
          style={{
            backgroundColor: home_team.color,
            clipPath: "polygon(0 100%, 0 0, 135px 0, 79px 100%)",
          }}
        >
          <img src={home_team.logo} className="w-18" alt={home_team.name} />
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
              {home_team.name}
            </span>
            <img src={home_team.logo} alt={home_team.name} className="w-12" />
          </div>
          <div className="text-center">
            <span className="text-3xl font-black">{total.home}</span>
            <span className="block md:hidden text-xs">
              {home_team.abbreviation}
            </span>
          </div>
        </div>

        {/* Game info */}
        <div className="text-center font-medium mx-5">
          <div>Final</div>
          <table className="hidden md:block text-[0.65rem] mt-5">
            <thead className="border-b">
              <tr>
                <th className="px-5"></th>
                {periods.map((p) => (
                  <th className="text-muted-foreground px-3">{p.label}</th>
                ))}
                <th className="px-3">T</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-start py-1">{home_team.abbreviation}</td>
                {periods.map((p) => (
                  <td className="text-muted-foreground">{p.home}</td>
                ))}
                <td className="font-bold">{total.home}</td>
              </tr>
              <tr>
                <td className="text-start">{away_team.abbreviation}</td>
                {periods.map((p) => (
                  <td className="text-muted-foreground">{p.away}</td>
                ))}
                <td className="font-bold">{total.away}</td>
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
            <span className="text-3xl font-black">{total.away}</span>
            <span className="block md:hidden text-xs">
              {away_team.abbreviation}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <img src={away_team.logo} alt={away_team.name} className="w-12" />
            <span className="hidden md:block text-xl font-medium">
              {away_team.name}
            </span>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="hidden lg:block relative w-[10rem] overflow-clip">
        {/* Slash stripes on the left now */}
        <div
          className="absolute left-10 -top-5 w-2 h-[10rem] -rotate-24 opacity-80"
          style={{ backgroundColor: away_team.color }}
        />
        <div
          className="absolute left-7 -top-5 w-2 h-[10rem] -rotate-24 opacity-50"
          style={{ backgroundColor: away_team.color }}
        />

        {/* Clipped background with reversed polygon */}
        <div
          className="h-full flex items-center justify-end pe-4"
          style={{
            backgroundColor: away_team.color,
            clipPath: "polygon(100% 100%, 100% 0, calc(100% - 135px) 0, calc(100% - 79px) 100%)"

          }}
        >
          <img src={away_team.logo} className="w-18" alt={away_team.name} />
        </div>
      </div>
    </header>
  );
};

export default GameBoxScoreHeader;

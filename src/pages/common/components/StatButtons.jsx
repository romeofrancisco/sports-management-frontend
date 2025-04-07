import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebouncedCallback } from "use-debounce";
import { useCreatePlayerStat } from "@/hooks/usePlayerStats";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { MultiBackend } from "react-dnd-multi-backend";
import DragLayer from "./DragLayer";
import DraggableButton from "./DraggableButton";
import GridCells from "./GridCells";
import { incrementHomeScore } from "@/store/slices/gameSlice";
import { incrementAwayScore } from "@/store/slices/gameSlice";
import { TEAM_SIDES } from "@/constants/game";

// Mobile detection
const isMobile = () => {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

const mobile = isMobile();

// Backend configuration based on device
const backendConfig = mobile
  ? {
      backends: [
        {
          id: "touch",
          backend: TouchBackend,
          options: { enableMouseEvents: true, delayTouchStart: 150 },
        },
      ],
    }
  : {
      backends: [
        {
          id: "html5",
          backend: HTML5Backend,
        },
      ],
    };

const StatButtons = ({ statTypes }) => {
  const { playerId, gameId, period, team } = useSelector(
    (state) => state.playerStat
  );
  const { mutate: createPlayerStat, isPending: isCreatingStat } = useCreatePlayerStat();
  const dispatch = useDispatch();

  const debouncedStat = useDebouncedCallback(
    (stat) => createPlayerStat(stat),
    300,
    { leading: true, trailing: false }
  );

  const handleStatRecord = (statId, point_value) => {
    if (point_value > 0) {
      if (team === TEAM_SIDES.HOME_TEAM) {
        console.log(point_value)
        dispatch(incrementHomeScore(point_value));
      }

      if (team === TEAM_SIDES.AWAY_TEAM) {
        dispatch(incrementAwayScore(point_value));
      }
    }

    debouncedStat({
      player: playerId,
      game: gameId,
      period: period,
      stat_type: statId,
    });
  };

  const [buttons, setButtons] = useState([]);
  const columns = 4;
  const rows = 4;

  useEffect(() => {
    if (statTypes) {
      setButtons(
        statTypes.map((btn, index) => ({
          ...btn,
          position: {
            x: index % columns,
            y: Math.floor(index / columns),
          },
        }))
      );
    }
  }, [statTypes, columns]);

  const moveButton = (id, newPosition) => {
    setButtons((prevButtons) =>
      prevButtons.map((btn) => {
        if (btn.id === id) return { ...btn, position: newPosition };
        if (
          btn.position.x === newPosition.x &&
          btn.position.y === newPosition.y
        )
          return {
            ...btn,
            position: prevButtons.find((b) => b.id === id).position,
          };
        return btn;
      })
    );
  };

  const renderGrid = () => {
    const gridCells = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const buttonInCell = buttons.find(
          (btn) => btn.position.x === x && btn.position.y === y
        );
        gridCells.push(
          <GridCells key={`${x}-${y}`} x={x} y={y} moveButton={moveButton}>
            {buttonInCell && (
              <DraggableButton
                button={buttonInCell}
                position={buttonInCell.position}
                onRecord={handleStatRecord}
                isCreatingStat={isCreatingStat}
              />
            )}
          </GridCells>
        );
      }
    }
    return gridCells;
  };

  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
  
    setVH();
    window.addEventListener('resize', setVH);
    return () => window.removeEventListener('resize', setVH);
  }, []);

  return (
    <DndProvider backend={MultiBackend} options={backendConfig}>
      <div className="flex justify-center">
        <div
          className={`grid grid-cols-4 grid-rows-4 gap-2 max-h-[35rem] bg-background rounded-lg`}
          style={{ height: `calc(var(--vh, 1vh) * ${mobile ? 75 : 80})` }}
        >
          {renderGrid()}
        </div>
        {mobile && <DragLayer />}
      </div>
    </DndProvider>
  );
};

export default StatButtons;

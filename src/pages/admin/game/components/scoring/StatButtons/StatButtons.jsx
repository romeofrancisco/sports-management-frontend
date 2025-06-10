import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRecordStat, useRecordStatFast } from "@/hooks/useStats";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { MultiBackend } from "react-dnd-multi-backend";
import DragLayer from "./DragLayer";
import DraggableButton from "./DraggableButton";
import GridCells from "./GridCells";
import { reset } from "@/store/slices/playerStatSlice";
import { useDispatch } from "react-redux";

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
  const { playerId, team } = useSelector((state) => state.playerStat);
  const { game_id, current_period } = useSelector((state) => state.game);
  
  // Use fast recording for better performance
  const { mutate: recordStatFast, isPending: isCreatingStatFast } =
    useRecordStatFast(game_id);
  
  // // Keep the regular recording as fallback
  // const { mutate: recordStat, isPending: isCreatingStat } =
  //   useRecordStat(game_id);
    
  const dispatch = useDispatch();

  const handleStatRecord = (statId, point_value) => {
    // Use fast recording by default for better performance
    recordStatFast({
      player: playerId,
      game: game_id,
      period: current_period,
      stat_type: statId,
      point_value,
      team,
    });
    dispatch(reset());
  };

  const [buttons, setButtons] = useState([]);
  const columns = 4;
  const minimumRows = 4;
  const rows = Math.max(minimumRows, Math.ceil((statTypes?.length || 0) / columns));

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
    // Prevent moving beyond the calculated rows
    if (newPosition.y >= rows) return;
    
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
            {buttonInCell && (              <DraggableButton
                button={buttonInCell}
                position={buttonInCell.position}
                onRecord={handleStatRecord}
                isCreatingStat={isCreatingStatFast}
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
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("resize", setVH);
    return () => window.removeEventListener("resize", setVH);
  }, []);

  return (
    <DndProvider backend={MultiBackend} options={backendConfig}>
      <div className="flex justify-center">
        <div
          className="grid grid-cols-4 gap-2 bg-background rounded-lg"
          style={{
            height: `calc(var(--vh, 1vh) * ${mobile ? 75 : 80})`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          }}
        >
          {renderGrid()}
        </div>
        {mobile && <DragLayer />}
      </div>
    </DndProvider>
  );
};

export default StatButtons;

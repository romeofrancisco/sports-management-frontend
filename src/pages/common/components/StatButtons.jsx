import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { MultiBackend } from "react-dnd-multi-backend";
import Loading from "@/components/common/Loading";
import DragLayer from "./DragLayer";
import DraggableButton from "./DraggableButton";
import GridCells from "./GridCells";

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
  const [buttons, setButtons] = useState([]);
  const columns = 4
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
              />
            )}
          </GridCells>
        );
      }
    }
    return gridCells;
  };

  return (
    <DndProvider backend={MultiBackend} options={backendConfig}>
      <div className="flex justify-center">
        <div
          className={`grid ${
            mobile ? "grid-cols-4" : "grid-cols-4"
          } grid-rows-4 gap-2 md:h-[80vh] max-h-[50rem] bg-gray-100 rounded-lg p-2`}
        >
          {renderGrid()}
        </div>
        {mobile && <DragLayer />}
      </div>
    </DndProvider>
  );
};

export default StatButtons;

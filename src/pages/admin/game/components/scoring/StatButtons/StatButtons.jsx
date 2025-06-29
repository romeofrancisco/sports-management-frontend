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

// Mobile detection (treat iPad Pro landscape as mobile for grid)
const isMobile = () => {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  const isMobileUA =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isSmallScreen = window.innerWidth <= 1366; // iPad Pro landscape or smaller
  return isMobileUA || isSmallScreen;
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

const StatButtons = ({
  statTypes,
  gameId,
  sportSlug,
  isLayoutMode = false,
  onLayoutSave,
}) => {
  const { playerId, team } = useSelector((state) => state.playerStat);
  const { game_id, current_period } = useSelector((state) => state.game);

  // Use fast recording for better performance
  const { mutate: recordStatFast, isPending: isCreatingStatFast } =
    useRecordStatFast(game_id);

  // // Keep the regular recording as fallback
  // const { mutate: recordStat, isPending: isCreatingStat } =
  //   useRecordStat(game_id);

  const dispatch = useDispatch();

  // localStorage key for button positions (sport-specific)
  // This allows each sport to have its own button layout
  const storageKey = `statButtons_${sportSlug || "default"}_positions`;

  // Utility functions for localStorage
  const saveButtonPositions = (positions) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(positions));
    } catch (error) {
      console.warn("Failed to save button positions to localStorage:", error);
    }
  };

  const loadButtonPositions = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.warn("Failed to load button positions from localStorage:", error);
      return null;
    }
  };

  const resetButtonPositions = () => {
    try {
      localStorage.removeItem(storageKey);
      // Reset buttons to default positions
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
    } catch (error) {
      console.warn("Failed to reset button positions:", error);
    }
  };

  const handleStatRecord = (statId, point_value) => {
    // Prevent stat recording in layout mode
    if (isLayoutMode) return;

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

  const handleLayoutSave = () => {
    if (onLayoutSave) {
      onLayoutSave();
    }
  };

  const [buttons, setButtons] = useState([]);
  const columns = 4; // Adjust columns based on device type
  const minimumRows = 4;
  const rows = Math.max(
    minimumRows,
    Math.ceil((statTypes?.length || 0) / columns)
  );

  useEffect(() => {
    if (statTypes) {
      const savedPositions = loadButtonPositions();

      setButtons(
        statTypes.map((btn, index) => {
          // Check if there's a saved position for this button
          const savedPosition = savedPositions && savedPositions[btn.id];

          return {
            ...btn,
            position: savedPosition || {
              x: index % columns,
              y: Math.floor(index / columns),
            },
          };
        })
      );
    }
  }, [statTypes, columns, storageKey]);

  // Save button positions whenever buttons change (backup save)
  useEffect(() => {
    if (buttons.length > 0) {
      const positions = {};
      buttons.forEach((btn) => {
        positions[btn.id] = btn.position;
      });
      // Small delay to avoid saving during initial setup
      const timeoutId = setTimeout(() => {
        saveButtonPositions(positions);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [buttons]);

  const moveButton = (id, newPosition) => {
    // Prevent moving beyond the calculated rows
    if (newPosition.y >= rows) return;

    setButtons((prevButtons) => {
      const updatedButtons = prevButtons.map((btn) => {
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
      });

      // Save positions to localStorage
      const positions = {};
      updatedButtons.forEach((btn) => {
        positions[btn.id] = btn.position;
      });
      saveButtonPositions(positions);

      return updatedButtons;
    });
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
                isCreatingStat={isCreatingStatFast}
                isLayoutMode={isLayoutMode}
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

  // Listen for layout revert events
  useEffect(() => {
    const handleLayoutReverted = () => {
      // Reload button positions from localStorage
      if (statTypes) {
        const savedPositions = loadButtonPositions();
        
        setButtons(
          statTypes.map((btn, index) => {
            const savedPosition = savedPositions && savedPositions[btn.id];
            
            return {
              ...btn,
              position: savedPosition || {
                x: index % columns,
                y: Math.floor(index / columns),
              },
            };
          })
        );
      }
    };

    window.addEventListener('layout-reverted', handleLayoutReverted);
    return () => window.removeEventListener('layout-reverted', handleLayoutReverted);
  }, [statTypes, columns]);

  return (
    <DndProvider backend={MultiBackend} options={backendConfig}>
      <div className={`relative flex justify-center border-2 p-2 ${
        isLayoutMode ? "z-40 bg-background shadow-2xl" : ""
      }`}>
        <div
          className={`grid grid-cols-4 gap-2 bg-background rounded-lg ${isLayoutMode ? "opacity-90" : ""}`}
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

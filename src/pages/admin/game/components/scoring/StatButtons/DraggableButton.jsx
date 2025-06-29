import React, { useState } from "react";
import { useDrag } from "react-dnd";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";

const ItemTypes = { BUTTON: "button" };

const DraggableButton = ({
  button,
  position,
  onRecord,
  isCreatingStat,
  isLayoutMode = false,
}) => {
  const { playerId } = useSelector((state) => state.playerStat);
  const buttonRef = React.useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.BUTTON,
    canDrag: () => isLayoutMode, // Only allow dragging in layout mode
    item: () => {
      if (buttonRef.current) {
        const { width, height } = buttonRef.current.getBoundingClientRect();
        return {
          id: button.id,
          originalPosition: position,
          button,
          width,
          height,
        };
      }
      return { id: button.id, originalPosition: position, button };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    // Prevent clicking in layout mode
    if (isLayoutMode || !playerId || isClicked || isCreatingStat) return;
    setIsClicked(true);
    onRecord(button.id, button.point_value);

    // Reset after debounce time (300ms) to match API call
    setTimeout(() => setIsClicked(false), 300);
  };

  return (
    <div
      ref={(node) => {
        drag(node);
        buttonRef.current = node;
      }}
      className={`rounded-lg transition-opacity ${
        isDragging ? "opacity-0" : "opacity-100"
      }`}
    >
      <Button
        onClick={handleClick}
        className={`w-full h-full p-1 text-[0.5rem] lg:text-xs lg:p-3 transition-transform duration-150 active:scale-95 break-words whitespace-normal
          ${isLayoutMode ? "cursor-move" : "cursor-pointer"}
          ${
            button.button_type === "made"
              ? "bg-green-900 hover:bg-green-800"
              : button.button_type === "miss" ||
                button.button_type === "negative"
              ? "bg-red-900 hover:bg-red-800"
              : "bg-blue-900 hover:bg-blue-800"
          }`}
        disabled={
          isLayoutMode ? false : !playerId || isClicked || isCreatingStat
        }
      >
        {button.name.toUpperCase()}
      </Button>
    </div>
  );
};

export default DraggableButton;

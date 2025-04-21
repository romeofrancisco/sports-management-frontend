import React, { useState } from "react";
import { useDrag } from "react-dnd";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";

const ItemTypes = { BUTTON: "button" };

const DraggableButton = ({ button, position, onRecord, isCreatingStat }) => {
  const { playerId } = useSelector((state) => state.playerStat);
  const buttonRef = React.useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.BUTTON,
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
    if (!playerId || isClicked || isCreatingStat) return;
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
      className={`cursor-move rounded-lg transition-opacity ${
        isDragging ? "opacity-0" : "opacity-100"
      }`}
    >
      <Button
        onClick={handleClick}
        className={`w-full h-full p-0 text-[0.7rem] lg:text-[0.9rem] lg:p-3 transition-transform duration-150 active:scale-95 break-words whitespace-normal
          ${
            button.button_type === "made"
              ? "bg-green-900 hover:bg-green-800"
              : button.button_type === "miss" ||
                button.button_type === "negative"
              ? "bg-red-900 hover:bg-red-800"
              : "bg-blue-900 hover:bg-blue-800"
          }`}
          disabled={!playerId || isClicked || isCreatingStat}
      >
        {button.display_name || button.name}
      </Button>
    </div>
  );
};

export default DraggableButton;

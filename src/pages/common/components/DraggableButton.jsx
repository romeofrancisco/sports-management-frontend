import React from "react";
import { useDrag } from "react-dnd";
import { Button } from "@/components/ui/button";

const ItemTypes = { BUTTON: "button" };

const DraggableButton = ({ button, position }) => {
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
        onClick={() => console.log(button.button_type)}
        className={`w-full h-full text-[0.7rem] p-0 transition-transform duration-150 active:scale-95 break-words whitespace-normal
          ${
            button.button_type === "made"
              ? "bg-green-900 hover:bg-green-800"
              : button.button_type === "miss" || button.button_type === "negative"
              ? "bg-red-900 hover:bg-red-800"
              : "bg-blue-900 hover:bg-blue-800"
          }`}
      >
        {button.name}
      </Button>
    </div>
  );
};

export default DraggableButton;

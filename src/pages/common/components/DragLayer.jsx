import React from "react";
import { useDragLayer } from "react-dnd";
import { Button } from "@/components/ui/button";

const ItemTypes = { BUTTON: "button" };

const DragLayer = () => {
  const { itemType, isDragging, item, currentOffset } = useDragLayer(
    (monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      currentOffset: monitor.getClientOffset(),
      isDragging: monitor.isDragging(),
    })
  );

  if (!isDragging || itemType !== ItemTypes.BUTTON || !currentOffset || !item) {
    return null;
  }

  const { width = 80, height = 64 } = item; // default dimensions
  const adjustedX = currentOffset.x - width / 2;
  const adjustedY = currentOffset.y - height / 2;

  return (
    <div
      className="fixed top-0 left-0 z-50 rounded-lg pointer-events-none"
      style={{
        transform: `translate(${adjustedX}px, ${adjustedY}px)`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <Button
        className={`w-full h-full text-[0.5rem] md:text-sm transition-transform duration-150 active:scale-95 break-words whitespace-normal
          ${
            item.button.button_type === "made"
              ? "bg-green-900 hover:bg-green-800"
              : item.button.button_type === "miss" || item.button.button_type === "negative"
              ? "bg-red-900 hover:bg-red-800"
              : "bg-blue-900 hover:bg-blue-800"
          } ${isDragging ? "opacity-80" : "opacity-100"}`}
          
      >
        {item.button.name}
      </Button>
    </div>
  );
};

export default DragLayer;

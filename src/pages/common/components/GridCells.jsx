import React from "react";
import { useDrop } from "react-dnd";

const ItemTypes = { BUTTON: "button" };

const GridCell = ({ x, y, moveButton, children }) => {
  const [, drop] = useDrop({
    accept: ItemTypes.BUTTON,
    drop: (item) => moveButton(item.id, { x, y }),
  });

  return (
    <div
      ref={drop}
      className="border aspect-square md:aspect-square border-gray-300 grid bg-white transition-colors duration-150 hover:bg-gray-50"
    >
      {children}
    </div>
  );
};

export default GridCell;
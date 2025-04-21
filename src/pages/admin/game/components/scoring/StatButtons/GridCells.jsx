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
      className="border bg-muted rounded-lg select-none aspect-square grid transition-colors duration-150 hover:bg-muted/50"
    >
      {children}
    </div>
  );
};

export default GridCell;
import { motion } from "framer-motion";
import { useDragDrop } from "@/components/calendar/dnd-context";
import { toast } from "sonner";

export function DraggableEvent({ event, children, className }) {
  const { startDrag, endDrag, isDragging, draggedEvent } = useDragDrop();

  const isCurrentlyDragged = isDragging && draggedEvent?.id === event.id;

  const handleClick = (e) => e.stopPropagation();

  const handleMouseDown = (e) => {
    if (event.type !== "event") {
      toast.info("Only events can be dragged");
    }
  };

  const handleDragStart = (e) => {
    if (event.type !== "event") {
      e.preventDefault(); // Prevent non-event items from dragging
      return;
    }

    startDrag(event);
    try {
      e.dataTransfer.setData("text/plain", event.id.toString());
    } catch (err) {}
  };

  return (
    <motion.div
      className={`
        ${className || ""} 
        ${isCurrentlyDragged ? "opacity-50 cursor-grabbing" : "cursor-grab"}
        ${event.type !== "event" ? "opacity-70 select-none" : ""}

      `}
      draggable
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onDragStart={handleDragStart}
      onDragEnd={() => endDrag()}
    >
      {children}
    </motion.div>
  );
}

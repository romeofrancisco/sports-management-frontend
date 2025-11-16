import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useDragDrop } from "@/components/calendar/dnd-context";
import { toast } from "sonner";
import { useRolePermissions } from "@/hooks/useRolePermissions";

export function DraggableEvent({ event, children, className }) {
  const { startDrag, endDrag, isDragging, draggedEvent } = useDragDrop();
  const { type } = event;
  const { isAdmin, isPlayer } = useRolePermissions();
  const timerRef = useRef(null);
  const LONG_PRESS_DELAY = 250; // ms

  const isCurrentlyDragged = isDragging && draggedEvent?.id === event.id;

  const handleClick = (e) => e.stopPropagation();

  const clearLongPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleMouseDown = (e) => {
    // start a short long-press timer; only if the user holds will we show permission/info toasts
    clearLongPress();
    timerRef.current = setTimeout(() => {
      if (isPlayer()) {
        toast.error("You do not have permission to drag events");
      } else if (event.type !== "event") {
        type === "event" ? toast.info("Only events can be dragged") : null;
      }
      timerRef.current = null;
    }, LONG_PRESS_DELAY);
  };

  const handleMouseUp = () => {
    // quick click -> cancel the long-press action
    clearLongPress();
  };

  const handleMouseLeave = () => {
    // leaving the element cancels long-press
    clearLongPress();
  };

  const handleDragStart = (e) => {
    // if dragging starts, cancel the long-press timer to avoid showing toasts
    clearLongPress();
    if (event.type !== "event" || isPlayer()) {
      e.preventDefault(); // Prevent non-event items or unauthorized users from dragging
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
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onDragStart={handleDragStart}
      onDragEnd={() => endDrag()}
    >
      {children}
    </motion.div>
  );
}

import React, { useEffect, useState, type JSX } from "react";
import type {
  Position,
  RectangleProps,
  RectangleType,
  dragOffset,
} from "../types/allTypes";

export default function Rectangle({
  left,
  top,
  width,
  height,
  id,
  color,
  borderRadius,
  draggingRef,
  setIsInside,
  setRectangleList,
}: RectangleProps): JSX.Element {
  const [grab, setGrab] = useState(false); // for tracking grab
  const [dragOffset, setDragOffset] = useState<dragOffset>({ x: 0, y: 0 }); // for tracking offset between mouse position and rectangle top-left corner
  const [currentPosition, setCurrentPosition] = useState<Position>({
    x: left,
    y: top,
    height: height,
    width: width,
  }); // for setting the current position from props

  useEffect(() => {
    setCurrentPosition({ x: left, y: top, height: height, width: width });
  }, [left, top, height, width]); // updating current props if props change

  useEffect((): void | (() => void) => {
    const handleMouseMove = (e: MouseEvent): void => {
      if (!grab) return; // returning if rectangle is not grabbed

      draggingRef.current = true; // setting true cause dragging is started

      let x = e.clientX - dragOffset.x;
      let y = e.clientY - dragOffset.y;

      // Boundary check (lock inside screen)
      const maxX = window.innerWidth - width;
      const maxY = window.innerHeight - height;

      if (x < 0) x = 0;
      if (y < 0) y = 0;
      if (x > maxX) x = maxX;
      if (y > maxY) y = maxY;
      setCurrentPosition((prev) => ({ ...prev, x, y })); // updating the current position while dragging
    };

    const handleMouseUp = (): void => {
      if (!grab) return; // returning if rectangle is not grabbed
      setGrab(false); // releasing the grab
      setIsInside(false); // setting inInside false when mouseUp from rectangle
      setTimeout(() => {
        draggingRef.current = false;
      }, 0); // setting drag false cause drag finished and using setTimeout to update state at last

      setRectangleList((prev: RectangleType[]): RectangleType[] =>
        prev.map(
          (item: RectangleType): RectangleType =>
            item.id === id
              ? { ...item, X: currentPosition.x, Y: currentPosition.y }
              : item
        )
      ); // Updating the rectangle list with the new rectangle's updated position
    };

    if (grab) {
      // only add event listeners if rectangle is grabbed
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }; // remove event listener through cleanup function
  }, [grab, dragOffset, id, setIsInside, setRectangleList, currentPosition]); // for re-run code if dependencies change

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsInside(true); // setting isInside if mouse is down on rectangle
    setGrab(true); // making sure that rectangle is grabbed
    setDragOffset({
      x: e.clientX - currentPosition.x,
      y: e.clientY - currentPosition.y,
    }); // setting drag offset
  };

  return (
    <div
      className={`absolute border border-gray-500 opacity-65 ${
        grab ? "cursor-grabbing" : "cursor-grab"
      }`}
      onMouseDown={onMouseDown}
      style={{
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
        width: `${currentPosition.width}px`,
        height: `${currentPosition.height}px`,
        backgroundColor: color,
        borderRadius: borderRadius,
      }}
    ></div>
  );
}

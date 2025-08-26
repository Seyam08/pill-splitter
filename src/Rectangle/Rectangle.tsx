import React, { useEffect, useRef, useState, type JSX } from "react";
import type {
  Position,
  RectangleProps,
  RectangleType,
} from "../types/allTypes";

export default function Rectangle({
  left,
  top,
  width,
  height,
  id,
  color,
  isDrawing,
  draggingRef,
  setIsInside,
  setRectangleList,
}: RectangleProps): JSX.Element {
  const [grab, setGrab] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState<Position>({
    x: left,
    y: top,
    height: height,
    width: width,
  });
  const rectRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCurrentPosition({ x: left, y: top, height: height, width: width });
  }, [left, top, height, width]);

  useEffect((): void | (() => void) => {
    const handleMouseMove = (e: MouseEvent): void => {
      if (!grab) return;

      draggingRef.current = true;

      let x = e.clientX - dragOffset.x;
      let y = e.clientY - dragOffset.y;

      // Boundary check (lock inside screen)
      const maxX = window.innerWidth - width;
      const maxY = window.innerHeight - height;

      if (x < 0) x = 0;
      if (y < 0) y = 0;
      if (x > maxX) x = maxX;
      if (y > maxY) y = maxY;
      setCurrentPosition({ x, y });
    };

    const handleMouseUp = (): void => {
      if (!grab) return;
      setGrab(false);
      setIsInside(false);
      setTimeout(() => {
        draggingRef.current = false;
      }, 0);
      // Update parent state
      setRectangleList((prev: RectangleType[]): RectangleType[] =>
        prev.map(
          (item: RectangleType): RectangleType =>
            item.id === id
              ? { ...item, X: currentPosition.x, Y: currentPosition.y }
              : item
        )
      );
    };

    if (grab) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [grab, dragOffset, id, setIsInside, setRectangleList, currentPosition]);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsInside(true);
    setGrab(true);
    setDragOffset({
      x: e.clientX - currentPosition.x,
      y: e.clientY - currentPosition.y,
    });
  };

  useEffect((): void | (() => void) => {
    const rect = rectRef.current?.getBoundingClientRect();
    if (rect && !isDrawing && !grab) {
      const onClickHandler = (e: MouseEvent): void => {
        if (draggingRef.current) return;
        const cutX = e.clientX > rect.left && e.clientX < rect.right;
        const cutY = e.clientY > rect.top && e.clientY < rect.bottom;
        console.log({ id, cutX, cutY });
      };

      window.addEventListener("click", onClickHandler);
      return () => {
        window.removeEventListener("click", onClickHandler);
      };
    }
  }, [rectRef.current]);

  return (
    <div
      className={`absolute border border-gray-500 opacity-65 rounded-2xl ${
        grab ? "cursor-grabbing" : "cursor-grab"
      }`}
      onMouseDown={onMouseDown}
      ref={rectRef}
      style={{
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
        width: `${currentPosition.width}px`,
        height: `${currentPosition.height}px`,
        backgroundColor: color,
      }}
    ></div>
  );
}

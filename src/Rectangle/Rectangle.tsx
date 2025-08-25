import { useEffect, useState, type JSX } from "react";
import type { Rectangle } from "../DragRectangle/DragRectangle";

type Position = {
  x: number;
  y: number;
};

type RectangleProps = {
  left: number;
  top: number;
  width: number;
  height: number;
  id: string;
  color: string;
  setIsInside?: React.Dispatch<React.SetStateAction<boolean>>;
  setRectangleList?: React.Dispatch<React.SetStateAction<Rectangle[]>>;
};

export default function Rectangle({
  left,
  top,
  width,
  height,
  id,
  color,
  setIsInside,
  setRectangleList,
}: RectangleProps): JSX.Element {
  const [grab, setGrab] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState<Position>({
    x: left,
    y: top,
  });

  useEffect(() => {
    setCurrentPosition({ x: left, y: top });
  }, [left, top]);

  useEffect((): void | (() => void) => {
    const handleMouseMove = (e: MouseEvent): void => {
      if (!grab) return;
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
      setIsInside?.(false);

      // Update parent state
      setRectangleList?.((prev: Rectangle[]): Rectangle[] =>
        prev.map(
          (item: Rectangle): Rectangle =>
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
    setIsInside?.(true);
    setGrab(true);
    setDragOffset({
      x: e.clientX - currentPosition.x,
      y: e.clientY - currentPosition.y,
    });
  };

  return (
    <div
      className={`absolute border border-gray-500 opacity-65 rounded-2xl ${
        grab ? "cursor-grabbing" : "cursor-grab"
      }`}
      onMouseDown={onMouseDown}
      style={{
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: color,
      }}
    />
  );
}

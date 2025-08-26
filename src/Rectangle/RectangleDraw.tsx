import { useEffect, useState, type JSX } from "react";
import type { Position, RectangleDrawProps } from "../types/allTypes";

export default function RectangleDraw({
  left,
  top,
  width,
  height,
  color,
}: RectangleDrawProps): JSX.Element {
  const [currentPosition, setCurrentPosition] = useState<Position>({
    x: left,
    y: top,
    height: height,
    width: width,
  });

  useEffect(() => {
    setCurrentPosition({ x: left, y: top, height: height, width: width });
  }, [left, top, height, width]);

  return (
    <div
      className="absolute border border-gray-500 opacity-65 rounded-2xl cursor-grab"
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

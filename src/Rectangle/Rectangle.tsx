import React, { useEffect, useState, type JSX } from "react";
import type {
  Position,
  RectangleProps,
  RectangleType,
} from "../types/allTypes";
import { randomId } from "../util/randomId";

type dragOffset = Omit<Position, "height" | "width">;

export default function Rectangle({
  left,
  top,
  width,
  height,
  id,
  color,
  isDrawing,
  borderRadius,
  draggingRef,
  setIsInside,
  setRectangleList,
}: RectangleProps): JSX.Element {
  const [grab, setGrab] = useState(false);
  const [dragOffset, setDragOffset] = useState<dragOffset>({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState<Position>({
    x: left,
    y: top,
    height: height,
    width: width,
  });

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
      setCurrentPosition((prev) => ({ ...prev, x, y }));
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
    if (!isDrawing && !grab) {
      const onClickHandler = (e: MouseEvent): void => {
        if (draggingRef.current) return;
        const cutX =
          e.clientX > currentPosition.x &&
          e.clientX < currentPosition.x + currentPosition.width;
        const cutY =
          e.clientY > currentPosition.y &&
          e.clientY < currentPosition.y + currentPosition.height;
        // console.log(rect);
        // console.log({ clientX: e.clientX, clientY: e.clientY });
        // console.log({ id, cutX, cutY });
        if (cutY && !cutX) {
          const firstId = randomId();
          const firstX = currentPosition.x;
          const firstY = currentPosition.y;
          const firstHeight = e.clientY - currentPosition.y;
          const firstWidth = currentPosition.width;
          const firstRect: RectangleType = {
            id: firstId,
            X: firstX,
            Y: firstY,
            height: firstHeight,
            width: firstWidth,
            color: color,
            borderRadius: `${borderRadius.split(" ")[0]} ${
              borderRadius.split(" ")[1]
            } 0 0`,
          };

          const secondId = randomId();
          const secondX = currentPosition.x;
          const secondY = e.clientY;
          const secondHeight =
            currentPosition.y + currentPosition.height - e.clientY;
          const secondWidth = currentPosition.width;
          const secondRect: RectangleType = {
            id: secondId,
            X: secondX,
            Y: secondY,
            height: secondHeight,
            width: secondWidth,
            color: color,
            borderRadius: `0 0 ${borderRadius.split(" ")[2]} ${
              borderRadius.split(" ")[3]
            }`,
          };
          // console.log(secondRect);
          setRectangleList((prev: RectangleType[]): RectangleType[] => [
            ...prev.filter((item) => item.id !== id),
            firstRect,
            secondRect,
          ]);
        }
        if (cutX && !cutY) {
          const firstId = randomId();
          const firstX = currentPosition.x;
          const firstY = currentPosition.y;
          const firstHeight = currentPosition.height;
          const firstWidth = e.clientX - currentPosition.x;
          const firstRect: RectangleType = {
            id: firstId,
            X: firstX,
            Y: firstY,
            height: firstHeight,
            width: firstWidth,
            color: color,
            borderRadius: `${borderRadius.split(" ")[0]} 0 0 ${
              borderRadius.split(" ")[3]
            }`,
          };

          const secondId = randomId();
          const secondX = e.clientX;
          const secondY = currentPosition.y;
          const secondHeight = currentPosition.height;
          const secondWidth =
            currentPosition.x + currentPosition.width - e.clientX;
          const secondRect: RectangleType = {
            id: secondId,
            X: secondX,
            Y: secondY,
            height: secondHeight,
            width: secondWidth,
            color: color,
            borderRadius: `0 ${borderRadius.split(" ")[1]} ${
              borderRadius.split(" ")[2]
            } 0`,
          };
          // console.log(secondRect);
          setRectangleList((prev: RectangleType[]): RectangleType[] => [
            ...prev.filter((item) => item.id !== id),
            firstRect,
            secondRect,
          ]);
        }
        if (cutX && cutY) {
          const topHeight = e.clientY - currentPosition.y;
          const bottomHeight =
            currentPosition.y + currentPosition.height - e.clientY;
          const leftWidth = e.clientX - currentPosition.x;
          const rightWidth =
            currentPosition.x + currentPosition.width - e.clientX;

          const rects: RectangleType[] = [
            {
              id: randomId(),
              X: currentPosition.x,
              Y: currentPosition.y,
              width: leftWidth,
              height: topHeight,
              color,
              borderRadius: `${borderRadius.split(" ")[0]} 0 0 0`,
            },
            {
              id: randomId(),
              X: e.clientX,
              Y: currentPosition.y,
              width: rightWidth,
              height: topHeight,
              color,
              borderRadius: `0 ${borderRadius.split(" ")[1]} 0 0`,
            },
            {
              id: randomId(),
              X: currentPosition.x,
              Y: e.clientY,
              width: leftWidth,
              height: bottomHeight,
              color,
              borderRadius: `0 0 0 ${borderRadius.split(" ")[3]}`,
            },
            {
              id: randomId(),
              X: e.clientX,
              Y: e.clientY,
              width: rightWidth,
              height: bottomHeight,
              color,
              borderRadius: `0 0 ${borderRadius.split(" ")[2]} 0`,
            },
          ];

          setRectangleList((prev) => [
            ...prev.filter((item) => item.id !== id),
            ...rects,
          ]);
        }
      };

      window.addEventListener("click", onClickHandler);
      return () => {
        window.removeEventListener("click", onClickHandler);
      };
    }
  }, [isDrawing, grab, currentPosition, color, setRectangleList]);

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

import { useEffect, useRef, useState, type JSX } from "react";
import ClearAll from "../ClearAll/ClearAll";
import CrossLine from "../CrossLine/CrossLine";
import Rectangle from "../Rectangle/Rectangle";
import RectangleDraw from "../Rectangle/RectangleDraw";
import type { RectangleType, StartPoint } from "../types/allTypes";
import { getRandomColor } from "../util/getRandomColor";
import { moveIfTooSmall } from "../util/moveIfTooSmall";
import { randomId } from "../util/randomId";

export default function DragRectangle(): JSX.Element {
  const [isDrawing, setIsDrawing] = useState<boolean>(false); // state for control rectangle drawing start-end
  const [isInside, setIsInside] = useState<boolean>(false); // state for control rectangle dragging start-end
  const startPoint = useRef<StartPoint>({
    X: 0,
    Y: 0,
  }); // for declaring and hold start point value
  const [rectangle, setRectangle] = useState<RectangleType | null>(null); // for showing rectangle after created
  const [rectangleList, setRectangleList] = useState<RectangleType[]>([]); // for creating array of rectangle

  const [color, setColor] = useState<string>("gray");
  const [id, setId] = useState<string>("");
  const draggingRef = useRef(false);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (isInside) {
      return;
    }
    setIsDrawing(true);
    startPoint.current = { X: e.clientX, Y: e.clientY };
    setColor(getRandomColor());
    const id = randomId();
    setId(id);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (isDrawing && !isInside) {
      draggingRef.current = true;
      const x = Math.min(e.clientX, startPoint.current.X);
      const y = Math.min(e.clientY, startPoint.current.Y);
      const w = Math.abs(e.clientX - startPoint.current.X);
      const h = Math.abs(e.clientY - startPoint.current.Y);

      setRectangle({
        id: id,
        X: x,
        Y: y,
        height: h,
        width: w,
        color: color,
        borderRadius: "16px 16px 16px 16px",
      });
    }
  };

  const onMouseUp = (): void => {
    setIsDrawing(false);
    rectangle && setRectangleList((prev) => [...prev, rectangle]);
    setRectangle(null);
    setTimeout(() => (draggingRef.current = false), 0);
  };

  const onClickHandler = (e: MouseEvent): void => {
    if (draggingRef.current) return;

    setRectangleList((prev) => {
      let newRects: RectangleType[] = [];

      prev.forEach((rect) => {
        const cutX = e.clientX > rect.X && e.clientX < rect.X + rect.width;
        const cutY = e.clientY > rect.Y && e.clientY < rect.Y + rect.height;

        if (cutX || cutY) {
          if (cutX && cutY) {
            // split into 4
            const topHeight = e.clientY - rect.Y;
            const bottomHeight = rect.height - topHeight;
            const leftWidth = e.clientX - rect.X;
            const rightWidth = rect.width - leftWidth;
            const firstRect: RectangleType = {
              id: randomId(),
              X: rect.X,
              Y: rect.Y,
              width: leftWidth,
              height: topHeight,
              color: rect.color,
              borderRadius: `${rect.borderRadius.split(" ")[0]} 0 0 0`,
            };
            const secondRect: RectangleType = {
              id: randomId(),
              X: e.clientX,
              Y: rect.Y,
              width: rightWidth,
              height: topHeight,
              color: rect.color,
              borderRadius: `0 ${rect.borderRadius.split(" ")[1]} 0 0`,
            };
            const thirdRect: RectangleType = {
              id: randomId(),
              X: rect.X,
              Y: e.clientY,
              width: leftWidth,
              height: bottomHeight,
              color: rect.color,
              borderRadius: `0 0 0 ${rect.borderRadius.split(" ")[3]}`,
            };

            const fourthRect: RectangleType = {
              id: randomId(),
              X: e.clientX,
              Y: e.clientY,
              width: rightWidth,
              height: bottomHeight,
              color: rect.color,
              borderRadius: `0 0 ${rect.borderRadius.split(" ")[2]} 0`,
            };

            const adjustedFirstRect: RectangleType = moveIfTooSmall(firstRect);
            const adjustedSecondRect: RectangleType =
              moveIfTooSmall(secondRect);
            const adjustedThirdRect: RectangleType = moveIfTooSmall(thirdRect);
            const adjustedFourthRect: RectangleType =
              moveIfTooSmall(fourthRect);

            newRects.push(
              adjustedFirstRect,
              adjustedSecondRect,
              adjustedThirdRect,
              adjustedFourthRect
            );
          } else if (cutX) {
            // vertical split
            const leftWidth = e.clientX - rect.X;
            const rightWidth = rect.width - leftWidth;
            const firstRect: RectangleType = {
              id: randomId(),
              X: rect.X,
              Y: rect.Y,
              width: leftWidth,
              height: rect.height,
              color: rect.color,
              borderRadius: `${rect.borderRadius.split(" ")[0]} 0 0 ${
                rect.borderRadius.split(" ")[3]
              }`,
            };
            const secondRect: RectangleType = {
              id: randomId(),
              X: e.clientX,
              Y: rect.Y,
              width: rightWidth,
              height: rect.height,
              color: rect.color,
              borderRadius: `0 ${rect.borderRadius.split(" ")[1]} ${
                rect.borderRadius.split(" ")[2]
              } 0`,
            };

            const adjustedFirstRect: RectangleType = moveIfTooSmall(firstRect);
            const adjustedSecondRect: RectangleType =
              moveIfTooSmall(secondRect);

            newRects.push(adjustedFirstRect, adjustedSecondRect);
          } else if (cutY) {
            // horizontal split
            const topHeight = e.clientY - rect.Y;
            const bottomHeight = rect.height - topHeight;
            const firstRect: RectangleType = {
              id: randomId(),
              X: rect.X,
              Y: rect.Y,
              width: rect.width,
              height: topHeight,
              color: rect.color,
              borderRadius: `${rect.borderRadius.split(" ")[0]} ${
                rect.borderRadius.split(" ")[1]
              } 0 0`,
            };
            const secondRect: RectangleType = {
              id: randomId(),
              X: rect.X,
              Y: e.clientY,
              width: rect.width,
              height: bottomHeight,
              color: rect.color,
              borderRadius: `0 0 ${rect.borderRadius.split(" ")[2]} ${
                rect.borderRadius.split(" ")[3]
              }`,
            };
            const adjustedFirstRect: RectangleType = moveIfTooSmall(firstRect);
            const adjustedSecondRect: RectangleType =
              moveIfTooSmall(secondRect);

            newRects.push(adjustedFirstRect, adjustedSecondRect);
          }
        } else {
          // no cut → keep rectangle as is
          newRects.push(rect);
        }
      });

      return newRects;
    });
  };

  useEffect(() => {
    window.addEventListener("click", onClickHandler);
    return () => {
      window.removeEventListener("click", onClickHandler);
    };
  }, []);

  return (
    <>
      <div
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        className="bg-blue-200 cursor-crosshair h-screen w-screen relative"
      >
        <CrossLine />
        {rectangleList.map(
          (rect: RectangleType, index: number): JSX.Element => {
            return (
              <Rectangle
                key={index}
                height={rect.height}
                width={rect.width}
                left={rect.X}
                top={rect.Y}
                borderRadius={rect.borderRadius}
                id={rect.id}
                color={rect.color}
                draggingRef={draggingRef}
                setIsInside={setIsInside}
                setRectangleList={setRectangleList}
              />
            );
          }
        )}
        {rectangle && (
          <RectangleDraw
            height={rectangle.height}
            width={rectangle.width}
            left={rectangle.X}
            top={rectangle.Y}
            borderRadius={rectangle.borderRadius}
            color={rectangle.color}
          />
        )}
        <ClearAll setRectangleList={setRectangleList} />
      </div>
    </>
  );
}

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
  const [id, setId] = useState<string>(""); // to preserve a random id for rectangle
  const draggingRef = useRef(false); // for tracking drag

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (isInside) {
      return; // retuning so that dragging can't be start inside of a rectangle
    }
    setIsDrawing(true);
    startPoint.current = { X: e.clientX, Y: e.clientY }; // holding the start value while starting to draw
    setColor(getRandomColor());
    const id = randomId();
    setId(id);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (isDrawing && !isInside) {
      // only execute if drawing started and not inside of any rectangle
      draggingRef.current = true; // for tracking drag
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
    setIsDrawing(false); // drawing finished
    rectangle && setRectangleList((prev) => [...prev, rectangle]); // if rectangle exists, add it to the list
    setRectangle(null); // resting the drawn rectangle
    setTimeout(() => (draggingRef.current = false), 0); // setting drag false cause drag finished and using setTimeout to update state at last
  };

  const onClickHandler = (e: MouseEvent): void => {
    if (draggingRef.current) return; // returning if dragging is in progress

    setRectangleList((prev: RectangleType[]): RectangleType[] => {
      // setting new rectangle list
      let newRects: RectangleType[] = [];

      prev.forEach((rect: RectangleType): void => {
        // looping every rectangle for tracking cut on rectangles
        const cutX = e.clientX > rect.X && e.clientX < rect.X + rect.width; // checking if cut done from X axis
        const cutY = e.clientY > rect.Y && e.clientY < rect.Y + rect.height; // checking if cut done from Y axis
        const measure: number =
          import.meta.env.VITE_SMALLEST_RECTANGLE_SIZE || 40; // holding a measure for smallest rectangle size

        if (cutX || cutY) {
          // will execute if any axis cut detected
          if (cutX && cutY) {
            // 4-way split
            const topHeight = e.clientY - rect.Y;
            const bottomHeight = rect.height - topHeight;
            const leftWidth = e.clientX - rect.X;
            const rightWidth = rect.width - leftWidth;
            const measure: number = 40;
            // check too small
            if (rect.width < measure || rect.height < measure) {
              newRects.push(moveIfTooSmall(rect, measure)); // if rectangle is smaller then measure then move it
            } else {
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

              newRects.push(firstRect, secondRect, thirdRect, fourthRect); // adding all 4 into rectangles
            }
          } else if (cutX) {
            // 2 way horizontal split, if cut done by X axis
            const leftWidth = e.clientX - rect.X;
            const rightWidth = rect.width - leftWidth;

            if (rect.width < measure) {
              newRects.push(moveIfTooSmall(rect, measure)); // if rectangle is smaller then measure then move it
            } else {
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

              newRects.push(firstRect, secondRect); // adding 2 into rectangles
            }
          } else if (cutY) {
            // 2 way vertical split, if cut done by Y axis
            const topHeight = e.clientY - rect.Y;
            const bottomHeight = rect.height - topHeight;

            if (rect.height < measure) {
              newRects.push(moveIfTooSmall(rect, measure)); // if rectangle is smaller then measure then move it
            } else {
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

              newRects.push(firstRect, secondRect); //adding 2 into rectangles
            }
          }
        } else {
          // if no cut detected then keep the old one
          newRects.push(rect);
        }
      });

      return newRects; // return new rectangles that will be set via setRectangles
    });
  };

  useEffect(() => {
    window.addEventListener("click", onClickHandler); // adding event listener
    return () => {
      window.removeEventListener("click", onClickHandler); // removing event listener on unmount
    };
  }, []); // no dependency, cause want to run only on didMount and unmount

  return (
    <>
      <div
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        className="bg-blue-200 cursor-crosshair h-screen w-screen relative"
      >
        <CrossLine /> {/* cross line on entire screen following cursor */}
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
        {/* for only showing when rectangle is being drawn */}
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
        {/* Clear all rectangles button */}
        <ClearAll setRectangleList={setRectangleList} />
      </div>
    </>
  );
}

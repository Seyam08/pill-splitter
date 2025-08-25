import { useRef, useState, type JSX } from "react";
import Rectangle from "../Rectangle/Rectangle";
import { randomId } from "../util/randomId";

export type Rectangle = {
  id: string;
  X: number;
  Y: number;
  height: number;
  width: number;
};
export type StartPoint = {
  X: number;
  Y: number;
};

export default function DragRectangle(): JSX.Element {
  const [isDrawing, setIsDrawing] = useState<boolean>(false); // state for control rectangle drawing start-end
  const [isInside, setIsInside] = useState<boolean>(false); // state for control rectangle dragging start-end
  const startPoint = useRef<StartPoint>({
    X: 0,
    Y: 0,
  }); // for declaring and hold start point value
  const [rectangle, setRectangle] = useState<Rectangle | null>(null); // for showing rectangle after created
  const [rectangleList, setRectangleList] = useState<Rectangle[]>([]); // for creating array of rectangle

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (isInside) {
      return;
    }
    setIsDrawing(true);
    startPoint.current = { X: e.clientX, Y: e.clientY };
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (isDrawing && !isInside) {
      const x = Math.min(e.clientX, startPoint.current.X);
      const y = Math.min(e.clientY, startPoint.current.Y);
      const w = Math.abs(e.clientX - startPoint.current.X);
      const h = Math.abs(e.clientY - startPoint.current.Y);

      setRectangle({
        id: randomId(),
        X: x,
        Y: y,
        height: h,
        width: w,
      });
    }
  };

  const onMouseUp = (): void => {
    setIsDrawing(false);
    rectangle && setRectangleList((prev) => [...prev, rectangle]);
    setRectangle(null);
  };

  console.log("component render");
  return (
    <>
      <div
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        className="bg-blue-200 cursor-crosshair h-screen w-screen relative"
      >
        {rectangleList.map((rect: Rectangle): JSX.Element => {
          return (
            <Rectangle
              key={rect?.id}
              height={rect?.height}
              width={rect?.width}
              left={rect?.X}
              top={rect?.Y}
              id={rect?.id}
              setIsInside={setIsInside}
              setRectangleList={setRectangleList}
            />
          );
        })}
        {rectangle && (
          <Rectangle
            height={rectangle?.height}
            width={rectangle?.width}
            left={rectangle?.X}
            top={rectangle?.Y}
            id={rectangle?.id}
          />
        )}
      </div>
    </>
  );
}

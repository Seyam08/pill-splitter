import { useRef, useState, type JSX } from "react";
import ClearAll from "../ClearAll/ClearAll";
import CrossLine from "../CrossLine/CrossLine";
import Rectangle from "../Rectangle/Rectangle";
import RectangleDraw from "../Rectangle/RectangleDraw";
import type { RectangleType, StartPoint } from "../types/allTypes";
import { getRandomColor } from "../util/getRandomColor";
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
      });
    }
  };

  const onMouseUp = (): void => {
    setIsDrawing(false);
    rectangle && setRectangleList((prev) => [...prev, rectangle]);
    setRectangle(null);
    setTimeout(() => (draggingRef.current = false), 0);
  };

  return (
    <>
      <div
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        className="bg-blue-200 cursor-crosshair h-screen w-screen relative"
      >
        <CrossLine />
        {rectangleList.map((rect: RectangleType): JSX.Element => {
          return (
            <Rectangle
              key={rect?.id}
              height={rect?.height}
              width={rect?.width}
              left={rect?.X}
              top={rect?.Y}
              id={rect?.id}
              color={rect?.color}
              isDrawing={isDrawing}
              draggingRef={draggingRef}
              setIsInside={setIsInside}
              setRectangleList={setRectangleList}
            />
          );
        })}
        {rectangle && (
          <RectangleDraw
            height={rectangle?.height}
            width={rectangle?.width}
            left={rectangle?.X}
            top={rectangle?.Y}
            color={rectangle?.color}
          />
        )}
        <ClearAll setRectangleList={setRectangleList} />
      </div>
    </>
  );
}

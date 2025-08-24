import { useRef, useState } from "react";
import Rectangle from "../Rectangle/Rectangle";

type Rectangle = {
  X: number;
  Y: number;
  height: number;
  width: number;
};
type StartPoint = {
  X: number;
  Y: number;
};

export default function DragRectangle() {
  const [isDrawing, setIsDrawing] = useState<Boolean>(false); // state for control rectangle drawing start-end
  const startPoint = useRef<StartPoint>({
    X: 0,
    Y: 0,
  }); // for declaring and hold start point value
  const [rectangle, setRectangle] = useState<Rectangle | null>(null); // for showing rectangle after created
  const [rectangleList, setRectangleList] = useState<Rectangle[]>([]);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    setIsDrawing(true);
    startPoint.current = { X: e.clientX, Y: e.clientY };
    setRectangle(null);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (isDrawing) {
      const x = Math.min(e.clientX, startPoint.current.X);
      const y = Math.min(e.clientY, startPoint.current.Y);
      const w = Math.abs(e.clientX - startPoint.current.X);
      const h = Math.abs(e.clientY - startPoint.current.Y);

      setRectangle({ X: x, Y: y, height: h, width: w });
    }
  };
  const onMouseUp = (): void => {
    setIsDrawing(false);

    rectangle && setRectangleList((prev) => [...prev, rectangle]);

    console.log(rectangle);
  };
  console.log(rectangleList);

  return (
    <>
      <div
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        className="bg-blue-200 cursor-crosshair h-screen w-screen relative"
      >
        {rectangle && (
          <Rectangle
            height={rectangle?.height}
            width={rectangle?.width}
            left={rectangle?.X}
            top={rectangle?.Y}
          />
        )}
      </div>
    </>
  );
}

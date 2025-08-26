export type RectangleType = {
  id: string;
  X: number;
  Y: number;
  height: number;
  width: number;
  color: string;
};
export type StartPoint = {
  X: number;
  Y: number;
};
export type Position = {
  x: number;
  y: number;
  height?: number;
  width?: number;
};
export type RectangleProps = {
  left: number;
  top: number;
  width: number;
  height: number;
  id: string;
  color: string;
  isDrawing: boolean;
  draggingRef: React.RefObject<boolean>;
  setIsInside: React.Dispatch<React.SetStateAction<boolean>>;
  setRectangleList: React.Dispatch<React.SetStateAction<RectangleType[]>>;
};

export type RectangleDrawProps = Pick<
  RectangleProps,
  "left" | "top" | "width" | "height" | "color"
>;

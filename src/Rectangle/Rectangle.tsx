type RectangleProps = {
  left: Number;
  top: Number;
  width: Number;
  height: Number;
};

export default function Rectangle({
  left,
  top,
  width,
  height,
}: RectangleProps) {
  return (
    <div
      className="absolute border border-b-gray-500 bg-amber-500 opacity-65 rounded-2xl"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  );
}

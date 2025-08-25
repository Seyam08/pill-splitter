import { useState } from "react";

export default function CrossLine() {
  const [hr, setHr] = useState<number>(0);
  const [vr, setVr] = useState<number>(0);

  onmousemove = (e: MouseEvent) => {
    setHr(e.clientY);
    setVr(e.clientX);
  };

  return (
    <>
      <div
        style={{ left: vr }}
        className="absolute h-screen w-0 border-l border-gray-700"
      ></div>
      <div
        style={{ top: hr }}
        className="absolute h-0 w-screen border-b border-gray-700"
      ></div>
    </>
  );
}

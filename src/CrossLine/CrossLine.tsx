import { useEffect, useState, type JSX } from "react";

export default function CrossLine(): JSX.Element {
  const [hr, setHr] = useState<number>(0);
  const [vr, setVr] = useState<number>(0);

  useEffect((): void | (() => void) => {
    const mouseMoveHandler = (e: MouseEvent) => {
      setHr(e.clientY);
      setVr(e.clientX);
    };
    window.addEventListener("mousemove", mouseMoveHandler);
    return (): void => {
      window.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, []);
  return (
    <>
      <div
        style={{ left: vr }}
        className="fixed h-screen w-0 border-l border-gray-950"
      ></div>
      <div
        style={{ top: hr }}
        className="fixed h-0 w-screen border-b border-gray-950"
      ></div>
    </>
  );
}

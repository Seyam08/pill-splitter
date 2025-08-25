import React, { useEffect, useRef } from "react";

const useGrabRectangle = (
  callback: () => void
): React.RefObject<HTMLDivElement | null> => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickInside = (event: MouseEvent) => {
      if (ref.current && ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickInside);
    return () => {
      document.removeEventListener("mouseup", handleClickInside);
    };
  }, [callback]);

  return ref;
};

export default useGrabRectangle;

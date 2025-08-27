import type { RectangleType } from "../types/allTypes";

export function moveIfTooSmall(rect: RectangleType): RectangleType {
  const adjusted = { ...rect };

  // Height too small → move up-down
  if (rect.height < 20) {
    const spaceTop = rect.Y;
    const spaceBottom = window.innerHeight - (rect.Y + rect.height);

    if (spaceTop > spaceBottom) {
      adjusted.Y = Math.max(0, rect.Y - 30); // if upside has more space
    } else {
      adjusted.Y = Math.min(window.innerHeight - rect.height, rect.Y + 30); //if bottom side has more space
    }
  }

  // Width too small → move left-right
  if (rect.width < 20) {
    const spaceLeft = rect.X;
    const spaceRight = window.innerWidth - (rect.X + rect.width);

    if (spaceLeft > spaceRight) {
      adjusted.X = Math.max(0, rect.X - 30); // if left side has more space
    } else {
      adjusted.X = Math.min(window.innerWidth - rect.width, rect.X + 30); // if right side has more space
    }
  }

  return adjusted;
}

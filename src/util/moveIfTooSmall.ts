import type { RectangleType } from "../types/allTypes";

export function moveIfTooSmall(
  rect: RectangleType,
  measure: number
): RectangleType {
  const adjusted = { ...rect };

  // Height too small → move up-down
  if (rect.height < measure) {
    const spaceTop = rect.Y;
    const spaceBottom = window.innerHeight - (rect.Y + rect.height);

    if (spaceTop > spaceBottom) {
      adjusted.Y = Math.max(0, rect.Y - measure * 2); // if upside has more space
    } else {
      adjusted.Y = Math.min(
        window.innerHeight - rect.height,
        rect.Y + measure * 2
      ); //if bottom side has more space
    }
  }

  // Width too small → move left-right
  if (rect.width < measure) {
    const spaceLeft = rect.X;
    const spaceRight = window.innerWidth - (rect.X + rect.width);

    if (spaceLeft > spaceRight) {
      adjusted.X = Math.max(0, rect.X - measure * 2); // if left side has more space
    } else {
      adjusted.X = Math.min(
        window.innerWidth - rect.width,
        rect.X + measure * 2
      ); // if right side has more space
    }
  }

  return adjusted;
}

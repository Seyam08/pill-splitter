export const getRandomColor = (): string => {
  const colors: string[] = [
    "Tomato",
    "Orange",
    "DodgerBlue",
    "MediumSeaGreen",
    "SlateBlue",
    "Crimson",
    "DarkOrchid",
    "Gold",
    "LightCoral",
    "MediumTurquoise",
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

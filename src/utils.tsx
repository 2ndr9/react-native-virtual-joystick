export const calcDistance = (
  p1: { x: number; y: number },
  p2: { x: number; y: number }
) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  return Math.sqrt(dx * dx + dy * dy);
};

export const convertFromBottomLeftOfWrapperToFromCenterOfWrapper = (
  xOrYFromBottomLeftOfWrapper: number,
  wrapperRadius: number
) => {
  return xOrYFromBottomLeftOfWrapper - wrapperRadius;
};

export const clampPositionToCircle = (
  fingerXOrY: number,
  distance_between_center_and_finger: number,
  wrapperRadius: number
) => {
  return distance_between_center_and_finger <= wrapperRadius
    ? fingerXOrY
    : (wrapperRadius * fingerXOrY) / distance_between_center_and_finger;
};

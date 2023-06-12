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
  distanceBetweenCenterAndFinger: number,
  wrapperRadius: number
) => {
  return distanceBetweenCenterAndFinger <= wrapperRadius
    ? fingerXOrY
    : (wrapperRadius * fingerXOrY) / distanceBetweenCenterAndFinger;
};

export const calcMagnitudeInPercent = (
  stickX: number,
  stickY: number,
  wrapperRadius: number
): number => {
  const distanceBetweenCenterAndStick = calcDistance(
    { x: 0, y: 0 },
    { x: stickX, y: stickY }
  );

  if (distanceBetweenCenterAndStick <= wrapperRadius) {
    return (distanceBetweenCenterAndStick / wrapperRadius) * 100;
  } else {
    // this should not happen
    return 100;
  }
};

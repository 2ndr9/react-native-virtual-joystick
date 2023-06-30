import React, { useState } from 'react';
import { View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureTouchEvent,
} from 'react-native-gesture-handler';
import {
  calcDistance,
  calcMagnitudeInPercent,
  clampPositionToCircle,
  convertFromBottomLeftOfWrapperToFromCenterOfWrapper,
} from './utils';

interface JoystickEvent {
  type: 'move' | 'stop' | 'start';
  stickPosition: {
    x: number;
    y: number;
  };
  fingerPosition: {
    x: number;
    y: number;
  };
  joystickMagnitude: number;
  timestamp: number;
}

interface Props {
  onTouchDown?: (e: JoystickEvent) => void;
  onMove?: (e: JoystickEvent) => void;
  onTouchUp?: (e: JoystickEvent) => void;
  wrapperRadius: number;
  nippleRadius: number;
  fingerCircleRadius: number;
  wrapperColor: string;
  nippleColor: string;
  borderWidth: number;
}

const JoyStick: React.FC<Props> = (props) => {
  const {
    onTouchDown,
    onMove,
    onTouchUp,
    wrapperColor,
    nippleColor,
    wrapperRadius,
    nippleRadius,
    fingerCircleRadius,
    borderWidth,
  } = props;

  // coordinates of joystick from center of wrapper
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const [fingerX, setFingerX] = useState(0);
  const [fingerY, setFingerY] = useState(0);

  const handleTouchMove = (e: GestureTouchEvent) => {
    const tmp_fingerX = convertFromBottomLeftOfWrapperToFromCenterOfWrapper(
      e.changedTouches[0]!.x,
      wrapperRadius
    );
    const tmp_fingerY = convertFromBottomLeftOfWrapperToFromCenterOfWrapper(
      e.changedTouches[0]!.y,
      wrapperRadius
    );

    const distanceBetweenCenterAndFinger = calcDistance(
      { x: 0, y: 0 },
      { x: tmp_fingerX, y: tmp_fingerY }
    );

    const xClamped = clampPositionToCircle(
      tmp_fingerX,
      distanceBetweenCenterAndFinger,
      wrapperRadius
    );
    const yClamped = clampPositionToCircle(
      tmp_fingerY,
      distanceBetweenCenterAndFinger,
      wrapperRadius
    );

    setX(xClamped);
    setY(yClamped);

    setFingerX(tmp_fingerX);
    setFingerY(tmp_fingerY);

    onMove &&
      onMove({
        // do not pass x state and y state directly because state does not updated immediately
        stickPosition: { x: xClamped, y: yClamped },
        fingerPosition: {
          x: fingerX,
          y: fingerY,
        },
        type: 'move',
        joystickMagnitude: calcMagnitudeInPercent(
          xClamped,
          yClamped,
          wrapperRadius
        ),
        timestamp: new Date().getTime(),
      });
  };

  const handleTouchUp = (e: GestureTouchEvent) => {
    setX(0);
    setY(0);

    setFingerX(0);
    setFingerY(0);

    const tmp_fingerX = convertFromBottomLeftOfWrapperToFromCenterOfWrapper(
      e.changedTouches[0]!.x,
      wrapperRadius
    );
    const tmp_fingerY = convertFromBottomLeftOfWrapperToFromCenterOfWrapper(
      e.changedTouches[0]!.y,
      wrapperRadius
    );

    onTouchUp &&
      onTouchUp({
        type: 'stop',
        stickPosition: { x: 0, y: 0 },
        fingerPosition: { x: tmp_fingerX, y: tmp_fingerY },
        joystickMagnitude: calcMagnitudeInPercent(0, 0, wrapperRadius),
        timestamp: new Date().getTime(),
      });
  };

  const handleTouchDown = (e: GestureTouchEvent) => {
    const tmp_fingerX = convertFromBottomLeftOfWrapperToFromCenterOfWrapper(
      e.changedTouches[0]!.x,
      wrapperRadius
    );
    const tmp_fingerY = convertFromBottomLeftOfWrapperToFromCenterOfWrapper(
      e.changedTouches[0]!.y,
      wrapperRadius
    );

    const distanceBetweenCenterAndFinger = calcDistance(
      { x: 0, y: 0 },
      { x: tmp_fingerX, y: tmp_fingerY }
    );

    const xClamped = clampPositionToCircle(
      tmp_fingerX,
      distanceBetweenCenterAndFinger,
      wrapperRadius
    );
    const yClamped = clampPositionToCircle(
      tmp_fingerY,
      distanceBetweenCenterAndFinger,
      wrapperRadius
    );

    setX(xClamped);
    setY(yClamped);

    setFingerX(tmp_fingerX);
    setFingerY(tmp_fingerY);

    onTouchDown &&
      onTouchDown({
        type: 'start',
        // do not pass x state and y state directly because state does not updated immediately
        stickPosition: { x: xClamped, y: yClamped },
        fingerPosition: { x: tmp_fingerX, y: tmp_fingerY },
        joystickMagnitude: calcMagnitudeInPercent(
          xClamped,
          yClamped,
          wrapperRadius
        ),
        timestamp: new Date().getTime(),
      });
  };

  const panGesture = Gesture.Pan()
    .onTouchesDown(handleTouchDown)
    .onTouchesUp(handleTouchUp)
    .onTouchesMove(handleTouchMove);

  return (
    <GestureDetector gesture={panGesture}>
      <View
        style={[
          {
            width: 2 * wrapperRadius,
            height: 2 * wrapperRadius,
            // 'borderRadius = width(=height) / 2' means circle
            borderRadius: wrapperRadius,

            borderStyle: 'solid',
            borderWidth: borderWidth,
            borderColor: wrapperColor,
          },
          {
            transform: [{ rotateX: '180deg' }],
          },
        ]}
      >
        <View
          pointerEvents="none"
          style={[
            {
              height: 2 * nippleRadius,
              width: 2 * nippleRadius,
              // 'borderRadius = width(=height) / 2' means circle
              borderRadius: nippleRadius,

              borderStyle: 'solid',
              borderWidth: borderWidth,
              borderColor: nippleColor,
            },
            {
              position: 'absolute',

              // this leads to top and left become x and y
              transform: [
                { translateX: -nippleRadius + wrapperRadius - borderWidth },
                { translateY: -nippleRadius + wrapperRadius - borderWidth },
              ],
              // x and y is coordinates of joystick
              top: y,
              left: x,
            },
          ]}
        />
        <View
          style={{
            height: 2 * fingerCircleRadius,
            width: 2 * fingerCircleRadius,
            borderRadius: fingerCircleRadius,
            borderWidth: 2,
            borderColor: 'red',

            position: 'absolute',
            top: fingerY,
            left: fingerX,
            transform: [
              { translateX: -fingerCircleRadius + wrapperRadius - borderWidth },
              { translateY: -fingerCircleRadius + wrapperRadius - borderWidth },
            ],
          }}
        />
      </View>
    </GestureDetector>
  );
};

export default JoyStick;

import React, { useState } from 'react';
import { View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureTouchEvent,
} from 'react-native-gesture-handler';
import {
  calcDistance,
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
  timestamp: number;
}

interface Props {
  onTouchDown?: (e: JoystickEvent) => void;
  onMove?: (e: JoystickEvent) => void;
  onTouchUp?: (e: JoystickEvent) => void;
  wrapperRadius: number;
  nippleRadius: number;
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
    borderWidth,
  } = props;

  // coordinates of joystick from center of wrapper
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const handleTouchMove = (e: GestureTouchEvent) => {
    const fingerX = convertFromBottomLeftOfWrapperToFromCenterOfWrapper(
      e.changedTouches[0]!.x,
      wrapperRadius
    );
    const fingerY = convertFromBottomLeftOfWrapperToFromCenterOfWrapper(
      e.changedTouches[0]!.y,
      wrapperRadius
    );

    const distance_between_center_and_finger = calcDistance(
      { x: 0, y: 0 },
      { x: fingerX, y: fingerY }
    );

    const xClamped = clampPositionToCircle(
      fingerX,
      distance_between_center_and_finger,
      wrapperRadius
    );
    const yClamped = clampPositionToCircle(
      fingerY,
      distance_between_center_and_finger,
      wrapperRadius
    );

    setX(xClamped);
    setY(yClamped);

    onMove &&
      onMove({
        // do not pass x state and y state directly because state does not updated immediately
        stickPosition: { x: xClamped, y: yClamped },
        fingerPosition: {
          x: fingerX,
          y: fingerY,
        },
        type: 'move',
        timestamp: new Date().getTime(),
      });
  };

  const handleTouchUp = (e: GestureTouchEvent) => {
    setX(0);
    setY(0);

    const fingerX = convertFromBottomLeftOfWrapperToFromCenterOfWrapper(
      e.changedTouches[0]!.x,
      wrapperRadius
    );
    const fingerY = convertFromBottomLeftOfWrapperToFromCenterOfWrapper(
      e.changedTouches[0]!.y,
      wrapperRadius
    );

    onTouchUp &&
      onTouchUp({
        type: 'stop',
        stickPosition: { x: 0, y: 0 },
        fingerPosition: { x: fingerX, y: fingerY },
        timestamp: new Date().getTime(),
      });
  };

  const handleTouchDown = (e: GestureTouchEvent) => {
    const fingerX = convertFromBottomLeftOfWrapperToFromCenterOfWrapper(
      e.changedTouches[0]!.x,
      wrapperRadius
    );
    const fingerY = convertFromBottomLeftOfWrapperToFromCenterOfWrapper(
      e.changedTouches[0]!.y,
      wrapperRadius
    );

    const distance_between_center_and_finger = calcDistance(
      { x: 0, y: 0 },
      { x: fingerX, y: fingerY }
    );

    const xClamped = clampPositionToCircle(
      fingerX,
      distance_between_center_and_finger,
      wrapperRadius
    );
    const yClamped = clampPositionToCircle(
      fingerY,
      distance_between_center_and_finger,
      wrapperRadius
    );

    setX(xClamped);
    setY(yClamped);

    onTouchDown &&
      onTouchDown({
        type: 'start',
        // do not pass x state and y state directly because state does not updated immediately
        stickPosition: { x: xClamped, y: yClamped },
        fingerPosition: { x: fingerX, y: fingerY },
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
      </View>
    </GestureDetector>
  );
};

export default JoyStick;

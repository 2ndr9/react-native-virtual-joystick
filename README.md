[![NPM](https://nodei.co/npm/react-native-virtual-joystick.png)](https://nodei.co/npm/react-native-virtual-joystick/)

# react-native-virtual-joystick

simple React Native virtual joystick

## Installation

```sh
npm install react-native-virtual-joystick
```

## Usage

```js
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { JoyStick } from 'react-native-virtual-joystick';

// ...
<GestureHandlerRootView
  style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
>
  <JoyStick
    wrapperColor="#808080"
    nippleColor="#D3D3D3"
    wrapperRadius={60}
    nippleRadius={20}
    borderWidth={5}
    onMove={(data) => {
      console.log(data);
    }}
    onTouchDown={(data) => {
      console.log(data);
    }}
    onTouchUp={(data) => {
      console.log(data);
    }}
  />
</GestureHandlerRootView>;
```

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)

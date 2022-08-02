import * as React from 'react';
import { View } from 'react-native';
import Svg, { SvgProps, G, Path } from 'react-native-svg';

interface Props extends SvgProps {
  underlayColor: string;
  pressed: boolean;
}

const IconGray = (props: Props) => {
  const { underlayColor = '#E6E6E6', pressed } = props;
  const originalWidth = 16.736;
  const originalHeight = 16.736;
  const aspectRatio = originalWidth / originalHeight;

  return (
    <View
      style={{
        aspectRatio,
      }}
    >
      <Svg width="100%" height="100%" viewBox={`0 0 ${originalWidth} ${originalHeight}`} {...props}>
        <G data-name="Grupo 293">
          <Path
            data-name="Trazado 307"
            d="M4.657 13.115a.343.343 0 0 1-.433-.433L8.364.91A.332.332 0 0 1 8.913.8l7.844 7.744a.322.322 0 0 1-.115.538Z"
            fill={pressed ? underlayColor : '#E6E6E6'}
          />
          <G data-name="Trazado 326" fill="none">
            <Path d="M8.724 9.771a2.5 2.5 0 1 1-1.44 3.23 2.5 2.5 0 0 1 1.44-3.23Z" />
            <Path
              d="M9.189 10.985a1.202 1.202 0 0 0-.691 1.55c.237.619.932.929 1.55.692.618-.237.928-.932.691-1.55a1.202 1.202 0 0 0-1.55-.692m-.465-1.214a2.5 2.5 0 1 1 1.79 4.67 2.5 2.5 0 0 1-1.79-4.67Z"
              fill={pressed ? underlayColor : '#E6E6E6'}
            />
          </G>
        </G>
      </Svg>
    </View>
  );
};

export default IconGray;

import * as React from 'react';
import { View } from 'react-native';
import Svg, { G, Path, SvgProps } from 'react-native-svg';

const IconWhiteSvg = (props: SvgProps) => {
    const originalWidth = 373.738;
    const originalHeight = 399.951;
    const aspectRatio = originalWidth / originalHeight;

    return (
        <View style={{ aspectRatio }}>
            <Svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${originalWidth} ${originalHeight}`}
                {...props}
            >
                <G data-name="Grupo 390" opacity={1}>
                    <Path
                        fill="#ffffff"
                        d="M129.1 399.951a64.449 64.449 0 0 1-60.173-41.388 66.94 66.94 0 0 1-1.5-4.368l-55.938 20.113a8.578 8.578 0 0 1-8.989-2.01 8.631 8.631 0 0 1-2-8.984L112.123 53.877a8.593 8.593 0 0 1 8.077-5.669 8.647 8.647 0 0 1 6.077 2.52L324.2 248.846a8.589 8.589 0 0 1-3.166 14.153l-132.509 47.654c.258.612.5 1.217.72 1.794a64.468 64.468 0 0 1-60.145 87.5Zm27.981-81.236-59.595 21.693a32.54 32.54 0 0 0 1.667 6.042 32.212 32.212 0 1 0 60.157-23.058 32.578 32.578 0 0 0-2.23-4.674Z"
                        data-name="Exclusi\xF3n 2"
                    />
                    <Path
                        fill="#fc702a"
                        d="m308.282 163.873-5.529-24a2 2 0 0 1 1.5-2.4l61.505-14.168a2 2 0 0 1 2.4 1.5l5.529 24a2 2 0 0 1-1.5 2.4l-61.506 14.168a2 2 0 0 1-2.4-1.5Zm-22.052-59.577-14.643-13.681c-1.726-1.613 2.282-5.589 3.9-7.322l35.848-41.52a4.3 4.3 0 0 1 6.07-.207l14.644 13.681a4.3 4.3 0 0 1 .206 6.071l-39.954 42.771a4.3 4.3 0 0 1-6.071.207Zm-45.24-33.67-24.174-4.713a2 2 0 0 1-1.581-2.346l12.08-61.949a2 2 0 0 1 2.346-1.581l24.173 4.714a2 2 0 0 1 1.581 2.346l-12.079 61.949a2 2 0 0 1-2.346 1.58Z"
                        data-name="Uni\xF3n 16"
                    />
                </G>
            </Svg>
        </View>
    );
};

export default IconWhiteSvg;

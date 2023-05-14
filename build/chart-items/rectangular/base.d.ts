import { SpringValue } from '@react-spring/web';
import React from 'react';
export interface RectangularProps {
    x: SpringValue<number>;
    y: SpringValue<number>;
    width: SpringValue<number>;
    height: SpringValue<number>;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClick?: () => void;
    className?: string;
    style?: React.CSSProperties;
}

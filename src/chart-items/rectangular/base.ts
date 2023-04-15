import { SpringValue } from '@react-spring/web';
import React from 'react';

export interface RectangularProps {
  // x position
  x: SpringValue<number>;

  // y position
  y: SpringValue<number>;

  // width
  width: SpringValue<number>;

  // height
  height: SpringValue<number>;

  // Interactions
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;

  // Styling
  className?: string;
  style?: React.CSSProperties;
}

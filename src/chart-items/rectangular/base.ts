import React from 'react';

export interface RectangularProps {
  // x position
  x: number;

  // y position
  y: number;

  // width
  width: number;

  // height
  height: number;

  // Interactions
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;

  // Styling
  className?: string;
  style?: React.CSSProperties;
}

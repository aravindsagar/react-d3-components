import React from 'react';
import { RectangularProps } from './base';

export interface SimpleRectangleProps extends RectangularProps {
  fill?: string;
  stroke?: string;
}

export function SimpleRectangle({ x, y, w, h, fill, stroke }: SimpleRectangleProps): JSX.Element {
  return <rect x={x} y={y} height={h} width={w} fill={fill} stroke={stroke} />;
}

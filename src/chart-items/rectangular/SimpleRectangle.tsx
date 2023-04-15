import { animated } from '@react-spring/web';
import React from 'react';
import { RectangularProps } from './base';

export interface SimpleRectangleProps extends RectangularProps {
  fill?: string;
  stroke?: string;
}

function _SimpleRectangle(props: SimpleRectangleProps): JSX.Element {
  return <animated.rect {...props} />;
}

export const SimpleRectangle = React.memo(_SimpleRectangle);

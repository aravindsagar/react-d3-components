import React from 'react';
import { RectangularProps } from './base';
export interface SimpleRectangleProps extends RectangularProps {
    fill?: string;
    stroke?: string;
}
declare function _SimpleRectangle(props: SimpleRectangleProps): JSX.Element;
export declare const SimpleRectangle: React.MemoExoticComponent<typeof _SimpleRectangle>;
export {};

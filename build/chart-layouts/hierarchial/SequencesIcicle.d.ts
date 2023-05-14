import { HierarchyRectangularNode } from 'd3-hierarchy';
import React from 'react';
import { RectangularProps } from '../../chart-items/rectangular/base';
type ChildType<D> = (props: {
    rect: RectangularProps;
    item: HierarchyRectangularNode<D>;
}) => JSX.Element;
export interface SequencesIcicleProps<Datum> {
    data: Datum;
    childrenAccessor?: (d: Datum) => Iterable<Datum>;
    valueAccessor: (d: Datum) => number;
    idAccessor?: (d: Datum) => string | number;
    padding?: number;
    style?: React.CSSProperties;
    className?: string;
    children?: ChildType<Datum>;
    onHover?: (item: HierarchyRectangularNode<Datum> | null) => void;
    hoveredItem?: HierarchyRectangularNode<Datum> | null;
    onSelect?: (item: HierarchyRectangularNode<Datum> | null) => void;
    selectedItem?: HierarchyRectangularNode<Datum> | null;
}
export declare function SequencesIcicle<Datum>({ data, childrenAccessor, valueAccessor, idAccessor, padding, style, className, children, ...rest }: SequencesIcicleProps<Datum>): JSX.Element;
export {};

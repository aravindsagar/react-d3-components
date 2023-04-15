import { useSpring } from '@react-spring/web';
import { hierarchy, HierarchyRectangularNode, partition } from 'd3-hierarchy';
import React, { useCallback, useMemo } from 'react';
import { RectangularProps } from '../../chart-items/rectangular/base';
import { SimpleRectangle } from '../../chart-items/rectangular/SimpleRectangle';
import { useElementSize } from '../../util/useElementSize';
import styles from './commonStyles.module.scss';

type ChildType<D> = (props: { rect: RectangularProps; item: HierarchyRectangularNode<D> }) => JSX.Element;

export interface SequencesIcicleProps<Datum> {
  // Data and how to access values from the data object
  data: Datum;
  childrenAccessor?: (d: Datum) => Iterable<Datum>;
  valueAccessor: (d: Datum) => number;
  idAccessor?: (d: Datum) => string | number;

  // Built in styling options
  padding?: number;
  style?: React.CSSProperties;
  className?: string;

  // Children rendering
  children?: ChildType<Datum>;

  // Controlled props for interaction
  onHover?: (item: HierarchyRectangularNode<Datum> | null) => void;
  hoveredItem?: HierarchyRectangularNode<Datum> | null;
  onSelect?: (item: HierarchyRectangularNode<Datum> | null) => void;
  selectedItem?: HierarchyRectangularNode<Datum> | null;
}

export function SequencesIcicle<Datum>({
  data,
  childrenAccessor,
  valueAccessor,
  idAccessor,
  padding = 2,
  style,
  className,
  children = (p) => <SimpleRectangle {...p.rect} fill="grey" stroke="black" />,
  ...rest
}: SequencesIcicleProps<Datum>): JSX.Element {
  const { width, height, ref } = useElementSize();
  const partitioned = useMemo<HierarchyRectangularNode<Datum>[]>(() => {
    const hierarchialData = hierarchy(data, childrenAccessor)
      .sum(valueAccessor)
      .sort((a, b) => b.value - a.value);
    const partitionedTree = partition<Datum>().padding(padding).size([width, height])(hierarchialData);
    return partitionedTree.descendants().filter(
      // For efficiency, filter out nodes that would be too small to see
      (d) => d.x1 - d.x0 >= 0.1
    );
  }, [childrenAccessor, data, height, padding, valueAccessor, width]);

  return (
    <div ref={ref} style={style} className={className}>
      <svg height={height} width={width} viewBox={`0 0 ${width} ${height}`}>
        {partitioned.map((d, idx) => (
          <ChildRenderer key={idAccessor ? idAccessor(d.data) : idx} item={d} idAccessor={idAccessor} {...rest}>
            {children}
          </ChildRenderer>
        ))}
      </svg>
    </div>
  );
}

function ChildRenderer<Datum>(
  props: { children: ChildType<Datum>; item: HierarchyRectangularNode<Datum> } & Pick<
    SequencesIcicleProps<Datum>,
    'onHover' | 'hoveredItem' | 'onSelect' | 'selectedItem' | 'idAccessor'
  >
) {
  const { children, item, onHover, selectedItem, onSelect, idAccessor } = props;
  const isEqual = useCallback(
    (a?: HierarchyRectangularNode<Datum>, b?: HierarchyRectangularNode<Datum>) =>
      idAccessor && a && b ? idAccessor(a.data) === idAccessor(b.data) : a?.data === b?.data,
    [idAccessor]
  );

  const onMouseEnter = useCallback(() => onHover && onHover(item), [item, onHover]);
  const onMouseLeave = useCallback(() => onHover && onHover(null), [onHover]);

  const onClick = useCallback(() => {
    if (!onSelect) return;
    if (isEqual(item, selectedItem)) onSelect(null);
    else onSelect(item);
  }, [isEqual, item, onSelect, selectedItem]);

  const spring = useSpring({
    to: { x: item.x0, y: item.y0, height: item.y1 - item.y0, width: item.x1 - item.x0 },
    // config: { duration: 1000 },
  });
  const rect: RectangularProps = {
    x: spring.x,
    y: spring.y,
    height: spring.height,
    width: spring.width,
    onMouseEnter,
    onMouseLeave,
    onClick,
    className: onSelect ? styles.clickable : undefined,
  };

  return children({ rect, item });
}

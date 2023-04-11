import { hierarchy, HierarchyRectangularNode, partition } from 'd3-hierarchy';
import React, { useMemo } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { RectangularProps } from '../../chart-items/rectangular/base';
import { SimpleRectangle, SimpleRectangleProps } from '../../chart-items/rectangular/SimpleRectangle';

export interface SequencesIcicleProps<Datum, ItemProps extends RectangularProps = SimpleRectangleProps> {
  data: Datum;
  childrenAccessor?: (d: Datum) => Iterable<Datum>;
  valueAccessor: (d: Datum) => number;
  padding?: number;
  style?: React.CSSProperties;
  className?: string;
  itemComponent?: React.ComponentType<ItemProps>;
  extraItemProps?: (d: HierarchyRectangularNode<Datum>) => Partial<ItemProps>;
}

export function SequencesIcicle<Datum, ItemProps extends RectangularProps = SimpleRectangleProps>({
  data,
  childrenAccessor,
  valueAccessor,
  padding = 1,
  style,
  className,
  itemComponent,
  extraItemProps,
}: SequencesIcicleProps<Datum, ItemProps>): JSX.Element {
  const { width, height, ref } = useResizeDetector();

  let RectComponent: React.ComponentType<ItemProps>;
  if (itemComponent) {
    RectComponent = itemComponent;
    if (!extraItemProps) {
      extraItemProps = () => ({} as ItemProps);
    }
  } else {
    RectComponent = SimpleRectangle;
    if (!extraItemProps) {
      extraItemProps = () => ({ fill: 'grey', stroke: 'black' } as unknown as ItemProps);
    }
  }

  const hierarchialData = useMemo(
    () =>
      hierarchy(data, childrenAccessor)
        .sum(valueAccessor)
        .sort((a, b) => b.value - a.value),
    [childrenAccessor, data, valueAccessor]
  );
  const partitioned = useMemo(
    () => partition<Datum>().padding(padding).size([width, height])(hierarchialData),
    [height, padding, width, hierarchialData]
  );

  return (
    <div ref={ref} style={style} className={className}>
      <svg height={height} width={width} viewBox={`0 0 ${width} ${height}`}>
        {partitioned
          .descendants()
          .filter(
            // For efficiency, filter out nodes that would be too small to see
            (d) => d.x1 - d.x0 >= 0.1
          )
          .map((d, idx) => {
            const itemProps = { x: d.x0, y: d.y0, h: d.y1 - d.y0, w: d.x1 - d.x0, ...extraItemProps(d) } as ItemProps;
            return <RectComponent key={idx} {...itemProps} />;
          })}
      </svg>
    </div>
  );
}

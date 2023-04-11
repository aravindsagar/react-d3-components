import { schemeAccent } from 'd3';
import React from 'react';
import { SimpleRectangleProps } from '../../chart-items/rectangular/SimpleRectangle';
import { SequencesIcicle } from './SequencesIcicle';

export default {
  title: 'SequencesIcicle',
};

const availablePages = ['root', 'home', 'product', 'cart', 'checkout', 'about', 'contact'] as const;
const colors = availablePages.reduce((acc, cur, idx) => {
  acc[cur] = schemeAccent[idx];
  return acc;
}, {} as Record<(typeof availablePages)[number], string>);

interface SampleDataNode {
  page: (typeof availablePages)[number] | 'root';
  children?: SampleDataNode[];
  value?: number;
}

const sampleData = (function () {
  const root: SampleDataNode = {
    page: 'root',
    children: [
      { page: 'home', value: 1000, children: [{ page: 'product', value: 10000, children: [{ page: 'checkout', value: 500 }] }] },
      {
        page: 'product',
        value: 15000,
        children: [
          { page: 'about', value: 1000 },
          { page: 'home', value: 2000, children: [{ page: 'contact', value: 103 }] },
          { page: 'checkout', value: 100 },
        ],
      },
    ],
  };

  // function fillChildren(node: SampleDataNode, totalValue: number) {

  // }
  return root;
})();

const value = (d: SampleDataNode) => d.value || 0;

export const WithDefaultItem = () => (
  <SequencesIcicle<SampleDataNode, SimpleRectangleProps>
    data={sampleData}
    valueAccessor={value}
    style={{ height: 400, width: '100%' }}
    extraItemProps={(d) => ({ fill: colors[d.data.page] })}
  />
);

type CustomRectProps = SimpleRectangleProps & { rx: number };
const CustomRect = ({ x, y, w, h, fill, stroke, rx }: CustomRectProps) => {
  return <rect x={x} y={y} height={h} width={w} fill={fill} stroke={stroke} rx={rx} />;
};

export const WithCustomItem = () => (
  <SequencesIcicle<SampleDataNode, CustomRectProps>
    data={sampleData}
    valueAccessor={value}
    style={{ height: 400, width: '100%' }}
    padding={5}
    itemComponent={CustomRect}
    extraItemProps={(d) => ({ fill: colors[d.data.page], stroke: 'grey', rx: (d.depth + 1) * 4 })}
  />
);

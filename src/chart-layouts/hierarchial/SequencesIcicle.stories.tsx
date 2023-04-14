import { color as d3Color, HierarchyRectangularNode, schemeAccent } from 'd3';
import React, { useState } from 'react';
import { SimpleRectangle, SimpleRectangleProps } from '../../chart-items/rectangular/SimpleRectangle';
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

function getDarkerColor(c: string) {
  return d3Color(c)?.darker().toString();
}

export const WithDefaultChildren = () => <SequencesIcicle data={sampleData} valueAccessor={value} style={{ height: 400, width: '100%' }} />;

export const WithDefaultCustomizedChildren = () => {
  const [hoveredItem, setHoveredItem] = useState<HierarchyRectangularNode<SampleDataNode> | null>(null);
  return (
    <SequencesIcicle
      data={sampleData}
      valueAccessor={value}
      style={{ height: 400, width: '100%' }}
      hoveredItem={hoveredItem}
      onHover={setHoveredItem}
    >
      {({ rect, item }) => (
        <SimpleRectangle
          {...rect}
          fill={item.data === hoveredItem?.data ? getDarkerColor(colors[item.data.page]) : colors[item.data.page]}
        />
      )}
    </SequencesIcicle>
  );
};

type CustomRectProps = SimpleRectangleProps & { rx: number };
const CustomRect = (props: CustomRectProps) => {
  return <rect {...props} />;
};

export const WithCustomItem = () => {
  const [selected, setSelected] = useState<HierarchyRectangularNode<SampleDataNode> | null>(null);
  return (
    <SequencesIcicle
      data={sampleData}
      valueAccessor={value}
      style={{ height: 400, width: '100%' }}
      padding={5}
      onSelect={setSelected}
      selectedItem={selected}
    >
      {({ rect, item }) => (
        <CustomRect
          {...rect}
          fill={item.data === selected?.data ? getDarkerColor(colors[item.data.page]) : colors[item.data.page]}
          stroke="grey"
          rx={(item.depth + 1) * 4}
        />
      )}
    </SequencesIcicle>
  );
};

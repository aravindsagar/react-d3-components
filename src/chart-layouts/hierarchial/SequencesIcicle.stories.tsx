import { animated } from '@react-spring/web';
import { useArgs } from '@storybook/client-api';
import type { Meta, StoryObj } from '@storybook/react';
import { color as d3Color, schemeAccent } from 'd3';
import React from 'react';
import { SimpleRectangle, SimpleRectangleProps } from '../../chart-items/rectangular/SimpleRectangle';
import { SequencesIcicle } from './SequencesIcicle';

interface SampleDataNode {
  page: (typeof availablePages)[number] | 'root';
  children?: SampleDataNode[];
  value?: number;
  id: number;
}

const meta: Meta<typeof SequencesIcicle<SampleDataNode>> = {
  title: 'SequencesIcicle',
  component: SequencesIcicle,
  args: { valueAccessor: (d: SampleDataNode) => d.value || 0, style: { height: 400, width: '100%' }, idAccessor: (d) => d.id },
};

export default meta;
type Story = StoryObj<typeof SequencesIcicle<SampleDataNode>>;

const availablePages = ['root', 'home', 'product', 'cart', 'checkout', 'about', 'contact'] as const;
const colors = availablePages.reduce((acc, cur, idx) => {
  acc[cur] = schemeAccent[idx];
  return acc;
}, {} as Record<(typeof availablePages)[number], string>);

let idCtr = 0;
const sampleData = (function () {
  const root: SampleDataNode = {
    page: 'root',
    id: (idCtr += 1),
    children: [
      {
        page: 'home',
        id: (idCtr += 1),
        value: 1000,
        children: [{ page: 'product', id: (idCtr += 1), value: 10000, children: [{ page: 'checkout', id: (idCtr += 1), value: 500 }] }],
      },
      {
        page: 'product',
        value: 15000,
        id: (idCtr += 1),
        children: [
          { page: 'about', value: 1000, id: (idCtr += 1) },
          { page: 'home', value: 2000, id: (idCtr += 1), children: [{ page: 'contact', value: 103, id: (idCtr += 1) }] },
          { page: 'checkout', value: 100, id: (idCtr += 1) },
        ],
      },
    ],
  };

  // function fillChildren(node: SampleDataNode, totalValue: number) {

  // }
  return root;
})();

const updatedData = (function () {
  const newChildren = [...sampleData.children!];
  newChildren[0] = { ...newChildren[0], value: (newChildren[0].value ?? 0) + 1100 };
  newChildren[1] = { ...newChildren[1], value: (newChildren[1].value ?? 0) - 2250 };
  const newData: SampleDataNode = { ...sampleData, children: newChildren };
  return newData;
})();

function getLighterColor(c: string) {
  return d3Color(c)?.brighter().toString();
}

function getDarkerColor(c: string) {
  return d3Color(c)?.darker().toString();
}

export const Default: Story = {
  args: { data: sampleData },
};

export const ControlChildRender: Story = {
  args: { data: sampleData },
  render: (props) => {
    const [args, updateArgs] = useArgs();
    return (
      <SequencesIcicle {...props} onHover={(item) => updateArgs({ hoveredItem: item ? { data: item.data } : null })}>
        {({ rect, item }) => (
          <SimpleRectangle
            {...rect}
            fill={item.data.id === args.hoveredItem?.data.id ? getLighterColor(colors[item.data.page]) : colors[item.data.page]}
            stroke="lightgrey"
          />
        )}
      </SequencesIcicle>
    );
  },
};

type CustomRectProps = SimpleRectangleProps & { rx: number };
const CustomRect = (props: CustomRectProps) => {
  return <animated.rect {...props} />;
};

export const WithCustomChild: Story = {
  args: { data: sampleData },
  render: (props) => {
    const [args, updateArgs] = useArgs();
    const changeData = () => updateArgs({ data: args.data === sampleData ? updatedData : sampleData });
    props.onHover = (item) => updateArgs({ hoveredItem: item ? { data: item.data } : null });
    props.onSelect = (item) => updateArgs({ hoveredItem: null, selectedItem: item ? { data: item.data } : null });

    return (
      <div>
        <SequencesIcicle {...props}>
          {({ rect, item }) => {
            let fill: string = colors[item.data.page];
            if (item.data.id === props.hoveredItem?.data.id) {
              fill = getLighterColor(fill)!;
            } else if (item.data.id === props.selectedItem?.data.id) {
              fill = getDarkerColor(fill)!;
            }
            return <CustomRect {...rect} fill={fill} stroke="grey" rx={(item.depth + 1) * 4} />;
          }}
        </SequencesIcicle>
        <button style={{ marginTop: 12 }} onClick={changeData}>
          Change data
        </button>
      </div>
    );
  },
};

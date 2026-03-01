import React from 'react';
import { DragSortBoard, DragToken, DropZone } from '../dragSort/DragSortBoard';

type SortShapesGameProps = {
  onDone: () => void;
};

const tokens: DragToken[] = [
  {
    id: 'circle-token',
    label: 'Circle',
    color: '#A7C7E7',
    shape: 'circle',
    targetZoneId: 'circle',
  },
  {
    id: 'square-token',
    label: 'Square',
    color: '#D7C8F0',
    shape: 'square',
    targetZoneId: 'square',
  },
  {
    id: 'triangle-token',
    label: 'Triangle',
    color: '#F7E2AA',
    shape: 'triangle',
    targetZoneId: 'triangle',
  },
  {
    id: 'circle-token-two',
    label: 'Circle',
    color: '#BDE7D0',
    shape: 'circle',
    targetZoneId: 'circle',
  },
];

const zones: DropZone[] = [
  { id: 'circle', title: 'Circle', color: '#A7C7E7' },
  { id: 'square', title: 'Square', color: '#D7C8F0' },
  { id: 'triangle', title: 'Triangle', color: '#F7E2AA' },
];

export function SortShapesGame({ onDone }: SortShapesGameProps) {
  return (
    <DragSortBoard
      completionActionLabel="Back to activities"
      completionTitle="Great sorting!"
      instruction="Drag each shape into the matching category."
      onCompletePress={onDone}
      title="Sort the Shapes"
      tokens={tokens}
      zones={zones}
    />
  );
}

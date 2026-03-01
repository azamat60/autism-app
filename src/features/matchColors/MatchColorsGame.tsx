import React from 'react';
import { DragSortBoard, DragToken, DropZone } from '../dragSort/DragSortBoard';

type MatchColorsGameProps = {
  onDone: () => void;
};

const tokens: DragToken[] = [
  {
    id: 'blue-circle',
    label: 'Blue circle',
    color: '#A7C7E7',
    shape: 'circle',
    targetZoneId: 'blue',
  },
  {
    id: 'peach-circle',
    label: 'Peach circle',
    color: '#F6C7B6',
    shape: 'circle',
    targetZoneId: 'peach',
  },
  {
    id: 'mint-circle',
    label: 'Mint circle',
    color: '#BDE7D0',
    shape: 'circle',
    targetZoneId: 'mint',
  },
];

const zones: DropZone[] = [
  { id: 'blue', title: 'Blue', color: '#A7C7E7' },
  { id: 'peach', title: 'Peach', color: '#F6C7B6' },
  { id: 'mint', title: 'Mint', color: '#BDE7D0' },
];

export function MatchColorsGame({ onDone }: MatchColorsGameProps) {
  return (
    <DragSortBoard
      completionActionLabel="Back to activities"
      completionTitle="Great job!"
      instruction="Drag each color to its matching zone."
      onCompletePress={onDone}
      title="Match the Colors"
      tokens={tokens}
      zones={zones}
    />
  );
}

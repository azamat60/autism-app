import { ImageSourcePropType } from 'react-native';

export type ColorKey = 'red' | 'blue' | 'yellow';

export type BasketAsset = {
  id: string;
  colorKey: ColorKey;
  source: ImageSourcePropType;
};

export type ItemAsset = {
  id: string;
  colorKey: ColorKey;
  source: ImageSourcePropType;
  slotIndex: number;
};

export type BasketBounds = {
  id: string;
  colorKey: ColorKey;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type DropResult = {
  matched: boolean;
  basketId?: string;
  snapCenterX?: number;
  snapCenterY?: number;
};

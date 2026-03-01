import { ImageSourcePropType } from 'react-native';
import { BasketAsset, ColorKey, ItemAsset } from './types';

type RawAsset = {
  id: string;
  fileName: string;
  source: ImageSourcePropType;
};

// Editable fallback list. If auto-detection misses files, add them here.
const rawAssets: RawAsset[] = [
  {
    id: 'apple_red',
    fileName: 'apple_red.png',
    source: require('../../../assets/images/apple_red.png'),
  },
  {
    id: 'ball_red',
    fileName: 'ball_red.png',
    source: require('../../../assets/images/ball_red.png'),
  },
  {
    id: 'basket_blue',
    fileName: 'basket_blue.png',
    source: require('../../../assets/images/basket_blue.png'),
  },
  {
    id: 'basket_red',
    fileName: 'basket_red.png',
    source: require('../../../assets/images/basket_red.png'),
  },
  {
    id: 'basket_yellow',
    fileName: 'basket_yellow.png',
    source: require('../../../assets/images/basket_yellow.png'),
  },
  {
    id: 'bus_yellow',
    fileName: 'bus_yellow.png',
    source: require('../../../assets/images/bus_yellow.png'),
  },
  {
    id: 'car_red',
    fileName: 'car_red.png',
    source: require('../../../assets/images/car_red.png'),
  },
  {
    id: 'duck_yellow',
    fileName: 'duck_yellow.png',
    source: require('../../../assets/images/duck_yellow.png'),
  },
  {
    id: 'helicopter_blue',
    fileName: 'helicopter_blue.png',
    source: require('../../../assets/images/helicopter_blue.png'),
  },
  {
    id: 'lemon_yellow',
    fileName: 'lemon_yellow.png',
    source: require('../../../assets/images/lemon_yellow.png'),
  },
  {
    id: 'moon_blue',
    fileName: 'moon_blue.png',
    source: require('../../../assets/images/moon_blue.png'),
  },
  {
    id: 'umbrella_blue',
    fileName: 'umbrella_blue.png',
    source: require('../../../assets/images/umbrella_blue.png'),
  },
];

const inferColorKey = (fileName: string): ColorKey | null => {
  const lower = fileName.toLowerCase();

  if (lower.includes('red')) {
    return 'red';
  }

  if (lower.includes('blue')) {
    return 'blue';
  }

  if (lower.includes('yellow')) {
    return 'yellow';
  }

  return null;
};

const inferRole = (fileName: string): 'basket' | 'item' => {
  return fileName.toLowerCase().includes('basket') ? 'basket' : 'item';
};

const skipped = rawAssets.filter(asset => !inferColorKey(asset.fileName));
if (__DEV__ && skipped.length > 0) {
  console.warn(
    `[ColorDrop] Skipping assets with unknown color token: ${skipped
      .map(asset => asset.fileName)
      .join(', ')}`,
  );
}

const basketsByColor = new Map<ColorKey, BasketAsset>();
const itemsByColor = new Map<ColorKey, ItemAsset[]>();

rawAssets.forEach(asset => {
  const colorKey = inferColorKey(asset.fileName);
  if (!colorKey) {
    return;
  }

  const role = inferRole(asset.fileName);

  if (role === 'basket' && !basketsByColor.has(colorKey)) {
    basketsByColor.set(colorKey, {
      id: asset.id,
      colorKey,
      source: asset.source,
    });
    return;
  }

  if (role === 'item') {
    const list = itemsByColor.get(colorKey) || [];
    list.push({
      id: asset.id,
      colorKey,
      source: asset.source,
      slotIndex: list.length,
    });
    itemsByColor.set(colorKey, list);
  }
});

export const baskets: BasketAsset[] = (['red', 'blue', 'yellow'] as const)
  .map(colorKey => basketsByColor.get(colorKey))
  .filter((basket): basket is BasketAsset => Boolean(basket));

export const items: ItemAsset[] = (['red', 'blue', 'yellow'] as const).flatMap(
  colorKey => {
    const list = itemsByColor.get(colorKey) || [];
    return list.slice(0, 3);
  },
);

if (__DEV__) {
  if (baskets.length !== 3) {
    console.warn(
      `[ColorDrop] Expected 3 baskets, got ${baskets.length}. Check assets/images names or edit src/features/colorDrop/assets.ts`,
    );
  }

  if (items.length !== 9) {
    console.warn(
      `[ColorDrop] Expected 9 items, got ${items.length}. Check assets/images names or edit src/features/colorDrop/assets.ts`,
    );
  }
}

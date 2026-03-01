import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { theme } from '../../theme';

export function ColorsIcon() {
  return (
    <Svg height={52} viewBox="0 0 52 52" width={52}>
      <Circle cx={16} cy={18} fill={theme.colors.colorBlue} r={10} />
      <Circle cx={34} cy={17} fill={theme.colors.colorPeach} r={10} />
      <Circle cx={25} cy={34} fill={theme.colors.colorMint} r={10} />
    </Svg>
  );
}

export function ShapesIcon() {
  return (
    <Svg height={52} viewBox="0 0 52 52" width={52}>
      <Circle cx={13} cy={16} fill={theme.colors.colorBlue} r={8} />
      <Rect
        fill={theme.colors.colorLilac}
        height={16}
        rx={3}
        width={16}
        x={24}
        y={8}
      />
      <Path d="M26 44 L16 26 L36 26 Z" fill={theme.colors.colorSun} />
    </Svg>
  );
}

export function EmotionIcon() {
  return (
    <Svg height={52} viewBox="0 0 52 52" width={52}>
      <Circle cx={26} cy={26} fill={theme.colors.colorSun} r={20} />
      <Circle cx={20} cy={22} fill={theme.colors.textPrimary} r={2.5} />
      <Circle cx={32} cy={22} fill={theme.colors.textPrimary} r={2.5} />
      <Path
        d="M18 31 C22 36, 30 36, 34 31"
        fill="none"
        stroke={theme.colors.textPrimary}
        strokeWidth={2.5}
      />
    </Svg>
  );
}

export function TapIcon() {
  return (
    <Svg height={52} viewBox="0 0 52 52" width={52}>
      <Circle cx={26} cy={26} fill={theme.colors.colorMint} r={18} />
      <Path
        d="M26 17 L28.5 24 H35 L29.5 28 L31.5 35 L26 31 L20.5 35 L22.5 28 L17 24 H23.5 Z"
        fill={theme.colors.textPrimary}
      />
    </Svg>
  );
}

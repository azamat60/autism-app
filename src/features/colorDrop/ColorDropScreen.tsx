import React, { useCallback, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { baskets, items } from './assets';
import { Basket } from './components/Basket';
import { DraggableItem } from './components/DraggableItem';
import { BasketBounds, DropResult, ItemAsset } from './types';
import { RootStackParamList } from '../../navigation/types';

type ColorDropScreenProps = Partial<NativeStackScreenProps<RootStackParamList>>;

const slotOffsets = [
  { x: -28, y: 10 },
  { x: 0, y: -2 },
  { x: 28, y: 10 },
];

export function ColorDropScreen({ navigation }: ColorDropScreenProps) {
  const [basketBounds, setBasketBounds] = useState<
    Record<string, BasketBounds>
  >({});
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [resetSignal, setResetSignal] = useState(0);

  const basketList = useMemo(() => baskets.slice(0, 3), []);
  const itemList = useMemo(() => items.slice(0, 9), []);

  const basketById = useMemo(() => {
    return basketList.reduce<Record<string, BasketBounds>>((acc, basket) => {
      const bounds = basketBounds[basket.id];
      if (bounds) {
        acc[basket.id] = bounds;
      }
      return acc;
    }, {});
  }, [basketBounds, basketList]);

  const allPlaced =
    Object.keys(placements).length === itemList.length && itemList.length > 0;

  const handleBasketMeasured = useCallback((bounds: BasketBounds) => {
    setBasketBounds(prev => ({
      ...prev,
      [bounds.id]: bounds,
    }));
  }, []);

  const onDropResolve = useCallback(
    (item: ItemAsset, centerX: number, centerY: number): DropResult => {
      const hitBasket = Object.values(basketById).find(bounds => {
        return (
          centerX >= bounds.x &&
          centerX <= bounds.x + bounds.width &&
          centerY >= bounds.y &&
          centerY <= bounds.y + bounds.height
        );
      });

      if (!hitBasket || hitBasket.colorKey !== item.colorKey) {
        return { matched: false };
      }

      const offset = slotOffsets[item.slotIndex % slotOffsets.length];
      const snapCenterX = hitBasket.x + hitBasket.width / 2 + offset.x;
      const snapCenterY = hitBasket.y + hitBasket.height / 2 + offset.y;

      return {
        matched: true,
        basketId: hitBasket.id,
        snapCenterX,
        snapCenterY,
      };
    },
    [basketById],
  );

  const onPlaced = useCallback((itemId: string, basketId: string) => {
    setPlacements(prev => {
      if (prev[itemId]) {
        return prev;
      }
      return {
        ...prev,
        [itemId]: basketId,
      };
    });
  }, []);

  const onReset = useCallback(() => {
    setPlacements({});
    setResetSignal(value => value + 1);
  }, []);

  const onBack = useCallback(() => {
    if (navigation?.goBack) {
      navigation.goBack();
    }
  }, [navigation]);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Match the colors</Text>

      <View style={styles.basketSection}>
        <View style={styles.platform} />
        <View style={styles.basketsRow}>
          {basketList.map(basket => (
            <Basket
              basket={basket}
              key={basket.id}
              onMeasured={handleBasketMeasured}
            />
          ))}
        </View>
      </View>

      <View style={styles.itemsSection}>
        {itemList.map(item => (
          <DraggableItem
            baskets={Object.values(basketById)}
            item={item}
            key={item.id}
            onDropResolve={onDropResolve}
            onPlaced={onPlaced}
            resetSignal={resetSignal}
          />
        ))}
      </View>

      <Modal animationType="fade" visible={allPlaced} transparent>
        <View style={styles.overlay}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Great job!</Text>
            <Pressable
              accessibilityRole="button"
              onPress={onReset}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Play again</Text>
            </Pressable>
            {navigation?.goBack ? (
              <Pressable
                accessibilityRole="button"
                onPress={onBack}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryText}>Back</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6F4EF',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    color: '#5A5A53',
    marginBottom: 14,
    fontWeight: '600',
  },
  basketSection: {
    height: 210,
    justifyContent: 'center',
  },
  platform: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 38,
    height: 90,
    borderRadius: 46,
    backgroundColor: '#ECE7DE',
  },
  basketsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    zIndex: 2,
  },
  itemsSection: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(54, 54, 50, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 28,
    color: '#4C5A55',
    fontWeight: '700',
    marginBottom: 16,
  },
  button: {
    minHeight: 60,
    minWidth: 180,
    borderRadius: 16,
    backgroundColor: '#CBE3C2',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 20,
    color: '#355246',
    fontWeight: '700',
  },
  secondaryButton: {
    minHeight: 52,
    minWidth: 140,
    borderRadius: 14,
    backgroundColor: '#ECE7DE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    fontSize: 18,
    color: '#5A5A53',
    fontWeight: '600',
  },
});

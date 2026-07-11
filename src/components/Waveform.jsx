import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const SEGMENT_WIDTH = 300;
const HEIGHT = 80;

const WAVE_PATH =
  'M0,40 L50,40 L65,25 L80,55 L95,10 L110,65 L125,40 L180,40 L195,28 L210,52 L225,40 L300,40';
const FLAT_PATH = 'M0,40 L300,40';

export default function Waveform({ color = '#E11D2E', active = false, width = 260 }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const loopRef = useRef(null);

  useEffect(() => {
    if (active) {
      translateX.setValue(0);
      loopRef.current = Animated.loop(
        Animated.timing(translateX, {
          toValue: -SEGMENT_WIDTH,
          duration: 1200,
          useNativeDriver: true,
        }),
      );
      loopRef.current.start();
    } else {
      loopRef.current?.stop();
      translateX.setValue(0);
    }
    return () => loopRef.current?.stop();
  }, [active]);

  const path = active ? WAVE_PATH : FLAT_PATH;

  return (
    <View style={[styles.clip, { width }]}>
      <Animated.View style={{ flexDirection: 'row', transform: [{ translateX }] }}>
        <Svg width={SEGMENT_WIDTH} height={HEIGHT}>
          <Path d={path} stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
        <Svg width={SEGMENT_WIDTH} height={HEIGHT}>
          <Path d={path} stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: { height: HEIGHT, overflow: 'hidden' },
});
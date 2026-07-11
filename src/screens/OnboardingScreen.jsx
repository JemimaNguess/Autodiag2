import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeContext';

const ONBOARDING_KEY = 'has_onboarded';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    icon: 'mic',
    title: 'Enregistrez votre moteur',
    text: "10 à 15 secondes suffisent, moteur au ralenti, pour capturer le son.",
  },
  {
    icon: 'analytics',
    title: "L'IA analyse le signal",
    text: 'Le modèle détecte les signatures sonores caractéristiques des pannes.',
  },
  {
    icon: 'checkmark-circle',
    title: 'Recevez votre diagnostic',
    text: 'Moteur sain, usure probable ou anomalie — avec une recommandation claire.',
  },
];

export default function OnboardingScreen({ navigation }) {
  const colors = useTheme();
  const [index, setIndex] = useState(0);
  const listRef = useRef(null);

  const finishOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch {
      // Si l'écriture échoue, l'onboarding sera simplement remontré la prochaine fois
    }
    navigation.replace('Main');
  };

  const onNext = () => {
    if (index < SLIDES.length - 1) {
      listRef.current.scrollToIndex({ index: index + 1 });
    } else {
      finishOnboarding();
    }
  };

  const onSkip = () => finishOnboarding();

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skip} onPress={onSkip}>
        <Text style={styles.skipText}>Passer</Text>
      </TouchableOpacity>

      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(i);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.iconCircle}>
              <Ionicons name={item.icon} size={48} color={colors.primary} />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={onNext} activeOpacity={0.85}>
        <Text style={styles.nextText}>
          {index === SLIDES.length - 1 ? 'Commencer' : 'Suivant'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    skip: { position: 'absolute', top: 56, right: 24, zIndex: 10 },
    skipText: { color: colors.textSecondary, fontSize: 14 },
    slide: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
    iconCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 32,
      borderWidth: 1,
      borderColor: colors.border,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 22,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 12,
    },
    text: { color: colors.textSecondary, fontSize: 15, textAlign: 'center', lineHeight: 22 },
    dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.surfaceLight,
      marginHorizontal: 4,
    },
    dotActive: { backgroundColor: colors.primary, width: 20 },
    nextButton: {
      backgroundColor: colors.primary,
      marginHorizontal: 32,
      marginBottom: 48,
      paddingVertical: 16,
      borderRadius: 28,
      alignItems: 'center',
    },
    nextText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  });
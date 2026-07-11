import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Platform } from 'react-native';
// import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { saveDiagnostic } from '../utils/historyStorage';

const STEPS = [
  'Lecture du fichier audio...',
  'Extraction des caractéristiques spectrales...',
  'Classification du signal moteur...',
];

const API_URL = 'https://autodiag-jip1.onrender.com';
const REQUEST_TIMEOUT_MS = 45000; // Render (plan gratuit) peut mettre jusqu'à ~45s à se réveiller

export default function AnalysisScreen({ route, navigation }) {
  const colors = useTheme();
  const { uri } = route.params;
  const [stepIndex, setStepIndex] = useState(0);
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    const stepTimer = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }, 1100);

    diagnose(uri);

    return () => clearInterval(stepTimer);
  }, []);

  const diagnose = async (fileUri) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const formData = new FormData();

      if (Platform.OS === 'web') {
        const response = await fetch(fileUri);
        const blob = await response.blob();
        formData.append('audio', blob, 'moteur.wav');
      } else {
        formData.append('audio', {
          uri: fileUri,
          name: 'moteur.wav',
          type: 'audio/wav',
        });
      }

      const res = await fetch(`${API_URL}/api/diagnose`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const bodyText = await res.text();
      console.log('STATUS:', res.status);
      console.log('BODY:', bodyText);

      if (!res.ok) throw new Error(`Erreur ${res.status}: ${bodyText}`);
      const result = JSON.parse(bodyText);

      const diagnosticData = {
        verdict: result.diagnostic,
        confidence: result.confiance,
        recommendation: result.recommandation?.message,
      };

      await saveDiagnostic(diagnosticData);

      navigation.replace('Result', diagnosticData);
    } catch (err) {
      clearTimeout(timeoutId);
      console.log('ERREUR DIAGNOSE:', err);

      if (err.name === 'AbortError') {
        // Le serveur (Render) met trop de temps à répondre — probablement en train de se réveiller
        navigation.replace('NetworkError', { reason: 'timeout', uri: fileUri });
      } else if (err.message === 'Network request failed') {
        // Pas de connexion internet ou serveur totalement injoignable
        navigation.replace('NetworkError', { reason: 'offline', uri: fileUri });
      } else {
        // Erreur applicative (fichier illisible, réponse invalide, etc.)
        navigation.replace('DiagnosisError');
      }
    }
  };

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.ring, { transform: [{ rotate }] }]} />
      <Text style={styles.stepText}>{STEPS[stepIndex]}</Text>
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 40,
    },
    ring: {
      width: 90,
      height: 90,
      borderRadius: 45,
      borderWidth: 4,
      borderColor: colors.surfaceLight,
      borderTopColor: colors.primary,
      marginBottom: 40,
    },
    stepText: { color: colors.textSecondary, fontSize: 15, textAlign: 'center' },
  });
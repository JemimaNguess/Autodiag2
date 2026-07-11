import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeContext';

const ONBOARDING_KEY = 'has_onboarded';
const MIN_SPLASH_DURATION = 2000; // ms, pour éviter un flash trop court

export default function SplashScreen({ navigation }) {
  const colors = useTheme();
  const scheme = useColorScheme(); // 'light' | 'dark' | null
  const styles = getStyles(colors);

  useEffect(() => {
    const start = Date.now();

    AsyncStorage.getItem(ONBOARDING_KEY)
      .then((value) => {
        const elapsed = Date.now() - start;
        const remaining = Math.max(MIN_SPLASH_DURATION - elapsed, 0);

        setTimeout(() => {
          if (value === 'true') {
            navigation.replace('Main');
          } else {
            navigation.replace('Onboarding');
          }
        }, remaining);
      })
      .catch(() => {
        // En cas d'erreur de lecture, on affiche l'onboarding par sécurité
        setTimeout(() => navigation.replace('Onboarding'), MIN_SPLASH_DURATION);
      });
  }, []);

  // Logo clair (fond blanc, icône noire) en mode light,
  // logo sombre (fond noir, icône blanche) en mode dark.
  const logoSource =
    scheme === 'light'
      ? require('../../assets/images/logo-light.png')
      : require('../../assets/images/logo-dark.png');

  return (
    <View style={styles.container}>
      <Image source={logoSource} style={styles.logo} resizeMode="contain" />
      <Text style={styles.appName}>AutoDiag Sonore</Text>
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
    },
    logo: {
      width: 120,
      height: 120,
      marginBottom: 24,
      borderRadius: 24,
    },
    appName: {
      color: colors.textPrimary,
      fontSize: 20,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
  });
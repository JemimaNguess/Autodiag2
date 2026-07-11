import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const APP_VERSION = '1.0.0';

export default function AboutScreen({ navigation }) {
  const colors = useTheme();
  const scheme = useColorScheme();
  const styles = getStyles(colors);

  const logoSource =
    scheme === 'light'
      ? require('../../assets/images/logo-light.png')
      : require('../../assets/images/logo-dark.png');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.logoWrapper}>
        <View style={styles.logoCircle}>
          <Ionicons name="pulse" size={40} color={colors.primary} />
        </View>
        <Text style={styles.appName}>AutoDiag Sonore</Text>
        <Text style={styles.version}>Version {APP_VERSION}</Text>
      </View>

      <Text style={styles.paragraph}>
        AutoDiag Sonore analyse le son de votre moteur pour détecter des signes
        d'usure ou d'anomalie, à partir d'un simple enregistrement audio.
      </Text>

      <Text style={styles.paragraph}>
        Le diagnostic est fourni à titre indicatif. Il ne remplace pas
        l'expertise d'un mécanicien professionnel — en cas de doute, faites
        toujours vérifier votre véhicule par un spécialiste.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fonctionnement</Text>
        <Text style={styles.paragraph}>
          Un modèle d'intelligence artificielle, entraîné sur des sons moteur
          réels, examine les caractéristiques du signal audio (fréquences,
          énergie, régularité) pour établir un diagnostic.
        </Text>
      </View>
    </ScrollView>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: 24, paddingTop: 60, paddingBottom: 48 },
    back: { marginBottom: 24 },
    logoWrapper: { alignItems: 'center', marginBottom: 32 },
    logoCircle: {
      width: 84,
      height: 84,
      borderRadius: 42,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
    },
    appName: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
    version: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
    paragraph: {
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 21,
      marginBottom: 16,
    },
    section: { marginTop: 8 },
    sectionTitle: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: '700',
      marginBottom: 10,
    },
  });
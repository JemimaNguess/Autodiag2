import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

export default function ResultScreen({ route, navigation }) {
  const colors = useTheme();
  const { verdict = 'sain', confidence = 0.8, recommendation } = route.params || {};

  const VERDICTS = {
    sain: {
      label: 'Moteur sain',
      icon: 'checkmark-circle',
      color: colors.success,
      message:
        recommendation ||
        "Aucune anomalie détectée. Continuez l'entretien préventif habituel.",
    },
    anomalie: {
      label: 'Anomalie détectée',
      icon: 'warning',
      color: colors.danger,
      message:
        recommendation ||
        'Le son du moteur présente des caractéristiques inhabituelles. Faites vérifier le véhicule avant votre prochain trajet.',
    },
  };

  const info = VERDICTS[verdict] || VERDICTS.sain;
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { borderColor: info.color }]}>
        <Ionicons name={info.icon} size={44} color={info.color} />
      </View>

      <View style={[styles.badge, { backgroundColor: info.color + '22', borderColor: info.color }]}>
        <Text style={[styles.badgeText, { color: info.color }]}>{info.label}</Text>
      </View>

      <Text style={styles.confidence}>Confiance : {Math.round(confidence * 100)}%</Text>

      <Text style={styles.message}>{info.message}</Text>

      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => navigation.navigate('Main', { screen: 'Recording' })}
        activeOpacity={0.85}
      >
        <Text style={styles.retryText}>Nouveau diagnostic</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.homeLink}
        onPress={() => navigation.navigate('Main', { screen: 'Home' })}
      >
        <Text style={styles.homeLinkText}>Retour à l'accueil</Text>
      </TouchableOpacity>
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
      paddingHorizontal: 32,
    },
    iconCircle: {
      width: 90,
      height: 90,
      borderRadius: 45,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    badge: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 24,
      borderWidth: 1,
      marginBottom: 16,
    },
    badgeText: { fontSize: 16, fontWeight: '700' },
    confidence: { color: colors.textSecondary, fontSize: 14, marginBottom: 32 },
    message: {
      color: colors.textPrimary,
      fontSize: 15,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 48,
    },
    retryButton: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      paddingHorizontal: 32,
      borderRadius: 28,
    },
    retryText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
    homeLink: { marginTop: 16 },
    homeLinkText: { color: colors.textSecondary, fontSize: 14 },
  });
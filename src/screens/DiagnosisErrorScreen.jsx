import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

export default function DiagnosisErrorScreen({ navigation }) {
  const colors = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="alert-circle-outline" size={44} color={colors.danger} />
      </View>

      <Text style={styles.title}>Analyse impossible</Text>
      <Text style={styles.text}>
        Une erreur est survenue pendant l'analyse de l'enregistrement.
        Réessayez avec un nouvel enregistrement, si le problème persiste
        contactez le support.
      </Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('Main', { screen: 'Recording' })}
        activeOpacity={0.85}
      >
        <Text style={styles.primaryText}>Réessayer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryLink}
        onPress={() => navigation.navigate('Main', { screen: 'Home' })}
      >
        <Text style={styles.secondaryText}>Retour à l'accueil</Text>
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
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 28,
      borderWidth: 1,
      borderColor: colors.border,
    },
    title: { color: colors.textPrimary, fontSize: 20, fontWeight: '700', marginBottom: 12 },
    text: {
      color: colors.textSecondary,
      fontSize: 15,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 40,
    },
    primaryButton: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      paddingHorizontal: 32,
      borderRadius: 28,
      marginBottom: 16,
    },
    primaryText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
    secondaryLink: { paddingVertical: 8 },
    secondaryText: { color: colors.textSecondary, fontSize: 14 },
  });
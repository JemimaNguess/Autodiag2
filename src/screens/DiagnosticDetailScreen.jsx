import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const VERDICT_INFO = {
  sain: { label: 'Moteur sain', icon: 'checkmark-circle' },
  anomalie: { label: 'Anomalie détectée', icon: 'warning' },
};

export default function DiagnosticDetailScreen({ route, navigation }) {
  const colors = useTheme();
  const styles = getStyles(colors);
  const { verdict = 'sain', confidence = 0.8, recommendation, date, time } = route.params || {};

  const info = VERDICT_INFO[verdict] || VERDICT_INFO.sain;
  const color = verdict === 'sain' ? colors.success : colors.danger;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
      </TouchableOpacity>

      <View style={[styles.iconCircle, { borderColor: color }]}>
        <Ionicons name={info.icon} size={44} color={color} />
      </View>

      <Text style={[styles.title, { color }]}>{info.label}</Text>
      <Text style={styles.date}>{date} • {time}</Text>
      <Text style={styles.confidence}>Confiance : {Math.round(confidence * 100)}%</Text>

      <Text style={styles.message}>
        {recommendation || "Aucune recommandation enregistrée pour ce diagnostic."}
      </Text>
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
    back: { position: 'absolute', top: 56, left: 24 },
    iconCircle: {
      width: 90,
      height: 90,
      borderRadius: 45,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    title: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
    date: { color: colors.textSecondary, fontSize: 13, marginBottom: 20 },
    confidence: { color: colors.textSecondary, fontSize: 14, marginBottom: 32 },
    message: { color: colors.textPrimary, fontSize: 15, textAlign: 'center', lineHeight: 22 },
  });
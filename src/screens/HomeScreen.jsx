import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { getLastDiagnostic } from '../utils/historyStorage';

export default function HomeScreen({ navigation }) {
  const colors = useTheme();
  const styles = getStyles(colors);
  const [lastDiagnostic, setLastDiagnostic] = useState(null);

  useFocusEffect(
    useCallback(() => {
      getLastDiagnostic().then(setLastDiagnostic);
    }, []),
  );

  const VERDICT_COLORS = {
    sain: colors.success,
    usure_probable: colors.warning,
    anomalie: colors.danger,
  };
  const VERDICT_LABELS = {
    sain: 'Moteur sain',
    usure_probable: 'Usure probable',
    anomalie: 'Anomalie détectée',
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Bonjour 👋</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-circle-outline" size={32} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.mainCard}
        onPress={() => navigation.navigate('Recording')}
        activeOpacity={0.85}
      >
        <View style={styles.mainCardIcon}>
          <Ionicons name="mic" size={32} color={colors.primary} />
        </View>
        <Text style={styles.mainCardTitle}>Nouveau diagnostic</Text>
        <Text style={styles.mainCardText}>Enregistrez le son de votre moteur</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Dernier diagnostic</Text>
      {lastDiagnostic ? (
        <TouchableOpacity
          style={styles.lastCard}
          onPress={() => navigation.navigate('DiagnosticDetail', lastDiagnostic)}
        >
          <View
            style={[styles.dot, { backgroundColor: VERDICT_COLORS[lastDiagnostic.verdict] }]}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.lastCardTitle}>
              {VERDICT_LABELS[lastDiagnostic.verdict]}
            </Text>
            <Text style={styles.lastCardDate}>{lastDiagnostic.date}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Aucun diagnostic pour l'instant.</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.historyLink}
        onPress={() => navigation.navigate('History')}
      >
        <Text style={styles.historyLinkText}>Voir tout l'historique</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.primary} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: 24, paddingTop: 60 },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 28,
    },
    greeting: { color: colors.textPrimary, fontSize: 22, fontWeight: '700' },
    mainCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 24,
      marginBottom: 32,
      borderWidth: 1,
      borderColor: colors.primaryDark,
    },
    mainCardIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    mainCardTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '700', marginBottom: 4 },
    mainCardText: { color: colors.textSecondary, fontSize: 14 },
    sectionTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '600', marginBottom: 12 },
    lastCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    dot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
    lastCardTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '600' },
    lastCardDate: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
    emptyCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    emptyText: { color: colors.textSecondary, fontSize: 14 },
    historyLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    historyLinkText: { color: colors.primary, fontSize: 14, fontWeight: '600', marginRight: 4 },
  });
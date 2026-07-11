import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeContext';

const APP_VERSION = '1.0.0';

export default function ProfileScreen({ navigation }) {
  const colors = useTheme();
  const styles = getStyles(colors);
  const [clearing, setClearing] = useState(false);

  const confirmClearHistory = () => {
    Alert.alert(
      "Effacer l'historique",
      'Tous les diagnostics enregistrés seront supprimés définitivement. Continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Effacer', style: 'destructive', onPress: clearHistory },
      ],
    );
  };

  const clearHistory = async () => {
    try {
      setClearing(true);
      await AsyncStorage.removeItem('autodiag_history');
      Alert.alert('Historique effacé', 'Tous les diagnostics ont été supprimés.');
    } catch {
      Alert.alert('Erreur', "Impossible d'effacer l'historique.");
    } finally {
      setClearing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profil</Text>

      <View style={styles.avatarCircle}>
        <Ionicons name="person" size={40} color={colors.primary} />
      </View>
      <Text style={styles.appName}>AutoDiag Sonore</Text>
      <Text style={styles.version}>Version {APP_VERSION}</Text>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.row}
          onPress={confirmClearHistory}
          disabled={clearing}
          activeOpacity={0.75}
        >
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
          <Text style={[styles.rowText, { color: colors.danger }]}>
            {clearing ? 'Suppression...' : "Effacer l'historique"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.row, styles.rowLast]}
          onPress={() => navigation.navigate('About')}
          activeOpacity={0.75}
        >
          <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.rowText}>À propos d'AutoDiag Sonore</Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.textSecondary}
            style={styles.chevron}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, padding: 24, paddingTop: 60 },
    header: { color: colors.textPrimary, fontSize: 22, fontWeight: '700', marginBottom: 32 },
    avatarCircle: {
      alignSelf: 'center',
      width: 84,
      height: 84,
      borderRadius: 42,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    appName: {
      color: colors.textPrimary,
      fontSize: 17,
      fontWeight: '700',
      textAlign: 'center',
    },
    version: {
      color: colors.textSecondary,
      fontSize: 13,
      textAlign: 'center',
      marginTop: 4,
      marginBottom: 32,
    },
    section: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    rowLast: { borderBottomWidth: 0 },
    rowText: { color: colors.textPrimary, fontSize: 15, marginLeft: 12, flex: 1 },
    chevron: { marginLeft: 8 },
  });
import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { getHistory } from '../utils/historyStorage';

const VERDICT_INFO = {
  sain: { label: 'Moteur sain', icon: 'checkmark-circle' },
  anomalie: { label: 'Anomalie détectée', icon: 'warning' },
};

export default function HistoryScreen({ navigation }) {
  const colors = useTheme();
  const styles = getStyles(colors);
  const [history, setHistory] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getHistory().then(setHistory);
    }, []),
  );

  const verdictColor = (v) => (v === 'sain' ? colors.success : colors.danger);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Historique</Text>

      {history.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="time-outline" size={40} color={colors.textSecondary} />
          <Text style={styles.emptyText}>Aucun diagnostic pour l'instant.</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => {
            const info = VERDICT_INFO[item.verdict] || VERDICT_INFO.sain;
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('DiagnosticDetail', item)}
                activeOpacity={0.8}
              >
                <Ionicons name={info.icon} size={26} color={verdictColor(item.verdict)} />
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={styles.cardTitle}>{info.label}</Text>
                  <Text style={styles.cardDate}>{item.date} • {item.time}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, padding: 24, paddingTop: 60 },
    header: { color: colors.textPrimary, fontSize: 22, fontWeight: '700', marginBottom: 24 },
    empty: { alignItems: 'center', justifyContent: 'center', marginTop: 80 },
    emptyText: { color: colors.textSecondary, fontSize: 14, marginTop: 12 },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '600' },
    cardDate: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  });
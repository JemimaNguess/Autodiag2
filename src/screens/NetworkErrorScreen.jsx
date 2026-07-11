import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const REASON_INFO = {
  offline: {
    icon: 'wifi-outline',
    title: 'Pas de connexion',
    message:
      "Impossible de joindre le serveur. Vérifiez que votre téléphone est bien connecté à Internet (Wi-Fi ou données mobiles), puis réessayez.",
  },
  timeout: {
    icon: 'time-outline',
    title: 'Le serveur met du temps à répondre',
    message:
      "Le service d'analyse démarre parfois plus lentement après une période d'inactivité. Réessayez dans quelques instants — ça devrait fonctionner au second essai.",
  },
  default: {
    icon: 'cloud-offline-outline',
    title: 'Connexion impossible',
    message:
      "Une erreur de connexion est survenue. Vérifiez votre réseau et réessayez.",
  },
};

export default function NetworkErrorScreen({ route, navigation }) {
  const colors = useTheme();
  const styles = getStyles(colors);
  const { reason = 'default', uri } = route.params || {};
  const info = REASON_INFO[reason] || REASON_INFO.default;

  const retry = () => {
    if (uri) {
      navigation.replace('Analysis', { uri });
    } else {
      navigation.navigate('Main', { screen: 'Recording' });
    }
  };

  const goHome = () => {
    navigation.navigate('Main', { screen: 'Home' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name={info.icon} size={44} color={colors.warning} />
      </View>

      <Text style={styles.title}>{info.title}</Text>
      <Text style={styles.message}>{info.message}</Text>

      <TouchableOpacity style={styles.retryButton} onPress={retry} activeOpacity={0.85}>
        <Ionicons name="refresh" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={styles.retryText}>Réessayer</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.homeLink} onPress={goHome}>
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
      paddingHorizontal: 36,
    },
    iconCircle: {
      width: 90,
      height: 90,
      borderRadius: 45,
      borderWidth: 2,
      borderColor: colors.warning,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 12,
    },
    message: {
      color: colors.textSecondary,
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 21,
      marginBottom: 32,
    },
    retryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingVertical: 14,
      paddingHorizontal: 32,
      borderRadius: 28,
      marginBottom: 20,
    },
    retryText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
    homeLink: { padding: 8 },
    homeLinkText: { color: colors.textSecondary, fontSize: 14 },
  });
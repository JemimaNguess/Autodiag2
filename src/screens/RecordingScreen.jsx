import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import {
  useAudioRecorder,
  useAudioRecorderState,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
} from 'expo-audio';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import Waveform from '../components/Waveform';

export default function RecordingScreen({ navigation }) {
  const colors = useTheme();
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { granted } = await AudioModule.requestRecordingPermissionsAsync();
      if (!granted) {
        navigation.replace('MicPermissionDenied');
        return;
      }
      await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
    })();
  }, []);

  useEffect(() => {
    if (recorderState.isRecording) {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [recorderState.isRecording]);

  const startRecording = async () => {
    setElapsed(0);
    await recorder.prepareToRecordAsync();
    recorder.record();
  };

  const stopRecording = async () => {
    await recorder.stop();
    if (!recorder.uri) {
      Alert.alert('Erreur', "L'enregistrement n'a pas pu être sauvegardé. Réessayez.");
      return;
    }
    navigation.navigate('Analysis', { uri: recorder.uri });
  };

  const isRecording = recorderState.isRecording;
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AutoDiag Sonore</Text>
      <Text style={styles.subtitle}>
        Placez le téléphone près du moteur au ralenti{'\n'}et enregistrez 10 à 15 secondes.
      </Text>

      <Waveform color={colors.primary} active={isRecording} width={280} />

      <TouchableOpacity
        style={[styles.micButton, isRecording && styles.micButtonActive]}
        onPress={isRecording ? stopRecording : startRecording}
        activeOpacity={0.85}
      >
        <Ionicons name={isRecording ? 'stop' : 'mic'} size={56} color="#FFFFFF" />
      </TouchableOpacity>

      <Text style={styles.timer}>
        {isRecording ? `${elapsed}s / 15s` : 'Appuyez pour démarrer'}
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
    title: { color: colors.textPrimary, fontSize: 26, fontWeight: '700', marginBottom: 12 },
    subtitle: {
      color: colors.textSecondary,
      fontSize: 15,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 32,
    },
    micButton: {
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.primary,
      shadowOpacity: 0.5,
      shadowRadius: 24,
      elevation: 8,
      marginTop: 32,
    },
    micButtonActive: { backgroundColor: colors.primaryDark },
    timer: { color: colors.textSecondary, fontSize: 14, marginTop: 32 },
  });
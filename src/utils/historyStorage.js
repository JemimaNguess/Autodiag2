import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'autodiag_history';

export async function saveDiagnostic(entry) {
  const history = await getHistory();
  const newEntry = {
    id: Date.now().toString(),
    date: new Date().toLocaleDateString('fr-FR'),
    time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    ...entry,
  };
  const updated = [newEntry, ...history];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newEntry;
}

export async function getHistory() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function getLastDiagnostic() {
  const history = await getHistory();
  return history.length > 0 ? history[0] : null;
}
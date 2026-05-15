import AsyncStorage from '@react-native-async-storage/async-storage';

export class AsyncStorageClient {
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return null;
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }

  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }

  async getAllKeys(prefix: string): Promise<string[]> {
    const keys = await AsyncStorage.getAllKeys();
    return keys.filter((k) => k.startsWith(prefix));
  }

  async multiGet<T>(keys: string[]): Promise<T[]> {
    if (keys.length === 0) return [];
    const pairs = await AsyncStorage.multiGet(keys);
    return pairs
      .map(([, value]) => (value ? (JSON.parse(value) as T) : null))
      .filter((v): v is T => v !== null);
  }

  async multiRemove(keys: string[]): Promise<void> {
    if (keys.length > 0) {
      await AsyncStorage.multiRemove(keys);
    }
  }
}

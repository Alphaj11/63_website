import { useEffect, useState } from 'react';
import { readJSON, writeJSON } from '../lib/storage';

/** État React synchronisé avec localStorage (protégé contre les erreurs d'accès). */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => readJSON(key, initial));
  useEffect(() => writeJSON(key, value), [key, value]);
  return [value, setValue] as const;
}

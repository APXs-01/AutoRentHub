// src/hooks/useLocalStorage.js

import { useState } from 'react';

// Define keys that should be treated as raw strings (not JSON)
const RAW_STRING_KEYS = ['autorenthub_token'];

export const useLocalStorage = (key, initialValue) => {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      
      if (item === null) {
        return initialValue;
      }
      
      // 🔑 FIX 1: If the key is a raw string key (like the JWT token), return the item as is.
      if (RAW_STRING_KEYS.includes(key)) {
        return item;
      }

      // For all other keys (like the user object), attempt JSON parsing.
      return JSON.parse(item);

    } catch (error) {
      // The original JSON.parse error happens here when retrieving the token
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      let itemToStore;

      // 🔑 FIX 2: If the key is a raw string key, save it as a raw string.
      if (RAW_STRING_KEYS.includes(key) && typeof valueToStore === 'string') {
        itemToStore = valueToStore;
      } else {
        // For all other values (like the user object), stringify them.
        itemToStore = JSON.stringify(valueToStore);
      }
      
      window.localStorage.setItem(key, itemToStore);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Remove item from localStorage (this remains correct)
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};
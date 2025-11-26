import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'sql_query_history';
const MAX_HISTORY_SIZE = 50;

export default function useQueryHistory() {
  const [history, setHistory] = useState([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      }
    } catch (err) {
      console.error('Failed to load query history:', err);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (err) {
      console.error('Failed to save query history:', err);
    }
  }, [history]);

  const addToHistory = useCallback((query, result) => {
    const entry = {
      id: Date.now(),
      query: query.trim(),
      timestamp: new Date().toISOString(),
      rowCount: result?.rowCount || 0,
      executionTime: result?.executionTime || 0,
      success: true
    };

    setHistory(prev => {
      // Remove duplicate queries
      const filtered = prev.filter(item => item.query !== entry.query);

      // Add new entry at the beginning
      const newHistory = [entry, ...filtered];

      // Limit history size
      return newHistory.slice(0, MAX_HISTORY_SIZE);
    });
  }, []);

  const removeFromHistory = useCallback((id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const toggleFavorite = useCallback((id) => {
    setHistory(prev => prev.map(item =>
      item.id === id ? { ...item, favorite: !item.favorite } : item
    ));
  }, []);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    toggleFavorite
  };
}

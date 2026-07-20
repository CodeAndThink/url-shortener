"use client";

import { useState, useEffect, useCallback } from "react";

export interface HistoryEntry {
  id?: number;
  shortUrl: string;
  originalUrl: string;
  createdAt: string; // ISO string
}

const DB_NAME = "url-shortener-db";
const DB_VERSION = 1;
const STORE_NAME = "history";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("createdAt", "createdAt", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getAllEntries(): Promise<HistoryEntry[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      // Return in reverse chronological order (newest first)
      const entries = (request.result as HistoryEntry[]).reverse();
      resolve(entries);
    };
    request.onerror = () => reject(request.error);
  });
}

async function addEntryToDB(entry: Omit<HistoryEntry, "id">): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.add(entry);

    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
}

async function deleteEntryFromDB(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function clearAllFromDB(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export function useHistoryDB() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load entries on mount
  useEffect(() => {
    getAllEntries()
      .then((data) => {
        setEntries(data);
        setIsLoaded(true);
      })
      .catch((err) => {
        console.error("Failed to load history:", err);
        setIsLoaded(true);
      });
  }, []);

  const addEntry = useCallback(async (entry: Omit<HistoryEntry, "id">) => {
    try {
      const id = await addEntryToDB(entry);
      const newEntry = { ...entry, id };
      setEntries((prev) => [newEntry, ...prev]);
      return id;
    } catch (err) {
      console.error("Failed to add entry:", err);
      throw err;
    }
  }, []);

  const deleteEntry = useCallback(async (id: number) => {
    try {
      await deleteEntryFromDB(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Failed to delete entry:", err);
      throw err;
    }
  }, []);

  const clearAll = useCallback(async () => {
    try {
      await clearAllFromDB();
      setEntries([]);
    } catch (err) {
      console.error("Failed to clear history:", err);
      throw err;
    }
  }, []);

  return {
    entries,
    isLoaded,
    addEntry,
    deleteEntry,
    clearAll,
    count: entries.length,
  };
}

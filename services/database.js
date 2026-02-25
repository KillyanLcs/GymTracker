import * as SQLite from "expo-sqlite";

// Ouvre la base de données (elle sera créée si elle n'existe pas)
const db = SQLite.openDatabaseSync("gym.db");

export const initDB = () => {
  try {
    db.execSync(`
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS exercices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT UNIQUE NOT NULL
      );
      CREATE TABLE IF NOT EXISTS seances (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        nom TEXT,
        notes TEXT
      );

      CREATE TABLE IF NOT EXISTS series (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_seance INTEGER,
        id_exercice INTEGER,
        num_series INTEGER,
        reps INTEGER,
        poids REAL,
        rpe INTEGER,
        FOREIGN KEY(id_seance) REFERENCES seances(id) ON DELETE CASCADE,
        FOREIGN KEY(id_exercice) REFERENCES exercices(id)
      );

      CREATE TABLE IF NOT EXISTS mesures (
        id_mesure INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        type TEXT,
        valeur REAL,
        unite TEXT
      );
    `);
    console.log("Base de données initialisée avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la BD:", error);
  }
};

export default db;

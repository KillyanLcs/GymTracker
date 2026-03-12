import { useEffect, useMemo, useState } from "react";
import { Alert, Vibration } from "react-native";
import db from "../services/database";
import { ExerciceItem, ExoResult, LogItem, SeanceResult } from "../types";

export const useSeanceManager = (seanceId: number) => {
  // --- LES ÉTATS (Variables) ---
  const [nom, setNom] = useState("Chargement...");
  const [date, setDate] = useState("Chargement...");
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [exercices, setExercices] = useState<ExerciceItem[]>([]);
  const [allExercices, setAllExercices] = useState<ExerciceItem[]>([]);
  const [serieEnEdition, setSerieEnEdition] = useState<LogItem | null>(null);

  // États des formulaires
  const [nomExercice, setNomExercice] = useState("");
  const [exoSelectionne, setExoSelectionne] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<ExerciceItem[]>([]);
  const [poids, setPoids] = useState("");
  const [reps, setReps] = useState("");

  // États du Chrono
  const [tempsRestant, setTempsRestant] = useState(0);
  const [chronoActif, setChronoActif] = useState(false);
  const [tempsChoisi, setTempsChoisi] = useState(90);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    loadInfoSeance();
    loadExercices();
    loadLogs();
    loadAllExercices();
  }, [seanceId]);

  //pour le chrono dans une séance
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (chronoActif && tempsRestant > 0) {
      interval = setInterval(() => {
        setTempsRestant((prev) => prev - 1);
      }, 1000);
    } else if (tempsRestant === 0 && chronoActif) {
      setChronoActif(false);
      Vibration.vibrate(4000);
    }
    return () => clearInterval(interval);
  }, [chronoActif, tempsRestant]);

  //pour affichage nom et date d'une séance
  const loadInfoSeance = () => {
    try {
      const seance = db.getFirstSync(
        "SELECT nom, date FROM seances WHERE id = ?",
        [seanceId],
      ) as SeanceResult | null;
      if (seance) {
        setNom(seance.nom);
        setDate(seance.date);
      }
    } catch (e) {
      console.error("Erreur Info Séance:", e);
    }
  };

  //pour load tout les exercices réalisé dans la séance selectionné (en haut)
  const loadExercices = () => {
    try {
      const result = db.getAllSync(
        `SELECT DISTINCT exercices.id, exercices.nom FROM exercices 
         JOIN series ON series.id_exercice = exercices.id WHERE series.id_seance = ? ORDER BY series.id DESC `,
        [seanceId],
      ) as ExerciceItem[];
      setExercices(result);
    } catch (e) {
      console.error("Erreur Exercices:", e);
    }
  };

  //pour l'affichage de tous les exercices
  const loadAllExercices = () => {
    try {
      const result = db.getAllSync(
        "SELECT * FROM exercices ORDER BY exercices.nom ASC",
      ) as ExerciceItem[];
      setAllExercices(result);
    } catch (e) {
      console.error("Erreur All Exercices:", e);
    }
  };

  //pour affichage log en bas d'une séance
  const loadLogs = () => {
    try {
      const result = db.getAllSync(
        `SELECT series.id, series.poids, series.reps, exercices.nom FROM series 
         JOIN exercices ON series.id_exercice = exercices.id 
         WHERE series.id_seance = ? ORDER BY series.id DESC`,
        [seanceId],
      ) as LogItem[];
      setLogs(result);
    } catch (e) {
      console.error("Erreur Logs:", e);
    }
  };

  //pour un meilleur affichage des logs
  const logsGrouper = useMemo(() => {
    const groupes: Record<
      string,
      { nom: string; series: LogItem[]; tonnage: number }
    > = {};
    logs.forEach((log) => {
      if (!groupes[log.nom]) {
        groupes[log.nom] = { nom: log.nom, series: [], tonnage: 0 };
      }
      groupes[log.nom].series.push(log);
      groupes[log.nom].tonnage += log.poids * log.reps;
    });
    return Object.values(groupes);
  }, [logs]);

  //Pour affichage de suggestion
  const gererSaisieExo = (text: string) => {
    setNomExercice(text);
    setExoSelectionne(null);
    if (text.length > 0) {
      const resultats = allExercices.filter((exo) =>
        exo.nom.toLowerCase().startsWith(text.toLowerCase()),
      );
      setSuggestions(resultats);
    } else {
      setSuggestions([]);
    }
  };

  // ajout de série
  const handleAddSerie = () => {
    if (!nomExercice.trim() || !poids || !reps) {
      Alert.alert(
        "Oups",
        "Veuillez remplir le nom, le poids et les répétitions.",
      );
      return;
    }
    try {
      let exerciceId: number;
      const nomPropre = nomExercice.trim();
      const exoExistant = db.getFirstSync(
        "SELECT id FROM exercices WHERE LOWER(nom) = LOWER(?)",
        [nomPropre],
      ) as ExoResult | null;

      if (exoExistant) {
        exerciceId = exoExistant.id;
      } else {
        const resultExo = db.runSync("INSERT INTO exercices (nom) VALUES (?)", [
          nomPropre,
        ]);
        exerciceId = resultExo.lastInsertRowId;
      }

      db.runSync(
        "INSERT INTO series (id_seance, id_exercice, poids, reps) VALUES (?, ?, ?, ?)",
        [seanceId, exerciceId, parseFloat(poids), parseInt(reps)],
      );

      setReps("");
      loadLogs();
      loadExercices();
      loadAllExercices();
      setTempsRestant(tempsChoisi);
      setChronoActif(true);
    } catch (e) {
      console.error("Erreur ajout:", e);
      Alert.alert("Erreur", "Impossible d'ajouter la série.");
    }
  };

  //supression d'une répétition
  const supprimerRep = (id: number) => {
    Alert.alert("Supprimer la série", "Êtes-vous sûr ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => {
          db.runSync("DELETE FROM series WHERE id = ?", [id]);
          loadLogs();
        },
      },
    ]);
  };

  const modifierSerie = (
    id: number,
    nouveauPoids: string,
    nouvellesReps: string,
  ) => {
    if (!nouveauPoids || !nouvellesReps) return;

    try {
      db.runSync("UPDATE series SET poids = ?, reps = ? WHERE id = ?", [
        parseFloat(nouveauPoids),
        parseInt(nouvellesReps),
        id,
      ]);
      setSerieEnEdition(null);
      loadLogs();
    } catch (e) {
      console.error("Erreur modification série :", e);
      Alert.alert("Erreur", "Impossible de modifier la série.");
    }
  };
  //suppression d'un exercices
  const supprimerExercice = (id: number) => {
    Alert.alert("Supprimer l'exercice", "Toutes les séries seront effacées.", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => {
          db.runSync("DELETE FROM series WHERE id_exercice = ?", [id]);
          if (exoSelectionne === id) {
            setExoSelectionne(null);
            setNomExercice("");
          }
          loadExercices();
          loadLogs();
        },
      },
    ]);
  };

  // --- OUTILS DE FORMATAGE ---
  const formatDate = (rawDate: string) => {
    const d = new Date(rawDate);
    return isNaN(d.getTime()) ? rawDate : d.toLocaleDateString("fr-FR");
  };

  const formatChrono = (secondes: number) => {
    const mins = Math.floor(secondes / 60);
    const secs = secondes % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return {
    nom,
    date,
    logs,
    exercices,
    nomExercice,
    setNomExercice,
    exoSelectionne,
    setExoSelectionne,
    suggestions,
    setSuggestions,
    poids,
    setPoids,
    reps,
    setReps,
    tempsRestant,
    chronoActif,
    setChronoActif,
    tempsChoisi,
    setTempsChoisi,
    showPicker,
    setShowPicker,
    gererSaisieExo,
    handleAddSerie,
    supprimerRep,
    supprimerExercice,
    formatDate,
    formatChrono,
    logsGrouper,
    serieEnEdition,
    setSerieEnEdition,
    modifierSerie,
  };
};

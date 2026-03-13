import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import db from "../services/database";
import { ExerciceItem } from "../types";

export const useExercisesList = () => {
  const [allExercices, setAllExercices] = useState<ExerciceItem[]>([]);

  const loadAllExercices = useCallback(() => {
    try {
      const result = db.getAllSync("SELECT * FROM exercices") as ExerciceItem[];
      setAllExercices(result);
    } catch (e) {
      console.error("Erreur chargement liste des exercices :", e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAllExercices();
    }, [loadAllExercices]),
  );

  const supprimerExercice = useCallback(
    (id: number) => {
      Alert.alert(
        "Supprimer l'exercice",
        "Etes-vous sur ? Toutes les series de cet exercice seront effacees.",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Supprimer",
            style: "destructive",
            onPress: () => {
              try {
                db.runSync("DELETE FROM series WHERE id_exercice = ?", [id]);
                db.runSync("DELETE FROM exercices WHERE id = ?", [id]);
                loadAllExercices();
              } catch (e) {
                console.error("Erreur suppression exercice :", e);
                Alert.alert("Erreur", "Impossible de supprimer cet exercice.");
              }
            },
          },
        ],
      );
    },
    [loadAllExercices],
  );

  return {
    allExercices,
    supprimerExercice,
  };
};

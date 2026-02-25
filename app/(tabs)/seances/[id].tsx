import { Colors } from "@/constants/theme";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import db from "../../../services/database";

interface ExoResult {
  id: number;
}

interface SeanceResult {
  nom: string;
  date: string;
}

export default function SeanceDetailScreen() {
  const { id } = useLocalSearchParams();
  const seanceId = parseInt(Array.isArray(id) ? id[0] : id, 10);
  const [nom, setNom] = useState("Chargement...");
  const [nomExercice, setNomExercice] = useState("");
  const [exercices, setExercices] = useState<any[]>([]);
  const [exoSelectionne, setExoSelectionne] = useState<number | null>(null);
  const [poids, setPoids] = useState("");
  const [reps, setReps] = useState("");
  const [logs, setLogs] = useState<any[]>([]);
  const [date, setDate] = useState("Chargement...");
  const [tempsRestant, setTempsRestant] = useState(90);
  const [chronoActif, setChronoActif] = useState(false);
  const [allExercices, setAllExercices] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  useEffect(() => {
    loadInfoSeance();
    loadExercices();
    loadLogs();
    handleChrono();
    loadAllExercices();
  }, []);

  const loadAllExercices = () => {
    //pour le remplissage auto lors de l'écriture
    try {
      const result = db.getAllSync("Select * from exercices");
      setAllExercices(result);
    } catch (e) {
      console.error("Erreur chargement liste des exercices :", e);
    }
  };

  const gererSaisieExo = (text: string) => {
    setNomExercice(text);
    setExoSelectionne(null);
    if (text.length > 0) {
      const resultats = allExercices.filter((exo) =>
        exo.nom.toLowerCase().includes(text.toLowerCase()),
      );
      setSuggestions(resultats);
    } else {
      setSuggestions([]);
    }
  };
  const handleChrono = () => {};

  const formatDate = (rawDate: string) => {
    const parsedDate = new Date(rawDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return rawDate;
    }
    return parsedDate.toLocaleDateString("fr-FR");
  };

  const supprimerRep = (id: number) => {
    Alert.alert(
      "Supprimer la série",
      "Êtes-vous sûr de vouloir supprimer cette série ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            try {
              db.runSync("DELETE FROM series WHERE id = ?", [id]);
              loadLogs();
            } catch (e) {
              console.error("Erreur suppression série :", e);
              Alert.alert("Erreur", "Impossible de supprimer la série.");
            }
          },
        },
      ],
    );
  };

  const supprimerExercice = (id: number) => {
    Alert.alert(
      "Supprimer l'exercice",
      "Êtes-vous sûr ? Toutes les séries de cet exercice seront définitivement effacées.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            try {
              db.runSync("DELETE FROM series WHERE id_exercice = ?", [id]);
              db.runSync("DELETE FROM exercices WHERE id = ?", [id]);
              if (exoSelectionne === id) {
                setExoSelectionne(null);
                setNomExercice("");
              }
              loadExercices();
              loadLogs();
            } catch (e) {
              console.error("Erreur suppression exercice :", e);
              Alert.alert("Erreur", "Impossible de supprimer cet exercice.");
            }
          },
        },
      ],
    );
  };

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
      console.error("Erreur chargement séance :", e);
    }
  };

  const loadExercices = () => {
    try {
      const result = db.getAllSync(
        `SELECT DISTINCT exercices.id, exercices.nom 
         FROM exercices 
         JOIN series ON series.id_exercice = exercices.id 
         WHERE series.id_seance = ?`,
        [seanceId],
      );
      setExercices(result);
    } catch (e) {
      console.error("Erreur chargement exercices de la séance :", e);
    }
  };

  const loadLogs = () => {
    try {
      const logs = db.getAllSync(
        `
        SELECT series.id, series.poids, series.reps, exercices.nom 
        FROM series 
        JOIN exercices ON series.id_exercice = exercices.id
        WHERE series.id_seance = ?
        ORDER BY series.id DESC
      `,
        [seanceId],
      );
      setLogs(logs);
    } catch (e) {
      console.error("Erreur chargement logs :", e);
    }
  };

  const handleAddSerie = () => {
    if (!nomExercice.trim() || !poids || !reps) {
      Alert.alert(
        "Oups",
        "Veuillez remplir le nom, le poids et les répétitions .",
      );
      return;
    }
    try {
      let exerciceId: number;
      const nomPropre = nomExercice.trim();
      const exerciceExistant = db.getFirstSync(
        "SELECT id FROM exercices WHERE LOWER(nom) = LOWER(?)",
        [nomPropre],
      ) as ExoResult | null;
      if (exerciceExistant) {
        exerciceId = exerciceExistant.id;
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
    } catch (e) {
      console.error("Erreur ajout série :", e);
      Alert.alert("Erreur", "Impossible d'ajouter la série.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Séance: {nom} du {formatDate(date)}
      </Text>

      <View style={{ height: 50, marginBottom: 15 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {exercices.map((exo) => (
            <Pressable
              key={exo.id}
              style={[
                styles.exoBtn,
                exoSelectionne === exo.id && styles.exoBtnActive,
              ]}
              onPress={() => {
                setExoSelectionne(exo.id);
                setNomExercice(exo.nom);
              }}
              onLongPress={() => supprimerExercice(exo.id)}
            >
              <Text
                style={[
                  styles.exoText,
                  exoSelectionne === exo.id && styles.exoTextActive,
                ]}
              >
                {exo.nom}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <TextInput
        style={[styles.input]}
        placeholder="Nom de l'exercice (ex: Curl)"
        placeholderTextColor={Colors.dark.textMuted}
        value={nomExercice}
        onChangeText={(text) => {
          setNomExercice(text);
          setExoSelectionne(null);
          gererSaisieExo(text);
        }}
      />
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <ScrollView keyboardShouldPersistTaps="handled">
            {suggestions.map((item) => (
              <Pressable
                key={item.id}
                style={styles.suggestionItem}
                onPress={() => {
                  setNomExercice(item.nom);
                  setExoSelectionne(item.id);
                  setSuggestions([]);
                }}
              >
                <Text style={styles.suggestionText}>{item.nom}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
      <View style={styles.formRow}>
        <TextInput
          style={[styles.input, styles.rowInput]}
          placeholder="Poids (kg)"
          keyboardType="numeric"
          placeholderTextColor={Colors.dark.textMuted}
          value={poids}
          onChangeText={setPoids}
        />
        <TextInput
          style={[styles.input, styles.rowInput]}
          placeholder="Reps"
          keyboardType="numeric"
          placeholderTextColor={Colors.dark.textMuted}
          value={reps}
          onChangeText={setReps}
        />

        <Pressable style={styles.addBtn} onPress={handleAddSerie}>
          <Text style={styles.addBtnText}>Ajouter</Text>
        </Pressable>
      </View>

      <FlatList
        data={logs}
        style={{ flex: 1 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.logItem,
              pressed && styles.logItemPressed,
            ]}
            onLongPress={() => supprimerRep(item.id)}
          >
            <Text style={styles.logTitle}>{item.nom}</Text>
            <Text style={styles.logDetail}>
              {item.poids} kg x {item.reps} reps
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Aucune série ajoutée pour le moment.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: Colors.dark.background },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.dark.text,
  },
  exoBtn: {
    padding: 10,
    backgroundColor: Colors.dark.surfaceAlt,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    height: 40,
    justifyContent: "center",
  },
  exoBtnActive: {
    backgroundColor: Colors.dark.buttonBackground,
    borderColor: Colors.dark.border,
  },
  exoText: { color: Colors.dark.textMuted },
  exoTextActive: { color: Colors.dark.text, fontWeight: "bold" },

  formRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  input: {
    backgroundColor: Colors.dark.inputBackground,
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
    color: Colors.dark.text,
    borderWidth: 1,
    borderColor: Colors.dark.inputBorder,
    flexShrink: 0,
  },
  addBtn: {
    backgroundColor: Colors.dark.buttonBackground,
    justifyContent: "center",
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  addBtnText: {
    color: Colors.dark.buttonText,
    fontWeight: "bold",
    fontSize: 18,
  },
  rowInput: {
    flex: 1,
  },
  logItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: Colors.dark.surface,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    flex: 1,
  },
  logItemPressed: {
    opacity: 0.7,
  },
  logTitle: { fontWeight: "bold", fontSize: 16, color: Colors.dark.text },
  logDetail: { fontSize: 16, color: Colors.dark.textMuted },
  emptyText: {
    textAlign: "center",
    color: Colors.dark.textMuted,
    marginTop: 30,
  },
  suggestionsContainer: {
    position: "absolute",
    top: 190,
    left: 20,
    right: 20,
    backgroundColor: Colors.dark.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    maxHeight: 150,
    zIndex: 1000,
    elevation: 10,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  suggestionText: {
    color: Colors.dark.text,
    fontSize: 16,
  },
});

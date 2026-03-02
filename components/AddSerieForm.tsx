import { Colors } from "@/constants/theme";
import React from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { ExerciceItem } from "../types";

interface Props {
  nomExercice: string;
  poids: string;
  reps: string;
  suggestions: ExerciceItem[];
  gererSaisieExo: (text: string) => void;
  setPoids: (text: string) => void;
  setReps: (text: string) => void;
  onSelectSuggestion: (id: number, nom: string) => void;
  handleAddSerie: () => void;
}

export default function AddSerieForm({
  nomExercice,
  poids,
  reps,
  suggestions,
  gererSaisieExo,
  setPoids,
  setReps,
  onSelectSuggestion,
  handleAddSerie,
}: Props) {
  return (
    <View style={{ zIndex: 1 }}>
      <TextInput
        style={styles.input}
        placeholder="Nom de l'exercice (ex: Curl)"
        placeholderTextColor={Colors.dark.textMuted}
        value={nomExercice}
        onChangeText={gererSaisieExo}
      />

      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <ScrollView keyboardShouldPersistTaps="handled">
            {suggestions.map((item) => (
              <Pressable
                key={item.id}
                style={styles.suggestionItem}
                onPress={() => onSelectSuggestion(item.id, item.nom)}
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
    </View>
  );
}

const styles = StyleSheet.create({
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
  rowInput: { flex: 1 },
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
  suggestionsContainer: {
    position: "absolute",
    top: 65,
    left: 0,
    right: 0,
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
  suggestionText: { color: Colors.dark.text, fontSize: 16 },
});

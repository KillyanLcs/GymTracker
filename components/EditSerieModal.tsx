import { Colors } from "@/constants/theme";
import React, { useEffect, useState } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { LogItem } from "../types";

interface Props {
  serie: LogItem | null;
  onClose: () => void;
  onSave: (id: number, poids: string, reps: string) => void;
}

export default function EditSerieModal({ serie, onClose, onSave }: Props) {
  const [poids, setPoids] = useState("");
  const [reps, setReps] = useState("");

  useEffect(() => {
    if (serie) {
      setPoids(serie.poids.toString());
      setReps(serie.reps.toString());
    }
  }, [serie]);

  return (
    <Modal transparent visible={!!serie} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Modifier {serie?.nom}</Text>

          <View style={styles.formRow}>
            <TextInput
              style={styles.input}
              value={poids}
              onChangeText={setPoids}
              keyboardType="numeric"
              placeholder="Poids"
              placeholderTextColor={Colors.dark.textMuted}
              autoFocus
            />
            <TextInput
              style={styles.input}
              value={reps}
              onChangeText={setReps}
              keyboardType="numeric"
              placeholder="Reps"
              placeholderTextColor={Colors.dark.textMuted}
            />
          </View>

          <View style={styles.btnRow}>
            <Pressable style={[styles.btn, styles.cancelBtn]} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Annuler</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, styles.saveBtn]}
              onPress={() => serie && onSave(serie.id, poids, reps)}
            >
              <Text style={styles.saveBtnText}>Enregistrer</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.dark.text,
    marginBottom: 20,
    textAlign: "center",
  },
  formRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  input: {
    flex: 1,
    backgroundColor: Colors.dark.inputBackground,
    padding: 15,
    borderRadius: 10,
    color: Colors.dark.text,
    fontSize: 16,
    textAlign: "center",
    borderWidth: 1,
    borderColor: Colors.dark.inputBorder,
  },
  btnRow: { flexDirection: "row", gap: 10 },
  btn: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
  },
  cancelBtn: {
    backgroundColor: Colors.dark.surfaceAlt,
    borderColor: Colors.dark.border,
  },
  saveBtn: { backgroundColor: Colors.dark.tint, borderColor: Colors.dark.tint },
  cancelBtnText: {
    color: Colors.dark.textMuted,
    fontWeight: "bold",
    fontSize: 16,
  },
  saveBtnText: {
    color: Colors.dark.background,
    fontWeight: "bold",
    fontSize: 16,
  },
});

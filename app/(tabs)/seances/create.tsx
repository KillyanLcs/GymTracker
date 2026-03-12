import { Colors } from "@/constants/theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import db from "../../../services/database";
export default function CreateSessionScreen() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const handleCreate = () => {
    if (nom.trim() === "") {
      alert("Veuillez remplir le nom de la séance");
      return;
    }
    try {
      const dateBDD = date.toISOString();
      const result = db.runSync(
        "INSERT INTO seances (nom, date, notes) VALUES (?, ?, ?)",
        [nom, dateBDD, notes],
      );
      console.log("Séance créée avec succès, ID :", result.lastInsertRowId);
      router.replace({
        pathname: "/seances/[id]",
        params: { id: result.lastInsertRowId },
      });
    } catch (error) {
      console.error("Erreur lors de la création de la séance :", error);
    }
  };

  const onChange = (event: any, selectedDate?: Date) => {
    const dateCourante = selectedDate || date;
    if (Platform.OS == "android") {
      setShow(false);
    }
    setDate(dateCourante);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Nouvelle seance" }} />
      <Text style={styles.header}>Nouvelle Séance</Text>
      <Text style={styles.label}>Nom de la séance</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Push Day, Haut du corps..."
        placeholderTextColor={Colors.dark.textMuted}
        value={nom}
        onChangeText={setNom}
        autoFocus={true}
      />

      <Text style={styles.label}>Notes / Objectifs (Optionnel)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Ex: Essayer 80kg au bench..."
        placeholderTextColor={Colors.dark.textMuted}
        value={notes}
        onChangeText={setNotes}
        multiline={true}
        numberOfLines={4}
      />
      <Pressable style={styles.btnDate} onPress={() => setShow(true)}>
        <Text style={styles.btnDateText}>
          Séance du : {date.toLocaleDateString("fr-FR")}
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              is24Hour={true}
              display="spinner"
              onChange={onChange}
            />
          )}
        </Text>
      </Pressable>
      <Pressable style={styles.btnSave} onPress={handleCreate}>
        <Text style={styles.btnText}>Ajouter la séance</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: Colors.dark.background },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: Colors.dark.text,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: Colors.dark.text,
  },
  input: {
    backgroundColor: Colors.dark.inputBackground,
    borderWidth: 1,
    borderColor: Colors.dark.inputBorder,
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    color: Colors.dark.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  btnSave: {
    backgroundColor: Colors.dark.buttonBackground,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  btnText: { color: Colors.dark.buttonText, fontSize: 18, fontWeight: "bold" },
  btnDate: {
    backgroundColor: "transparent",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.dark.inputBorder,
  },
  btnDateText: {
    color: Colors.dark.textMuted,
    fontSize: 16,
    fontWeight: "600",
  },
});

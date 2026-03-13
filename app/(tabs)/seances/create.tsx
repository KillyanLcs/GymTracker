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

  const onChange = (_event: any, selectedDate?: Date) => {
    const dateCourante = selectedDate || date;
    if (Platform.OS === "android") {
      setShow(false);
    }
    setDate(dateCourante);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Nouvelle seance" }} />

      <View style={styles.header}>
        <Text style={styles.headerLabel}>NOUVELLE SEANCE</Text>
        <Text style={styles.headerTitle}>Creer ma seance</Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Nom de la seance</Text>
        <TextInput
          style={styles.input}
          placeholder="Push Day, Haut du corps..."
          placeholderTextColor={Colors.dark.textMuted}
          value={nom}
          onChangeText={setNom}
          autoFocus={true}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Notes <Text style={styles.labelOptional}>(optionnel)</Text>
        </Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Objectifs, charges cibles..."
          placeholderTextColor={Colors.dark.textMuted}
          value={notes}
          onChangeText={setNotes}
          multiline={true}
          numberOfLines={4}
        />
      </View>

      <Pressable style={styles.btnDate} onPress={() => setShow(true)}>
        <Text style={styles.btnDateLabel}>Date</Text>
        <Text style={styles.btnDateValue}>
          {date.toLocaleDateString("fr-FR")}
        </Text>
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
      </Pressable>

      <Pressable style={styles.btnSave} onPress={handleCreate}>
        <Text style={styles.btnText}>Demarrer la seance</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.dark.background,
  },
  header: {
    marginBottom: 28,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
    color: Colors.dark.tint,
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.dark.text,
    letterSpacing: 0.2,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    color: Colors.dark.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  labelOptional: {
    fontWeight: "400",
    textTransform: "none",
    letterSpacing: 0,
    color: Colors.dark.textMuted,
    fontSize: 13,
  },
  input: {
    backgroundColor: Colors.dark.inputBackground,
    borderWidth: 1,
    borderColor: Colors.dark.inputBorder,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    color: Colors.dark.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  btnDate: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.dark.inputBorder,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 24,
    backgroundColor: Colors.dark.inputBackground,
  },
  btnDateLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.dark.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  btnDateValue: {
    color: Colors.dark.text,
    fontSize: 15,
    fontWeight: "600",
  },
  btnSave: {
    backgroundColor: Colors.dark.tint,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  btnText: {
    color: Colors.dark.background,
    fontSize: 16,
    fontWeight: "800",
  },
});

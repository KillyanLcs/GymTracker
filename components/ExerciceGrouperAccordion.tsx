import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LogItem } from "../types";
import SerieLogItem from "./SerieLogItem";
interface Props {
  nom: string;
  series: LogItem[];
  tonnage: number;
  supprimerRep: (id: number) => void;
  editerRep: (serie: LogItem) => void;
}

export default function ExerciceGroupAccordion({
  nom,
  series,
  tonnage,
  supprimerRep,
}: Props) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <View style={styles.container}>
      <Pressable style={styles.header} onPress={() => setIsOpen(!isOpen)}>
        <View>
          <Text style={styles.title}>{nom}</Text>
          <Text style={styles.subtitle}>
            {series.length} séries • Volume: {tonnage} kg
          </Text>
        </View>
        <Ionicons
          name={isOpen ? "chevron-down" : "chevron-forward"}
          size={24}
          color={Colors.dark.textMuted}
        />
      </Pressable>

      {isOpen && (
        <View style={styles.content}>
          {series.map((item) => (
            <SerieLogItem
              key={item.id}
              item={item}
              onLongPress={supprimerRep}
              onPress={editerRep}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: Colors.dark.surfaceAlt,
  },
  title: { fontSize: 18, fontWeight: "bold", color: Colors.dark.text },
  subtitle: { fontSize: 14, color: Colors.dark.textMuted, marginTop: 4 },
  icon: { fontSize: 18 },
  content: {
    padding: 10,
    backgroundColor: Colors.dark.surface,
    gap: 8,
  },
});

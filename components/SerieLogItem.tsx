import { Colors } from "@/constants/theme";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { LogItem } from "../types";

interface Props {
  item: LogItem;
  onLongPress: (id: number) => void;
  onPress: (serie: LogItem) => void;
}

export default function SerieLogItem({ item, onLongPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.logItem,
        pressed && styles.logItemPressed,
      ]}
      onLongPress={() => onLongPress(item.id)}
      onPress={() => onPress(item)}
    >
      <Text style={styles.logTitle}>{item.nom}</Text>
      <Text style={styles.logDetail}>
        {item.poids} kg x {item.reps} reps
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  logItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: Colors.dark.surface,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  logItemPressed: {
    opacity: 0.7,
  },
  logTitle: { fontWeight: "bold", fontSize: 16, color: Colors.dark.text },
  logDetail: { fontSize: 16, color: Colors.dark.textMuted },
});

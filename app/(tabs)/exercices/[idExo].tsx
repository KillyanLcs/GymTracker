import { Colors } from "@/constants/theme";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import db from "../../../services/database";

interface SerieItem {
  id: number;
  poids: number;
  reps: number;
  date: string;
}

export default function ExerciseDetail() {
  const { id } = useLocalSearchParams();
  const [allSeries, setAllSeries] = useState<SerieItem[]>([]);
  const exerciseId = parseInt(Array.isArray(id) ? id[0] : id, 10);
  useEffect(() => {
    if (!isNaN(exerciseId)) {
      loadAllSeries();
    } else {
      console.error("L'ID de l'exercice n'a pas été trouvé dans l'URL !");
    }
  }, [exerciseId]);

  const loadAllSeries = () => {
    try {
      const result = db.getAllSync(
        "SELECT series.id, series.poids, series.reps, seances.date FROM series JOIN seances ON series.id_seance = seances.id WHERE series.id_exercice = ? ORDER BY seances.date DESC",
        [exerciseId],
      ) as SerieItem[];
      setAllSeries(result);
    } catch (e) {
      console.error("Erreur chargement liste des series :", e);
    }
  };

  const formatDate = (value: string) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }
    return parsed.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const renderItem = ({ item }: { item: SerieItem }) => {
    return (
      <Pressable
        style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
      >
        <View style={styles.btnContent}>
          <View style={styles.cardLeft}>
            <Text style={styles.dateText}>{formatDate(item.date)}</Text>
            <Text style={styles.subtleText}>Seance</Text>
          </View>
          <View style={styles.cardRight}>
            <View style={styles.metricsRow}>
              <View style={styles.metricChip}>
                <Text style={styles.metricValue}>{item.poids}</Text>
                <Text style={styles.metricLabel}>kg</Text>
              </View>
              <View style={styles.metricChip}>
                <Text style={styles.metricValue}>{item.reps}</Text>
                <Text style={styles.metricLabel}>reps</Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Séries effectuée</Text>
      <FlatList
        data={allSeries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune série pour le moment.</Text>
            <Text style={styles.emptySubText}>
              Commencez par créer votre première série
            </Text>
          </View>
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
  listContent: {
    paddingBottom: 50,
    gap: 12,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors?.dark?.text,
  },
  emptySubText: {
    fontSize: 14,
    color: Colors?.dark?.textMuted,
    textAlign: "center",
    marginTop: 5,
  },
  btn: {
    flex: 1,
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    overflow: "hidden",
  },
  btnPressed: {
    backgroundColor: Colors.dark.surfaceAlt,
    opacity: 0.8,
  },
  btnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  cardLeft: {
    flex: 1,
  },
  cardRight: {
    alignItems: "flex-end",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark.text,
  },
  subtleText: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.dark.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 8,
  },
  metricChip: {
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: Colors.dark.surfaceAlt,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark.text,
  },
  metricLabel: {
    marginLeft: 4,
    fontSize: 12,
    color: Colors.dark.textMuted,
  },
});

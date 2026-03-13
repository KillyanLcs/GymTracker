import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import db from "../../../services/database";

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  const day = date.getDate();
  const month = date
    .toLocaleString("default", { month: "short" })
    .toUpperCase();
  return { day, month };
};

interface SeanceItem {
  id: number;
  date: string;
  nom: string | null;
  notes: string | null;
}

export default function SessionListScreen() {
  const router = useRouter();
  const [seances, setSeances] = useState<SeanceItem[]>([]);

  const loadSeances = useCallback(() => {
    try {
      const data = db.getAllSync(
        "SELECT * FROM seances ORDER BY date DESC",
      ) as SeanceItem[];
      setSeances(data);
    } catch (e) {
      console.error("Erreur chargement :", e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSeances();
    }, [loadSeances]),
  );

  const supprimerSeance = (id: number) => {
    Alert.alert(
      "Supprimer la séance",
      "Êtes-vous sûr de vouloir supprimer cette séance ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            try {
              db.runSync("DELETE FROM seances WHERE id = ?", [id]);
              setSeances((currentSeances) =>
                currentSeances.filter((s) => s.id !== id),
              );
            } catch (e) {
              console.error("Erreur suppression :", e);
              Alert.alert("Erreur", "Impossible de supprimer la séance.");
            }
          },
        },
      ],
    );
  };

  const renderItem = ({ item }: { item: SeanceItem }) => {
    const { day, month } = formatDate(item.date);
    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => {
          router.push({
            pathname: "/seances/[id]",
            params: { id: item.id },
          });
        }}
        onLongPress={() => supprimerSeance(item.id)}
        delayLongPress={500}
      >
        <View style={styles.dateBox}>
          <Text style={styles.DateJour}>{day}</Text>
          <Text style={styles.dateMois}>{month}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.title}>{item.nom}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {item.notes ? item.notes : "Aucune note"}
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={Colors?.dark?.icon || "#ccc"}
        />
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Historique des seances" }} />
      <View style={styles.header}>
        <Text style={styles.headerLabel}>MES SEANCES</Text>
        <Text style={styles.headerTitle}>Historique</Text>
        {seances.length > 0 && (
          <Text style={styles.headerSub}>
            {seances.length} session{seances.length > 1 ? "s" : ""} enregistree
            {seances.length > 1 ? "s" : ""}
          </Text>
        )}
      </View>
      <FlatList
        data={seances}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Aucune seance</Text>
            <Text style={styles.emptySubText}>
              Lance ta premiere seance depuis l&apos;accueil
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 4,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
    color: Colors.dark.tint,
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.dark.text,
    letterSpacing: 0.2,
  },
  headerSub: {
    marginTop: 4,
    fontSize: 14,
    color: Colors.dark.textMuted,
  },
  listContent: {
    paddingBottom: 50,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderColor: Colors.dark.border,
    borderWidth: 1,
  },
  cardPressed: {
    opacity: 0.65,
  },
  dateBox: {
    backgroundColor: Colors.dark.surfaceAlt,
    borderRadius: 12,
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  DateJour: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.dark.text,
    lineHeight: 22,
  },
  dateMois: {
    fontSize: 10,
    color: Colors.dark.tint,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  infoBox: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark.text,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.dark.textMuted,
  },
  emptyContainer: {
    marginTop: 120,
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.dark.text,
  },
  emptySubText: {
    fontSize: 14,
    color: Colors?.dark?.textMuted,
    textAlign: "center",
    marginTop: 5,
  },
});

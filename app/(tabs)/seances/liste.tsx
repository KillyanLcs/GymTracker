import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
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

  useFocusEffect(
    useCallback(() => {
      loadSeances();
    }, []),
  );

  const loadSeances = () => {
    try {
      const data = db.getAllSync(
        "SELECT * FROM seances ORDER BY date DESC",
      ) as SeanceItem[];
      setSeances(data);
    } catch (e) {
      console.error("Erreur chargement :", e);
    }
  };

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
      <Text style={styles.headerTitle}>Historique</Text>
      <FlatList
        data={seances}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 50 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune séance pour le moment.</Text>
            <Text style={styles.emptySubText}>
              Appuie sur "Créer une nouvelle séance" pour commencer
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
    backgroundColor: Colors?.dark?.background,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors?.dark?.text,
    marginBottom: 20,
    marginLeft: 4,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors?.dark?.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderColor: Colors?.dark?.border,
    borderWidth: 1,
  },
  cardPressed: {
    opacity: 0.7,
  },
  dateBox: {
    backgroundColor: Colors?.dark?.surfaceAlt,
    borderRadius: 10,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  DateJour: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors?.dark?.text,
  },
  dateMois: {
    fontSize: 10,
    color: Colors?.dark?.textMuted,
    fontWeight: "600",
  },
  infoBox: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors?.dark?.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: Colors?.dark?.textMuted,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: "center",
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
});

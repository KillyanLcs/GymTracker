import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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

export default function SessionListScreen() {
  const router = useRouter();
  const [seances, setSeances] = useState<any[]>([]);

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
              const updatedSeances = seances.filter((s) => s.id !== id);
              setSeances(updatedSeances);
            } catch (e) {
              console.error(e);
            }
          },
        },
      ],
    );
  };
  useEffect(() => {
    try {
      const data = db.getAllSync("SELECT * FROM seances ORDER BY date DESC");
      setSeances(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const renderItem = ({ item }: { item: any }) => {
    const { day, month } = formatDate(item.date);
    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => {
          console.log("Navigating to séance with ID:", item.id);
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
        <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
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
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#14110F",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#F2F2F7",
    marginBottom: 20,
    marginLeft: 4,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#14110F",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderColor: "#F2F2F7",
    borderWidth: 1,
  },
  cardPressed: {
    opacity: 0.7,
  },
  dateBox: {
    backgroundColor: "#14110F",
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
    color: "#F3F3F4",
  },
  dateMois: {
    fontSize: 10,
    color: "#8E8E93",
    fontWeight: "600",
  },
  infoBox: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#F2F2F7",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: "#8E8E93",
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#F2F2F7",
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
  },
});

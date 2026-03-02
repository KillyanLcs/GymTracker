import { Colors } from "@/constants/theme";
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
interface ExerciceItem {
  id: number;
  nom: string;
}

export default function ExercisesScreen() {
  const [allExercices, setAllExercices] = useState<ExerciceItem[]>([]);
  const router = useRouter();
  useFocusEffect(
    useCallback(() => {
      loadAllExercices();
    }, []),
  );

  const loadAllExercices = () => {
    try {
      const result = db.getAllSync("Select * from exercices") as ExerciceItem[];
      setAllExercices(result);
    } catch (e) {
      console.error("Erreur chargement liste des exercices :", e);
    }
  };

  const renderItem = ({ item }: { item: ExerciceItem }) => {
    return (
      <Pressable
        style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
        onPress={() => {
          router.push({
            pathname: "/exercices/[idExo]",
            params: { idExo: item.id },
          });
        }}
        onLongPress={() => supprimerExercice(item.id)}
        delayLongPress={500}
      >
        <View style={styles.btnContent}>
          <Text style={styles.btnText}>{item.nom}</Text>
          <Text style={styles.btnArrow}>›</Text>
        </View>
      </Pressable>
    );
  };

  const supprimerExercice = (id: number) => {
    Alert.alert(
      "Supprimer l'exercice",
      "Êtes-vous sûr ? Toutes les séries de cet exercice seront définitivement effacées.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            try {
              db.runSync("DELETE FROM series WHERE id_exercice = ?", [id]);
              db.runSync("DELETE FROM exercices WHERE id = ?", [id]);
              loadAllExercices();
            } catch (e) {
              console.error("Erreur suppression exercice :", e);
              Alert.alert("Erreur", "Impossible de supprimer cet exercice.");
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Exercices</Text>
      <FlatList
        data={allExercices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun exercice pour le moment.</Text>
            <Text style={styles.emptySubText}>
              Commencez par créer votre premier exercice
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
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 12,
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
    marginHorizontal: 4,
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
    padding: 14,
  },
  btnText: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.dark.text,
    flex: 1,
  },
  btnArrow: {
    fontSize: 20,
    color: Colors.dark.textMuted,
    marginLeft: 8,
  },
});

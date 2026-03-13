import { Colors } from "@/constants/theme";
import { Stack, useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import ExerciseGridItem from "../../../components/ExerciseGridItem";
import { useExercisesList } from "../../../hooks/useExercisesList";

export default function ExercisesScreen() {
  const { allExercices, supprimerExercice } = useExercisesList();
  const router = useRouter();

  const renderItem = ({ item }: { item: (typeof allExercices)[number] }) => {
    return (
      <ExerciseGridItem
        nom={item.nom}
        onPress={() => {
          router.push({
            pathname: "/exercices/[idExo]",
            params: { idExo: item.id },
          });
        }}
        onLongPress={() => supprimerExercice(item.id)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Exercices" }} />
      <View style={styles.header}>
        <Text style={styles.headerLabel}>BIBLIOTHÈQUE</Text>
        <Text style={styles.headerTitle}>Exercices</Text>
        <Text style={styles.headerSub}>
          {allExercices.length} exercice{allExercices.length !== 1 ? "s" : ""}
        </Text>
      </View>
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
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: Colors.dark.background,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 14,
    paddingLeft: 4,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
    color: Colors.dark.tint,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.dark.text,
    letterSpacing: 0.2,
  },
  headerSub: {
    marginTop: 3,
    fontSize: 13,
    color: Colors.dark.textMuted,
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
});

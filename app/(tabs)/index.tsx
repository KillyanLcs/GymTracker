import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GYM TRACKER</Text>
      <View style={styles.btnContainer}>
        <Pressable
          style={styles.button}
          onPress={() => router.push("/seances/liste")}
        >
          <Text style={styles.buttonText}>Voir l'historique des séances</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => router.push("/seances/create")}
        >
          <Text style={styles.buttonText}>Créer une nouvelle séance</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => router.push("/exercices/lstExercices")}
        >
          <Text style={styles.buttonText}>
            Voir tous les exercices existant
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark.background,
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    color: Colors.dark.text,
  },
  btnContainer: {
    gap: 8,
    marginBottom: 8,
    width: "100%",
  },
  button: {
    height: 50,
    backgroundColor: Colors.dark.buttonBackground,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  buttonText: {
    color: Colors.dark.buttonText,
    fontSize: 16,
    fontWeight: "600",
  },
});

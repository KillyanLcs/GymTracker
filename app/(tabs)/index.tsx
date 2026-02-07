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
          <Text>Voir l'historique des séances</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => router.push("/seances/create")}
        >
          <Text>Créer une nouvelle séance</Text>
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
    backgroundColor: "#14110F",
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#ccc",
  },
  btnContainer: {
    gap: 8,
    marginBottom: 8,
    width: "100%",
  },
  button: {
    height: 50,
    backgroundColor: "#7E7F83",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
});

import { StyleSheet, Text, View } from "react-native";

export default function SeanceDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Séance Detail</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

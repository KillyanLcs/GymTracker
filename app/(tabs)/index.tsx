import { Colors } from "@/constants/theme";
import { Stack, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import HomeQuickActionCard from "../../components/HomeQuickActionCard";
import { useHomeQuickActions } from "../../hooks/useHomeQuickActions";

export default function HomeScreen() {
  const router = useRouter();
  const { quickActions } = useHomeQuickActions();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Accueil" }} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Acces rapides</Text>
          <Text style={styles.sectionCaption}>Tes actions essentielles</Text>
        </View>

        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <HomeQuickActionCard
              key={action.route}
              action={action}
              onPress={() => router.push(action.route as never)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 32,
    gap: 20,
  },
  sectionHeader: {
    marginTop: 2,
    gap: 4,
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: 22,
    fontWeight: "700",
  },
  sectionCaption: {
    color: Colors.dark.textMuted,
    fontSize: 14,
  },
  actionsGrid: {
    gap: 12,
    width: "100%",
  },
});

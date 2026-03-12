import { Colors } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const quickActions = [
  {
    label: "Historique des seances",
    subtitle: "Retrouve toutes tes sessions passees",
    icon: "history",
    route: "/seances/liste",
  },
  {
    label: "Nouvelle seance",
    subtitle: "Demarre un nouvel entrainement",
    icon: "plus-box",
    route: "/seances/create",
  },
  {
    label: "Bibliotheque d'exercices",
    subtitle: "Explore et organise tes mouvements",
    icon: "dumbbell",
    route: "/exercices/lstExercices",
  },
  {
    label: "Mes programmes",
    subtitle: "Construis tes cycles de progression",
    icon: "notebook-edit-outline",
    route: "/programme",
  },
] as const;

export default function HomeScreen() {
  const router = useRouter();

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
            <Pressable
              key={action.route}
              style={styles.actionCard}
              onPress={() => router.push(action.route)}
            >
              <View style={styles.iconChip}>
                <MaterialCommunityIcons
                  name={action.icon}
                  size={20}
                  color={Colors.dark.tint}
                />
              </View>
              <Text style={styles.actionTitle}>{action.label}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </Pressable>
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
  heroCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  badge: {
    alignSelf: "flex-start",
    color: Colors.dark.tint,
    backgroundColor: "rgba(183, 165, 138, 0.16)",
    borderWidth: 1,
    borderColor: "rgba(183, 165, 138, 0.3)",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 14,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: Colors.dark.text,
    letterSpacing: 0.4,
  },
  subtitle: {
    color: Colors.dark.textMuted,
    marginTop: 10,
    fontSize: 15,
    lineHeight: 21,
  },
  primaryButton: {
    marginTop: 18,
    backgroundColor: Colors.dark.tint,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  primaryButtonText: {
    color: Colors.dark.background,
    fontSize: 15,
    fontWeight: "800",
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
  actionCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    gap: 6,
  },
  iconChip: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark.surfaceAlt,
    marginBottom: 2,
  },
  actionTitle: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: "700",
  },
  actionSubtitle: {
    color: Colors.dark.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
});

import EditSerieModal from "@/components/EditSerieModal";
import ExerciceGroupAccordion from "@/components/ExerciceGrouperAccordion";
import { Colors } from "@/constants/theme";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import AddSerieForm from "../../../components/AddSerieForm";
import ChronoSection from "../../../components/Chrono";
import { useSeanceManager } from "../../../hooks/useSeanceManager";
export default function SeanceDetailScreen() {
  const { id } = useLocalSearchParams();
  const seanceId = parseInt(Array.isArray(id) ? id[0] : id, 10);
  const {
    nom,
    date,
    exercices,
    nomExercice,
    setNomExercice,
    exoSelectionne,
    setExoSelectionne,
    suggestions,
    setSuggestions,
    poids,
    setPoids,
    reps,
    setReps,
    tempsRestant,
    chronoActif,
    setChronoActif,
    tempsChoisi,
    setTempsChoisi,
    showPicker,
    setShowPicker,
    gererSaisieExo,
    handleAddSerie,
    supprimerRep,
    supprimerExercice,
    formatDate,
    formatChrono,
    logsGrouper,
    setSerieEnEdition,
    modifierSerie,
    serieEnEdition,
  } = useSeanceManager(seanceId);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Detail de seance" }} />

      <View style={styles.header}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {nom}
        </Text>
        <Text style={styles.headerSub}>{formatDate(date)}</Text>
      </View>

      <View style={styles.exoScrollWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.exoScrollContent}
        >
          {exercices.map((exo) => (
            <Pressable
              key={exo.id}
              style={[
                styles.exoBtn,
                exoSelectionne === exo.id && styles.exoBtnActive,
              ]}
              onPress={() => {
                setExoSelectionne(exo.id);
                setNomExercice(exo.nom);
              }}
              onLongPress={() => supprimerExercice(exo.id)}
            >
              <Text
                style={[
                  styles.exoText,
                  exoSelectionne === exo.id && styles.exoTextActive,
                ]}
              >
                {exo.nom}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <AddSerieForm
        nomExercice={nomExercice}
        poids={poids}
        reps={reps}
        suggestions={suggestions}
        gererSaisieExo={gererSaisieExo}
        setPoids={setPoids}
        setReps={setReps}
        onSubmitNomExercice={() => setSuggestions([])}
        onSelectSuggestion={(id, nom) => {
          setNomExercice(nom);
          setExoSelectionne(id);
          setSuggestions([]);
        }}
        handleAddSerie={handleAddSerie}
      />
      <ChronoSection
        chronoActif={chronoActif}
        tempsRestant={tempsRestant}
        tempsChoisi={tempsChoisi}
        showPicker={showPicker}
        setShowPicker={setShowPicker}
        setChronoActif={setChronoActif}
        setTempsChoisi={setTempsChoisi}
        formatChrono={formatChrono}
      />

      <FlatList
        data={logsGrouper}
        style={{ flex: 1 }}
        keyExtractor={(item) => item.nom}
        renderItem={({ item }) => (
          <ExerciceGroupAccordion
            nom={item.nom}
            series={item.series}
            tonnage={item.tonnage}
            supprimerRep={supprimerRep}
            editerRep={(serie) => setSerieEnEdition(serie)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Aucune serie ajoutee pour le moment.
          </Text>
        }
      />
      <EditSerieModal
        serie={serieEnEdition}
        onClose={() => setSerieEnEdition(null)}
        onSave={modifierSerie}
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
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.dark.text,
    letterSpacing: 0.2,
  },
  headerSub: {
    marginTop: 3,
    fontSize: 13,
    color: Colors.dark.textMuted,
  },
  exoScrollWrap: {
    height: 44,
    marginBottom: 12,
  },
  exoScrollContent: {
    alignItems: "center",
    gap: 8,
  },
  exoBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.dark.surfaceAlt,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    justifyContent: "center",
  },
  exoBtnActive: {
    backgroundColor: Colors.dark.tint,
    borderColor: Colors.dark.tint,
  },
  exoText: {
    color: Colors.dark.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  exoTextActive: {
    color: Colors.dark.background,
    fontWeight: "700",
  },
  emptyText: {
    textAlign: "center",
    color: Colors.dark.textMuted,
    marginTop: 30,
    fontSize: 14,
  },
});

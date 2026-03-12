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
      <Text style={styles.header}>
        Séance: {nom} du {formatDate(date)}
      </Text>

      <View style={{ height: 50, marginBottom: 15 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
            Aucune série ajoutée pour le moment.
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
  container: { flex: 1, padding: 20, backgroundColor: Colors.dark.background },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.dark.text,
  },
  exoBtn: {
    padding: 10,
    backgroundColor: Colors.dark.surfaceAlt,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    height: 40,
    justifyContent: "center",
  },
  exoBtnActive: {
    backgroundColor: Colors.dark.buttonBackground,
    borderColor: Colors.dark.border,
  },
  exoText: { color: Colors.dark.textMuted },
  exoTextActive: { color: Colors.dark.text, fontWeight: "bold" },
  emptyText: {
    textAlign: "center",
    color: Colors.dark.textMuted,
    marginTop: 30,
  },
});

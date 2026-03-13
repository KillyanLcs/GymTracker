import { useMemo } from "react";

export interface HomeQuickAction {
  label: string;
  subtitle: string;
  icon: string;
  route: string;
}

export const useHomeQuickActions = () => {
  const quickActions = useMemo<HomeQuickAction[]>(
    () => [
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
    ],
    [],
  );

  return { quickActions };
};

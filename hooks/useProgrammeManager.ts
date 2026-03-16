import { useEffect, useState } from "react";
import db from "../services/database";

export const useProgrammeManager = () => {
  const [contenu, setContenu] = useState("");

  useEffect(() => {
    try {
      db.execSync(
        "CREATE TABLE IF NOT EXISTS programme (id INTEGER PRIMARY KEY, texte TEXT);",
      );
      const result = db.getFirstSync(
        "SELECT texte FROM programme WHERE id = 1",
      ) as { texte: string } | null;

      if (result) {
        setContenu(result.texte);
      } else {
        db.runSync("INSERT INTO programme (id, texte) VALUES (1, '')");
      }
    } catch (e) {
      console.error("Erreur initialisation programme:", e);
    }
  }, []);

  const sauvegarderTexte = (nouveauTexte: string) => {
    setContenu(nouveauTexte);
    try {
      db.runSync("UPDATE programme SET texte = ? WHERE id = 1", [nouveauTexte]);
    } catch (e) {
      console.error("Erreur sauvegarde programme:", e);
    }
  };

  return { contenu, sauvegarderTexte };
};

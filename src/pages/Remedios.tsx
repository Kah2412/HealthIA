import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import ElderButton from "@/components/ElderButton";
import GuideCharacter from "@/components/GuideCharacter";
import EmergencyButton from "@/components/EmergencyButton";

interface Remedio {
  id: number;
  nome: string;
  horario: string;
  tomado: boolean;
}

const initialRemedios: Remedio[] = [
  { id: 1, nome: "Pressão arterial", horario: "08:00", tomado: false },
  { id: 2, nome: "Vitamina D", horario: "12:00", tomado: false },
  { id: 3, nome: "Cálcio", horario: "20:00", tomado: false },
];

const Remedios = () => {
  const [remedios, setRemedios] = useState(initialRemedios);
  const [newNome, setNewNome] = useState("");
  const [newHorario, setNewHorario] = useState("");

  const marcarTomado = (id: number) => {
    setRemedios((prev) =>
      prev.map((r) => (r.id === id ? { ...r, tomado: true } : r))
    );
  };

  const addRemedio = () => {
    if (newNome.trim() && newHorario) {
      const newId = Math.max(...remedios.map(r => r.id)) + 1;
      const newRemedio: Remedio = {
        id: newId,
        nome: newNome.trim(),
        horario: newHorario,
        tomado: false,
      };
      setRemedios((prev) => [...prev, newRemedio]);
      setNewNome("");
      setNewHorario("");
    }
  };

  const allDone = remedios.every((r) => r.tomado);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-xl mx-auto px-4 space-y-6">
        <PageHeader title="Remédios" emoji="💊" />

        <GuideCharacter
          message={allDone ? "Parabéns! Todos os remédios tomados! 🎉" : "Não esqueça de tomar seus remédios!"}
          size="sm"
        />

        {/* Formulário para adicionar remédio */}
        <div className="card-elder space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Adicionar novo remédio</h3>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Nome do remédio"
              value={newNome}
              onChange={(e) => setNewNome(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            />
            <input
              type="time"
              value={newHorario}
              onChange={(e) => setNewHorario(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            />
            <ElderButton onClick={addRemedio} variant="primary" fullWidth>
              Adicionar remédio
            </ElderButton>
          </div>
        </div>

        <div className="space-y-4">
          {remedios.map((r) => (
            <motion.div
              key={r.id}
              layout
              className={`card-elder flex items-center justify-between ${r.tomado ? "opacity-60" : ""}`}
            >
              <div>
                <p className="text-xl font-bold text-foreground">{r.nome}</p>
                <p className="text-lg text-muted-foreground">⏰ {r.horario}</p>
              </div>
              {r.tomado ? (
                <span className="text-2xl">✅</span>
              ) : (
                <ElderButton onClick={() => marcarTomado(r.id)} variant="success">
                  Tomei
                </ElderButton>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      <EmergencyButton />
    </div>
  );
};

export default Remedios;

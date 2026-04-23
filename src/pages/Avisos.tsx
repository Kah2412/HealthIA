import PageHeader from "@/components/PageHeader";
import GuideCharacter from "@/components/GuideCharacter";
import EmergencyButton from "@/components/EmergencyButton";
import ElderButton from "@/components/ElderButton";
import { Volume2 } from "lucide-react";
import { falar } from "@/lib/voice";

const avisos = [
  { id: 1, texto: "Amanhã teremos café da manhã especial às 8h!", data: "Hoje" },
  { id: 2, texto: "Atividade de música na sala de convivência às 15h.", data: "Hoje" },
  { id: 3, texto: "Visita da família permitida no domingo.", data: "Ontem" },
  { id: 4, texto: "Consulta médica geral na quarta-feira.", data: "Ontem" },
];

const Avisos = () => {
  const ouvirTodos = () => {
    const todosTextos = `Vamos ouvir seus avisos com calma. ${avisos.map((a) => a.texto).join('. ')}`;
    falar(todosTextos, "pt-BR");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-xl mx-auto px-4 space-y-6">
        <PageHeader title="Avisos" emoji="📢" />

        <GuideCharacter message="Aqui estão os avisos do lar. Toque no alto-falante para ouvir!" size="sm" />

        <ElderButton onClick={ouvirTodos} variant="primary" fullWidth>
          <Volume2 className="w-5 h-5 mr-2" />
          Ouvir todos os avisos
        </ElderButton>

        <div className="space-y-4">
          {avisos.map((a) => (
            <div key={a.id} className="card-elder flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase">{a.data}</p>
                <p className="text-lg font-semibold text-foreground">{a.texto}</p>
              </div>
              <button
                onClick={() => falar(`Aviso: ${a.texto}`, "pt-BR")}
                className="btn-elder bg-primary text-primary-foreground px-4 py-3"
                aria-label={`Ouvir: ${a.texto}`}
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <EmergencyButton />
    </div>
  );
};

export default Avisos;

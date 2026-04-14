import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import ElderButton from "@/components/ElderButton";
import GuideCharacter from "@/components/GuideCharacter";
import EmergencyButton from "@/components/EmergencyButton";
import { falar } from "@/lib/voice";

type Livro = {
  id: string;
  titulo: string;
  autor: string;
  coverId?: number;
  descricao: string;
};

const SEARCH_LIMIT = 8;

const getCoverUrl = (coverId?: number) =>
  coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : "";

const formatDescription = (doc: any) => {
  if (!doc) return "Descrição não disponível.";
  if (typeof doc === "string") return doc;
  if (doc.value) return doc.value;
  return "Descrição não disponível.";
};

const Livros = () => {
  const [busca, setBusca] = useState("");
  const [livros, setLivros] = useState<Livro[]>([]);
  const [status, setStatus] = useState("Pesquise um livro para ver resultados.");
  const [loading, setLoading] = useState(false);

  const searchBooks = async () => {
    const termo = busca.trim();
    if (!termo) {
      setLivros([]);
      setStatus("Pesquise um livro para ver resultados.");
      return;
    }

    setLoading(true);
    setStatus("Buscando livros...");

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(termo)}&limit=${SEARCH_LIMIT}`
      );
      const data = await response.json();
      const docs = Array.isArray(data.docs) ? data.docs : [];

      if (docs.length === 0) {
        setLivros([]);
        setStatus("Nenhum livro encontrado.");
        return;
      }

      const results: Livro[] = docs.slice(0, SEARCH_LIMIT).map((doc: any, index: number) => ({
        id: doc.key || `${index}-${termo}`,
        titulo: doc.title || "Título não informado",
        autor: Array.isArray(doc.author_name)
          ? doc.author_name[0]
          : doc.author_name || "Autor não informado",
        coverId: doc.cover_i,
        descricao:
          formatDescription(doc.first_sentence) ||
          formatDescription(doc.subtitle) ||
          (Array.isArray(doc.subject) ? doc.subject.slice(0, 3).join(", ") : "Descrição não disponível."),
      }));

      setLivros(results);
      setStatus(`Mostrando ${results.length} resultados.`);
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
      setLivros([]);
      setStatus("Não foi possível carregar os livros agora.");
    } finally {
      setLoading(false);
    }
  };

  const ouvirLeitura = (titulo: string) => {
    falar(`Vamos ouvir um pouco sobre o livro ${titulo}.`);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-xl mx-auto px-4 space-y-6">
        <PageHeader title="Livros" emoji="📚" />

        <GuideCharacter message="Vamos ler um livro juntos? Pesquise para ver capas e descrições." size="sm" />

        <div className="space-y-4">
          <div className="flex gap-3 flex-col sm:flex-row">
            <input
              type="text"
              placeholder="🔍 Buscar livro..."
              aria-label="Buscar livro"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchBooks()}
              className="flex-1 p-4 text-xl rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <ElderButton onClick={searchBooks} variant="secondary" fullWidth disabled={loading}>
              {loading ? "Buscando..." : "Buscar"}
            </ElderButton>
          </div>

          <p className="text-sm text-muted-foreground">{status}</p>

          {livros.length > 0 && (
            <div className="space-y-4">
              {livros.map((livro) => (
                <div key={livro.id} className="card-elder flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-full sm:w-24 h-32 bg-muted rounded-3xl overflow-hidden flex items-center justify-center">
                    {livro.coverId ? (
                      <img
                        src={getCoverUrl(livro.coverId)}
                        alt={`Capa de ${livro.titulo}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">📚</span>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="text-xl font-bold text-foreground">{livro.titulo}</p>
                      <p className="text-muted-foreground">{livro.autor}</p>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">{livro.descricao}</p>
                  </div>

                  <ElderButton onClick={() => ouvirLeitura(livro.titulo)} variant="primary" icon="🔊" fullWidth>
                    Ouvir
                  </ElderButton>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <EmergencyButton />
    </div>
  );
};

export default Livros;

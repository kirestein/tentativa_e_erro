export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Considera "atualizada" só quando updated_at é pelo menos 1 minuto depois
// de created_at, pra não marcar como atualizada uma atividade recém-criada
// só por causa da pequena diferença entre os dois timestamps na inserção.
export function wasUpdatedAfterCreation(createdAt: string, updatedAt: string) {
  return new Date(updatedAt).getTime() - new Date(createdAt).getTime() > 60_000;
}

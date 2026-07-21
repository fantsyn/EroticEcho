/** Live clothing / undress states for play UI + prompts */
export const CLOTHING_STATES = [
  {
    id: "dressed",
    label: "Dressed",
    prompt: "fully dressed in her baseline outfit",
  },
  {
    id: "disheveled",
    label: "Disheveled",
    prompt: "clothes rumpled, buttons half-undone, hair messy, still mostly dressed",
  },
  {
    id: "lingerie",
    label: "Lingerie",
    prompt: "down to lingerie / underwear only",
  },
  {
    id: "partial",
    label: "Partly off",
    prompt: "partly undressed — top or bottom removed, intimate but not fully bare",
  },
  {
    id: "barely",
    label: "Barely on",
    prompt: "barely covered — micro scraps of clothing, highly revealing, still not fully nude in narration unless mode allows",
  },
  {
    id: "wet",
    label: "Wet clothes",
    prompt: "clothes wet and clinging, fabric translucent-feeling, soaked hair",
  },
  {
    id: "uniform-loose",
    label: "Uniform loose",
    prompt: "work/role uniform open or half-off, still reads as her profession",
  },
] as const;

export function clothingPrompt(id?: string): string {
  const hit = CLOTHING_STATES.find((c) => c.id === id);
  return hit?.prompt || "as established in the scene";
}

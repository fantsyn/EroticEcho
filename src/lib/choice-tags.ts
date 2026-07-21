/** Tag story choices by heat / tone for UI chips */

export type ChoiceTag = {
  id: string;
  label: string;
  className: string;
};

export function tagChoice(label: string): ChoiceTag | null {
  const t = label.toLowerCase();
  if (
    /\b(gentle|soft|kiss|hold|comfort|aftercare|slow|romance|sweet|tender)\b/.test(
      t
    )
  ) {
    return {
      id: "soft",
      label: "Soft",
      className: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
    };
  }
  if (
    /\b(fuck|filth|ruin|use me|throat|creampie|breed|raw|slut|cum|harder)\b/.test(
      t
    )
  ) {
    return {
      id: "filth",
      label: "Filth",
      className: "bg-rose-500/20 text-rose-100 border-rose-500/35",
    };
  }
  if (
    /\b(force|cnc|struggle|threat|blackmail|pin|dark|obsess|punish|kneel)\b/.test(
      t
    )
  ) {
    return {
      id: "dark",
      label: "Dark",
      className: "bg-red-500/15 text-red-100 border-red-500/30",
    };
  }
  if (/\b(tease|dare|laugh|joke|brat|game|challenge)\b/.test(t)) {
    return {
      id: "play",
      label: "Play",
      className: "bg-amber-500/15 text-amber-100 border-amber-500/30",
    };
  }
  if (/\b(leave|stop|wait|pause|talk|ask|listen)\b/.test(t)) {
    return {
      id: "talk",
      label: "Talk",
      className: "bg-sky-500/15 text-sky-100 border-sky-500/30",
    };
  }
  return null;
}

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

export const ui = {
  focusRing: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400",
  focusRingOffset: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2",
  link: "font-semibold text-cyan-700 underline-offset-4 hover:text-lime-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 dark:text-cyan-300 dark:hover:text-lime-200",
  panel: "rounded-lg border border-cyan-700/15 bg-[#fbfaf2] shadow-md shadow-slate-300/30 dark:border-cyan-300/15 dark:bg-slate-800 dark:shadow-black/20",
  translucentPanel: "rounded-lg border border-cyan-700/15 bg-[#fbfaf2]/85 shadow-md shadow-slate-300/30 backdrop-blur dark:border-cyan-300/15 dark:bg-slate-800/80 dark:shadow-black/20",
  input: "mt-1 w-full rounded-md border border-cyan-700/20 bg-white/85 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-lime-500 focus:ring-2 focus:ring-lime-300 dark:border-cyan-300/15 dark:bg-slate-900/80 dark:text-slate-100 dark:focus:border-lime-300",
  primaryButton: "rounded-md bg-lime-300 px-3 py-2 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-lime-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400",
  primaryLinkButton: "inline-flex rounded-md bg-lime-300 px-4 py-2 font-bold text-slate-950 transition hover:bg-lime-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400",
  secondaryButton: "rounded-md border border-cyan-700/20 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-lime-500 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 dark:border-cyan-300/20 dark:text-slate-200 dark:hover:text-lime-200",
  eyebrow: "text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300",
  compactEyebrow: "text-[0.58rem] font-bold uppercase tracking-wide text-cyan-700 dark:text-cyan-300",
  formLabel: "block text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300",
  cardShell: "portal-hover group relative h-full overflow-hidden rounded-lg border border-cyan-700/15 bg-[#fbfaf2] text-left shadow-md shadow-slate-300/40 transition duration-200 before:absolute before:inset-y-0 before:left-0 before:w-1 hover:-translate-y-0.5 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-lime-500/10 focus-within:border-lime-400 dark:border-cyan-300/10 dark:bg-slate-800 dark:shadow-black/25 dark:hover:border-cyan-300/40",
  badgeBase: "rounded-full border px-1.5 py-px text-[0.58rem] font-bold uppercase tracking-wide",
  activeFilterBadge: "rounded-full border border-lime-400/40 bg-lime-300/15 px-2 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-lime-800 dark:text-lime-200",
  mutedPanel: "rounded-lg border border-cyan-700/15 bg-white/70 text-slate-600 shadow-sm dark:border-cyan-300/15 dark:bg-slate-800/70 dark:text-slate-300",
}

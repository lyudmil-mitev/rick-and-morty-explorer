import { cx, ui } from "../styles/ui";

type BadgeTone = "green" | "red" | "gray" | "cyan" | "yellow";
type CardVariant = "character" | "location" | "episode";

const badgeToneClass: Record<BadgeTone, string> = {
    green: "border-lime-400/60 bg-lime-300/20 text-lime-800 dark:text-lime-200",
    red: "border-rose-400/60 bg-rose-300/20 text-rose-800 dark:text-rose-200",
    gray: "border-slate-400/50 bg-slate-400/15 text-slate-600 dark:text-slate-300",
    cyan: "border-cyan-400/60 bg-cyan-300/20 text-cyan-800 dark:text-cyan-200",
    yellow: "border-yellow-400/70 bg-yellow-300/20 text-yellow-800 dark:text-yellow-200",
};

const variantClass: Record<CardVariant, string> = {
    character: "before:bg-lime-400",
    location: "before:bg-cyan-400",
    episode: "before:bg-yellow-300",
};

export default function MiniCard({
    title,
    image,
    description,
    eyebrow,
    badge,
    badgeTone = "cyan",
    variant = "character",
}: {
    title: string,
    image: string,
    description: string,
    eyebrow?: string,
    badge?: string,
    badgeTone?: BadgeTone,
    variant?: CardVariant,
}) {
    return (
        <section className={cx(ui.cardShell, variantClass[variant])}>
            <div className="grid h-full min-h-28 grid-cols-[6.75rem_1fr] sm:grid-cols-[7rem_1fr]">
                <div className="relative overflow-hidden bg-slate-950">
                    <img src={image} alt={title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105 group-hover:saturate-125" />
                    <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
                </div>
                <div className="z-10 flex min-w-0 flex-col justify-between gap-3 p-4">
                    <div>
                        <h2 className="break-words text-lg font-bold leading-tight text-slate-900 dark:text-slate-100 sm:text-xl">{title}</h2>
                        <p className="mt-2 break-words text-sm leading-snug text-slate-600 dark:text-slate-400 sm:text-base">
                            {description}
                        </p>
                    </div>
                    {eyebrow || badge ? (
                        <div className="flex flex-wrap items-center gap-1.5">
                            {eyebrow ? <span className={ui.compactEyebrow}>{eyebrow}</span> : null}
                            {badge ? <span className={cx(ui.badgeBase, badgeToneClass[badgeTone])}>{badge}</span> : null}
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
}

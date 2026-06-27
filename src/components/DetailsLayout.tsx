import React from "react";
import { Link } from "react-router-dom";
import { cx, ui } from "../styles/ui";

export type DetailFacts = {
    type: string;
    value: string;
    url?: string;
}

type DetailsVariant = "character" | "location" | "episode";

const variantLabel: Record<DetailsVariant, string> = {
    character: "Character Record",
    location: "Location Record",
    episode: "Episode Record",
};

const variantAccent: Record<DetailsVariant, string> = {
    character: "border-lime-300/35 shadow-lime-950/10",
    location: "border-cyan-300/35 shadow-cyan-950/10",
    episode: "border-yellow-300/35 shadow-yellow-950/10",
};

export default function DetailsLayout({
    image,
    title,
    facts,
    childrenTitle,
    children,
    intro,
    recordLabel,
    variant = "character",
}: {
    image: string,
    title: string,
    facts: DetailFacts[],
    childrenTitle: string,
    children?: React.ReactNode,
    intro?: React.ReactNode,
    recordLabel?: string,
    variant?: DetailsVariant,
}) {
    return (
        <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-8 pt-3 sm:px-6 lg:grid lg:grid-cols-[minmax(18rem,24rem)_1fr] lg:items-start lg:px-8">
            <aside className={cx("rounded-lg border bg-[#fbfaf2] shadow-xl dark:bg-slate-800", variantAccent[variant])}>
                <div className="p-4 sm:p-6">
                    <div className="rounded-lg border border-cyan-700/15 bg-white/75 p-2 shadow-inner dark:border-cyan-300/15 dark:bg-slate-950">
                        <img className="mx-auto aspect-square w-full max-w-xs rounded object-cover ring-1 ring-white/10" src={image} alt={title} />
                    </div>
                    <p className={cx("mt-5", ui.eyebrow)}>{recordLabel ?? variantLabel[variant]}</p>
                    <h1 className="mt-2 break-words text-3xl font-extrabold leading-tight text-slate-950 dark:text-white lg:text-4xl">{title}</h1>

                    <dl className="mt-6 grid gap-2">
                        {facts.map((fact, index) => (
                            <div key={index} className="flex justify-between gap-4 rounded-md border border-slate-900/5 bg-white/70 p-3 shadow-sm transition hover:border-cyan-500/25 dark:border-white/5 dark:bg-slate-900/45">
                                <dt className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{fact.type}</dt>
                                <dd className="min-w-0 text-right font-semibold text-slate-800 dark:text-slate-200">
                                    {fact.url ? (
                                        <Link to={fact.url} className={cx("rounded", ui.link)}>{fact.value}</Link>
                                    ) : fact.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </aside>
            <section className="min-w-0">
                {intro ? <div className="mb-6">{intro}</div> : null}
                <h2 className="mb-4 text-left text-2xl font-bold text-slate-950 dark:text-slate-100">{childrenTitle}</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {children}
                </div>
            </section>
        </section>
    );
}

import { useState } from "react";
import { DetailsRecord, isDisplayableDetails } from "../details";
import { cx, ui } from "../styles/ui";

const previewLength = 720;

const statusLabel: Record<string, string> = {
    contextual_source: "Context source",
    alias_match: "Alias match",
};

export default function DetailsTextPanel({
    details,
}: {
    details: DetailsRecord | null,
}) {
    const [expanded, setExpanded] = useState(false);

    if (!isDisplayableDetails(details)) {
        return null;
    }

    const label = details.textType === "synopsis" ? "Synopsis" : "Description";
    const isLong = details.text.length > previewLength;
    const text = isLong && !expanded ? `${details.text.slice(0, previewLength).trimEnd()}...` : details.text;
    const showStatus = details.status === "contextual_source" || details.status === "alias_match";

    return (
        <article className={cx("text-left", ui.translucentPanel)}>
            <div className="p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">{label}</h2>
                    {showStatus ? (
                        <span className={cx(ui.badgeBase, "border-cyan-400/60 bg-cyan-300/20 text-cyan-800 dark:text-cyan-200")}>
                            {statusLabel[details.status]}
                        </span>
                    ) : null}
                </div>
                <p className="mt-3 whitespace-pre-line leading-7 text-slate-700 dark:text-slate-200">{text}</p>
                {isLong ? (
                    <button
                        type="button"
                        className={cx("mt-3", ui.secondaryButton)}
                        onClick={() => setExpanded((value) => !value)}
                    >
                        {expanded ? "Show less" : "Show more"}
                    </button>
                ) : null}
                {details.notes && showStatus ? (
                    <p className="mt-4 rounded-md border border-cyan-700/10 bg-white/60 p-3 text-sm leading-6 text-slate-600 dark:border-cyan-300/10 dark:bg-slate-900/45 dark:text-slate-300">
                        {details.notes}
                    </p>
                ) : null}
                {details.sources.length > 0 ? (
                    <section className="mt-5 border-t border-cyan-700/10 pt-4 dark:border-cyan-300/10">
                        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Sources</h3>
                        <ul className="mt-2 space-y-1.5 text-sm">
                            {details.sources.map((source) => (
                                <li key={source.id} className="text-slate-600 dark:text-slate-300">
                                    <a className={ui.link} href={source.url} target="_blank" rel="noreferrer">
                                        {source.title}
                                    </a>
                                    <span className="ml-1 text-slate-500 dark:text-slate-400">({source.publisher})</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                ) : null}
            </div>
        </article>
    );
}

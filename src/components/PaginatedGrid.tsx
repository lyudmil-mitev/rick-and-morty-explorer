import { ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import Pagination from "./Pagination";

export default function PaginatedGrid({
    pages,
    title,
    description,
    children,
}: {
    pages: number,
    title: string,
    description: string,
    children: ReactNode,
}) {
    const [params] = useSearchParams();
    const page = Number.parseInt(params.get("page") || "1", 10);

    return (
        <section className="px-4 pb-8 pt-2 text-left sm:px-6 lg:px-8">
            <header className="mx-auto max-w-7xl pb-1 pt-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Multiverse index</p>
                <h1 className="mt-2 text-2xl font-extrabold tracking-normal text-slate-950 dark:text-white sm:text-3xl">{title}</h1>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">{description}</p>
            </header>
            <Pagination page={page} totalPages={pages} />
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {children}
            </div>
            <Pagination page={page} totalPages={pages} />
        </section>
    );
}

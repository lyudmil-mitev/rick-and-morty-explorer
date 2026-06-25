import { ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import Pagination from "./Pagination";

export default function PaginatedGrid({ pages, children }: { pages: number, children: ReactNode }) {
    const [params] = useSearchParams();
    const page = Number.parseInt(params.get("page") || "1", 10);

    return (
        <section className="p-4 text-left">
            <Pagination page={page} totalPages={pages} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {children}
            </div>
            <Pagination page={page} totalPages={pages} />
        </section>
    );
}

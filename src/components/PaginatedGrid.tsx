import { ReactNode, TouchEvent, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "./Pagination";

const swipeDistanceThreshold = 60;
const swipeVerticalTolerance = 75;

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
    const navigate = useNavigate();
    const swipeStart = useRef<{ x: number, y: number } | null>(null);
    const page = Number.parseInt(params.get("page") || "1", 10);

    function goToPage(nextPage: number) {
        const clampedPage = Math.min(Math.max(nextPage, 1), pages);
        if (clampedPage !== page) {
            navigate(`?page=${clampedPage}`);
        }
    }

    function handleTouchStart(event: TouchEvent<HTMLElement>) {
        const touch = event.touches[0];
        if (!touch) {
            return;
        }

        swipeStart.current = { x: touch.clientX, y: touch.clientY };
    }

    function handleTouchEnd(event: TouchEvent<HTMLElement>) {
        const start = swipeStart.current;
        const touch = event.changedTouches[0];
        swipeStart.current = null;

        if (!start || !touch) {
            return;
        }

        const deltaX = touch.clientX - start.x;
        const deltaY = touch.clientY - start.y;
        const isHorizontalSwipe = Math.abs(deltaX) >= swipeDistanceThreshold && Math.abs(deltaY) <= swipeVerticalTolerance && Math.abs(deltaX) > Math.abs(deltaY);

        if (!isHorizontalSwipe) {
            return;
        }

        goToPage(deltaX < 0 ? page + 1 : page - 1);
    }

    return (
        <section
            className="px-4 pb-8 pt-2 text-left sm:px-6 lg:px-8"
            aria-label={`${title} list`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <header className="mx-auto max-w-7xl pb-1 pt-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Multiverse index</p>
                <h1 className="mt-2 text-2xl font-extrabold tracking-normal text-slate-950 dark:text-white sm:text-3xl">{title}</h1>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">{description}</p>
            </header>
            <div className="mx-auto mt-6 grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {children}
            </div>
            <Pagination page={page} totalPages={pages} />
        </section>
    );
}

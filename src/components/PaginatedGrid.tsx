import { ReactNode, TouchEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "./Pagination";

const swipeDistanceThreshold = 60;
const swipeVerticalTolerance = 75;
const maxDragOffset = 58;

export default function PaginatedGrid({
    pages,
    title,
    description,
    filterPanel,
    isEmpty = false,
    emptyState,
    children,
}: {
    pages: number,
    title: string,
    description: string,
    filterPanel?: ReactNode,
    isEmpty?: boolean,
    emptyState?: ReactNode,
    children: ReactNode,
}) {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const swipeStart = useRef<{ x: number, y: number } | null>(null);
    const previousPage = useRef<number | null>(null);
    const [dragOffset, setDragOffset] = useState(0);
    const [transitionDirection, setTransitionDirection] = useState<"next" | "previous" | null>(null);
    const page = Number.parseInt(params.get("page") || "1", 10);
    const canGoPrevious = page > 1;
    const canGoNext = page < pages;

    useEffect(() => {
        if (previousPage.current === null) {
            previousPage.current = page;
            return;
        }

        if (previousPage.current === page) {
            return;
        }

        setTransitionDirection(page > previousPage.current ? "next" : "previous");
        previousPage.current = page;

        const timeout = window.setTimeout(() => {
            setTransitionDirection(null);
        }, 240);

        return () => window.clearTimeout(timeout);
    }, [page]);

    function goToPage(nextPage: number) {
        const clampedPage = Math.min(Math.max(nextPage, 1), pages);
        if (clampedPage !== page) {
            const nextParams = new URLSearchParams(params);
            nextParams.set("page", String(clampedPage));
            navigate(`?${nextParams.toString()}`);
        }
    }

    function handleTouchStart(event: TouchEvent<HTMLElement>) {
        const touch = event.touches[0];
        if (!touch) {
            return;
        }

        setTransitionDirection(null);
        setDragOffset(0);
        swipeStart.current = { x: touch.clientX, y: touch.clientY };
    }

    function handleTouchMove(event: TouchEvent<HTMLElement>) {
        const start = swipeStart.current;
        const touch = event.touches[0];
        if (!start || !touch) {
            return;
        }

        const deltaX = touch.clientX - start.x;
        const deltaY = touch.clientY - start.y;

        if (Math.abs(deltaX) <= Math.abs(deltaY)) {
            setDragOffset(0);
            return;
        }

        const isBlockedEdgeSwipe = (deltaX > 0 && !canGoPrevious) || (deltaX < 0 && !canGoNext);
        if (isBlockedEdgeSwipe) {
            setDragOffset(0);
            return;
        }

        const resistedOffset = Math.max(Math.min(deltaX * 0.34, maxDragOffset), -maxDragOffset);
        setDragOffset(resistedOffset);
    }

    function handleTouchEnd(event: TouchEvent<HTMLElement>) {
        const start = swipeStart.current;
        const touch = event.changedTouches[0];
        swipeStart.current = null;
        setDragOffset(0);

        if (!start || !touch) {
            return;
        }

        const deltaX = touch.clientX - start.x;
        const deltaY = touch.clientY - start.y;
        const isHorizontalSwipe = Math.abs(deltaX) >= swipeDistanceThreshold && Math.abs(deltaY) <= swipeVerticalTolerance && Math.abs(deltaX) > Math.abs(deltaY);

        if (!isHorizontalSwipe) {
            return;
        }

        if (deltaX < 0 && canGoNext) {
            goToPage(page + 1);
        } else if (deltaX > 0 && canGoPrevious) {
            goToPage(page - 1);
        }
    }

    return (
        <section
            className="px-4 pb-8 pt-2 text-left sm:px-6 lg:px-8"
            aria-label={`${title} list`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <header className="mx-auto max-w-7xl pb-1 pt-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Multiverse index</p>
                <h1 className="mt-2 text-2xl font-extrabold tracking-normal text-slate-950 dark:text-white sm:text-3xl">{title}</h1>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">{description}</p>
            </header>
            <div className={`mx-auto mt-6 grid max-w-7xl gap-5 ${filterPanel ? "md:grid-cols-[16rem_1fr] md:items-start" : ""}`}>
                {filterPanel}
                <div className="min-w-0">
                    {isEmpty ? (
                        emptyState
                    ) : (
                        <div
                            className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${filterPanel ? "lg:grid-cols-3" : "md:grid-cols-3 lg:grid-cols-4"} ${transitionDirection === "next" ? "page-transition-next" : ""} ${transitionDirection === "previous" ? "page-transition-previous" : ""}`}
                            data-testid="paginated-grid-cards"
                            style={{
                                opacity: dragOffset === 0 ? undefined : 0.9,
                                transform: dragOffset === 0 ? undefined : `translateX(${dragOffset}px)`,
                                transition: dragOffset === 0 ? undefined : "none",
                            }}
                        >
                            {children}
                        </div>
                    )}
                </div>
            </div>
            {isEmpty ? null : <Pagination page={page} totalPages={pages} />}
        </section>
    );
}

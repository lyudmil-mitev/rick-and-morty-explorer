import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, MouseEvent, PointerEvent } from "react";
import { splashBackgroundImage } from "../components/backgroundImages";
import { getEpisodeSeasonImage, getLocationImage } from "../media";
import { cx } from "../styles/ui";
import SchwiftyTitle from "../components/SchwiftyTitle";

type DestinationId = "characters" | "locations" | "episodes";
type CarouselSlot = "left" | "active" | "right";
type Theme = "light" | "dark";
type DragDirection = "previous" | "next" | "none";
type RootOutletContext = {
    theme: Theme;
}
type BubbleImage = {
    src: string;
    label: string;
}

type Destination = {
    id: DestinationId;
    label: string;
    eyebrow: string;
    description: string;
    path: string;
    images: BubbleImage[];
}

type DragState = {
    pointerId: number;
    startX: number;
    startY: number;
    hasMovedHorizontally: boolean;
}

function assetUrl(path: string) {
    return `${import.meta.env.BASE_URL}${path}`;
}

const swipeMinDistance = 42;
const swipeAxisLockDistance = 12;
const dragResistanceMax = 130;

const splashLayoutCss = `
.splash-title.schwifty {
  font-size: 8.25rem;
}

.splash-carousel-stage {
  --splash-drag-offset: 0px;
  --splash-wrap-drag-offset: 0px;
}

.splash-carousel[data-dragging="true"] .splash-portal-card {
  transition:
    opacity 180ms ease,
    filter 180ms ease;
}

.splash-portal-card[data-slot="active"] {
  transform: translate3d(calc(-50% + var(--splash-drag-offset)), 0, 0) scale(1);
}

.splash-portal-card[data-slot="left"] {
  transform: translate3d(calc(-50% - clamp(8rem, 30vw, 21rem)), 2.25rem, 0) scale(0.82);
}

.splash-portal-card[data-slot="right"] {
  transform: translate3d(calc(-50% + clamp(8rem, 30vw, 21rem)), 2.25rem, 0) scale(0.82);
}

.splash-carousel[data-drag-direction="previous"] .splash-portal-card[data-slot="left"],
.splash-carousel[data-drag-direction="next"] .splash-portal-card[data-slot="right"] {
  transform: translate3d(calc(var(--splash-card-resting-x) + var(--splash-drag-offset)), 2.25rem, 0) scale(0.82);
}

.splash-carousel[data-drag-direction="previous"] .splash-portal-card[data-slot="right"],
.splash-carousel[data-drag-direction="next"] .splash-portal-card[data-slot="left"] {
  transform: translate3d(calc(var(--splash-card-resting-x) + var(--splash-wrap-drag-offset)), 2.25rem, 0) scale(0.82);
}

.splash-portal-card[data-slot="left"] {
  --splash-card-resting-x: calc(-50% - clamp(8rem, 30vw, 21rem));
}

.splash-portal-card[data-slot="right"] {
  --splash-card-resting-x: calc(-50% + clamp(8rem, 30vw, 21rem));
}

.splash-card-cta {
  position: relative;
  z-index: 4;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  overflow: hidden;
  border-radius: 0.375rem;
  background: rgba(165, 243, 252, 0.4);
  padding: 0.72rem 1.35rem;
  color: #334155;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.025em;
  line-height: 1;
  text-decoration: none;
  box-shadow: 0 0.8rem 1.6rem rgba(8, 145, 178, 0.12);
  transition: background-color 200ms ease, color 200ms ease, text-shadow 200ms ease, transform 200ms ease, box-shadow 200ms ease;
}

.splash-card-cta:hover,
.splash-card-cta:focus-visible {
  background: rgba(165, 243, 252, 0.62);
  color: #0f172a;
  text-shadow: 0 0 8px rgba(183, 255, 68, 0.65);
  transform: translateY(-1px);
}

.splash-card-cta:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px #a3e635, 0 0 0 4px #eef2ed, 0 0.8rem 1.6rem rgba(8, 145, 178, 0.12);
}

:root.dark .splash-card-cta {
  background: rgba(103, 232, 249, 0.1);
  color: #f1f5f9;
  box-shadow: 0 0.8rem 1.6rem rgba(190, 242, 100, 0.1);
}

:root.dark .splash-card-cta:hover,
:root.dark .splash-card-cta:focus-visible {
  background: rgba(103, 232, 249, 0.16);
  color: #ffffff;
  text-shadow: 0 0 8px rgba(183, 255, 68, 0.85);
}

:root.dark .splash-card-cta:focus-visible {
  box-shadow: 0 0 0 2px #bef264, 0 0 0 4px #020617, 0 0.8rem 1.6rem rgba(190, 242, 100, 0.1);
}

@media (max-width: 760px) {
  .splash-title.schwifty {
    font-size: 3rem;
  }

  .splash-carousel {
    overflow: visible;
  }

  .splash-carousel-stage {
    margin-inline: -1rem;
    overflow: visible;
  }

  .splash-portal-card {
    width: min(72vw, 20rem);
  }

  .splash-portal-card[data-slot="left"] {
    --splash-card-resting-x: calc(-50% - clamp(7rem, 24vw, 8.5rem));
    transform: translate3d(var(--splash-card-resting-x), 2.8rem, 0) scale(0.72);
  }

  .splash-portal-card[data-slot="right"] {
    --splash-card-resting-x: calc(-50% + clamp(7rem, 24vw, 8.5rem));
    transform: translate3d(var(--splash-card-resting-x), 2.8rem, 0) scale(0.72);
  }

  .splash-carousel[data-drag-direction="previous"] .splash-portal-card[data-slot="left"],
  .splash-carousel[data-drag-direction="next"] .splash-portal-card[data-slot="right"] {
    transform: translate3d(calc(var(--splash-card-resting-x) + var(--splash-drag-offset)), 2.8rem, 0) scale(0.72);
  }

  .splash-carousel[data-drag-direction="previous"] .splash-portal-card[data-slot="right"],
  .splash-carousel[data-drag-direction="next"] .splash-portal-card[data-slot="left"] {
    transform: translate3d(calc(var(--splash-card-resting-x) + var(--splash-wrap-drag-offset)), 2.8rem, 0) scale(0.72);
  }

  .splash-carousel-controls {
    width: min(calc(72vw - 1.5rem), 18.5rem);
  }
}

@media (min-width: 480px) and (max-width: 760px) {
  .splash-title.schwifty {
    font-size: 3.75rem;
  }
}

@media (min-width: 761px) and (max-width: 1023px) {
  .splash-title.schwifty {
    font-size: 6rem;
  }
}
`;

const characterFiles = [
    ["001-rick-sanchez.jpeg", "Rick Sanchez"],
    ["002-morty-smith.jpeg", "Morty Smith"],
    ["003-summer-smith.jpeg", "Summer Smith"],
    ["004-beth-smith.jpeg", "Beth Smith"],
    ["005-jerry-smith.jpeg", "Jerry Smith"],
    ["006-abadango-cluster-princess.jpeg", "Abadango Cluster Princess"],
    ["007-abradolf-lincler.jpeg", "Abradolf Lincler"],
    ["008-adjudicator-rick.jpeg", "Adjudicator Rick"],
    ["009-agency-director.jpeg", "Agency Director"],
    ["010-alan-rails.jpeg", "Alan Rails"],
    ["011-albert-einstein.jpeg", "Albert Einstein"],
    ["012-alexander.jpeg", "Alexander"],
    ["013-alien-googah.jpeg", "Alien Googah"],
    ["014-alien-morty.jpeg", "Alien Morty"],
    ["015-alien-rick.jpeg", "Alien Rick"],
    ["016-amish-cyborg.jpeg", "Amish Cyborg"],
    ["017-annie.jpeg", "Annie"],
    ["018-antenna-morty.jpeg", "Antenna Morty"],
    ["019-antenna-rick.jpeg", "Antenna Rick"],
    ["020-ants-in-my-eyes-johnson.jpeg", "Ants in my Eyes Johnson"],
] as const;

function characterImage(fileName: string, label: string): BubbleImage {
    return {
        src: assetUrl(`data/rick-and-morty/images/characters/${fileName}`),
        label,
    };
}

function repeatImages(images: BubbleImage[], count: number) {
    return Array.from({ length: count }, (_, index) => images[index % images.length]);
}

const characterImages = characterFiles.map(([fileName, label]) => characterImage(fileName, label));
const firstPageCharacterImages = characterImages.slice(0, 20);

const locationBaseImages: BubbleImage[] = [
    { src: getLocationImage("Planet"), label: "Planet location art" },
    { src: getLocationImage("Dimension"), label: "Portal location art" },
    { src: getLocationImage("Cluster"), label: "Cluster location art" },
    { src: getLocationImage("Microverse"), label: "Microverse location art" },
    { src: getLocationImage("Resort"), label: "Resort location art" },
    { src: getLocationImage("TV"), label: "TV location art" },
];

const episodeBaseImages: BubbleImage[] = [1, 2, 3, 4, 5, 6].map((season) => ({
    src: getEpisodeSeasonImage(`S${String(season).padStart(2, "0")}E01`),
    label: `Season ${season} poster`,
}));

const locationImages = repeatImages(locationBaseImages, firstPageCharacterImages.length);
const episodeImages = repeatImages(episodeBaseImages, firstPageCharacterImages.length);

const destinations: Destination[] = [
    {
        id: "characters",
        label: "Characters",
        eyebrow: "Identity files",
        description: "Variants, family members, villains, and side characters with status, origin, and episode trails.",
        path: "/characters",
        images: firstPageCharacterImages,
    },
    {
        id: "locations",
        label: "Locations",
        eyebrow: "Dimensional map",
        description: "Planets, stations, timelines, and dimensions where the damage happened.",
        path: "/locations",
        images: locationImages,
    },
    {
        id: "episodes",
        label: "Episodes",
        eyebrow: "Broadcast log",
        description: "Season-by-season broadcasts with synopses and everyone caught in the blast radius.",
        path: "/episodes",
        images: episodeImages,
    },
];

function getSlot(index: number, activeIndex: number): CarouselSlot {
    const rawOffset = index - activeIndex;
    const offset = rawOffset === 2 ? -1 : rawOffset === -2 ? 1 : rawOffset;

    if (offset < 0) {
        return "left";
    }

    if (offset > 0) {
        return "right";
    }

    return "active";
}

function clampDragOffset(deltaX: number) {
    return Math.max(-dragResistanceMax, Math.min(dragResistanceMax, deltaX));
}

function releasePointerCaptureSafely(element: HTMLDivElement, pointerId: number) {
    if (typeof element.hasPointerCapture === "function" && element.hasPointerCapture(pointerId)) {
        element.releasePointerCapture?.(pointerId);
    }
}

export default function HomeSplash() {
    const outletContext = useOutletContext<Partial<RootOutletContext> | null>();
    const navigate = useNavigate();
    const theme = outletContext?.theme ?? "dark";
    const [activeIndex, setActiveIndex] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    const dragState = useRef<DragState | null>(null);
    const didSwipe = useRef(false);

    function showPrevious() {
        setActiveIndex((value) => (value - 1 + destinations.length) % destinations.length);
    }

    function showNext() {
        setActiveIndex((value) => (value + 1) % destinations.length);
    }

    function handleCarouselPointerDown(event: PointerEvent<HTMLDivElement>) {
        if (event.target instanceof Element && event.target.closest("button, a")) {
            return;
        }

        event.currentTarget.setPointerCapture?.(event.pointerId);
        didSwipe.current = false;
        setDragOffset(0);
        dragState.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            hasMovedHorizontally: false,
        };
    }

    function handleCarouselPointerMove(event: PointerEvent<HTMLDivElement>) {
        const state = dragState.current;
        if (state === null || state.pointerId !== event.pointerId) {
            return;
        }

        const deltaX = event.clientX - state.startX;
        const deltaY = event.clientY - state.startY;
        const absoluteDeltaX = Math.abs(deltaX);
        const absoluteDeltaY = Math.abs(deltaY);

        if (
            !state.hasMovedHorizontally &&
            absoluteDeltaX > swipeAxisLockDistance &&
            absoluteDeltaX > absoluteDeltaY
        ) {
            state.hasMovedHorizontally = true;
            didSwipe.current = true;
        }

        if (state.hasMovedHorizontally) {
            setDragOffset(clampDragOffset(deltaX));
        }
    }

    function handleCarouselPointerUp(event: PointerEvent<HTMLDivElement>) {
        const state = dragState.current;
        dragState.current = null;

        if (state === null || state.pointerId !== event.pointerId) {
            return;
        }

        releasePointerCaptureSafely(event.currentTarget, event.pointerId);

        const deltaX = event.clientX - state.startX;
        const deltaY = event.clientY - state.startY;
        const absoluteDeltaX = Math.abs(deltaX);
        const absoluteDeltaY = Math.abs(deltaY);
        setDragOffset(0);

        if (absoluteDeltaX < swipeMinDistance || absoluteDeltaX <= absoluteDeltaY) {
            return;
        }

        didSwipe.current = true;
        if (deltaX < 0) {
            showNext();
        } else {
            showPrevious();
        }
    }

    function handleCarouselPointerCancel(event: PointerEvent<HTMLDivElement>) {
        const state = dragState.current;
        dragState.current = null;
        didSwipe.current = false;
        setDragOffset(0);

        if (state !== null && state.pointerId === event.pointerId) {
            releasePointerCaptureSafely(event.currentTarget, event.pointerId);
        }
    }

    function handleCardClick(event: MouseEvent<HTMLDivElement>, index: number) {
        if (event.target instanceof Element && event.target.closest("a")) {
            return;
        }

        if (didSwipe.current) {
            event.preventDefault();
            didSwipe.current = false;
            return;
        }

        if (index !== activeIndex) {
            setActiveIndex(index);
            return;
        }

        navigate(destinations[index].path);
    }

    function handleCardKeyDown(event: KeyboardEvent<HTMLDivElement>, index: number) {
        if (event.target !== event.currentTarget) {
            return;
        }

        if (index !== activeIndex && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            setActiveIndex(index);
            return;
        }

        if (index === activeIndex && event.key === "Enter") {
            event.preventDefault();
            navigate(destinations[index].path);
        }
    }

    function handleNavigationKeyDown(event: KeyboardEvent) {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            showPrevious();
        } else if (event.key === "ArrowRight") {
            event.preventDefault();
            showNext();
        } else if (event.key === "Enter") {
            event.preventDefault();
            navigate(destinations[activeIndex].path);
        }
    }

    function handleCarouselKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        if (event.target !== event.currentTarget) {
            return;
        }

        handleNavigationKeyDown(event);
    }

    useEffect(() => {
        function handleDocumentKeyDown(event: globalThis.KeyboardEvent) {
            const target = event.target;
            if (
                target instanceof HTMLElement &&
                target.closest(".splash-carousel, a, button, input, select, textarea, [contenteditable='true']")
            ) {
                return;
            }

            if (event.key === "ArrowLeft") {
                event.preventDefault();
                showPrevious();
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                showNext();
            } else if (event.key === "Enter") {
                event.preventDefault();
                navigate(destinations[activeIndex].path);
            }
        }

        document.addEventListener("keydown", handleDocumentKeyDown);
        return () => document.removeEventListener("keydown", handleDocumentKeyDown);
    }, [activeIndex, navigate]);

    const splashStyle: CSSProperties = {
        backgroundImage: splashBackgroundImage[theme],
    };
    const carouselDragStyle = {
        "--splash-drag-offset": `${dragOffset}px`,
        "--splash-wrap-drag-offset": `${-2 * dragOffset}px`,
    } as CSSProperties;
    const dragDirection: DragDirection = dragOffset < 0 ? "next" : dragOffset > 0 ? "previous" : "none";

    return (
        <section
            className="splash-page relative isolate min-h-[calc(100vh-4.5rem)] overflow-hidden px-4 pb-12 pt-20 text-center text-slate-950 dark:text-white sm:px-6 sm:pb-16 sm:pt-20 lg:px-8"
            style={splashStyle}
        >
            <style>{splashLayoutCss}</style>
            <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center">
                <SchwiftyTitle className="splash-title" revealOnMount />

                <div
                    className="splash-carousel mt-8 w-full touch-pan-y select-none sm:mt-10"
                    role="region"
                    aria-label="Portal destinations"
                    tabIndex={0}
                    data-dragging={dragOffset !== 0 ? "true" : "false"}
                    data-drag-direction={dragDirection}
                    onKeyDown={handleCarouselKeyDown}
                    onPointerDown={handleCarouselPointerDown}
                    onPointerMove={handleCarouselPointerMove}
                    onPointerUp={handleCarouselPointerUp}
                    onPointerCancel={handleCarouselPointerCancel}
                >
                    <div className="splash-carousel-stage" style={carouselDragStyle}>
                        {destinations.map((destination, index) => {
                            const slot = getSlot(index, activeIndex);
                            const isActive = slot === "active";

                            return (
                                <div
                                    key={destination.id}
                                    className={cx(
                                        "splash-portal-card",
                                        `splash-portal-card--${destination.id}`,
                                    )}
                                    data-slot={slot}
                                    data-active={isActive ? "true" : "false"}
                                    role={isActive ? "link" : "button"}
                                    tabIndex={0}
                                    aria-label={isActive ? `Open ${destination.label} portal` : `Show ${destination.label} portal`}
                                    onClick={(event) => handleCardClick(event, index)}
                                    onKeyDown={(event) => handleCardKeyDown(event, index)}
                                >
                                    <article className="splash-portal-card-inner portal-hover" aria-labelledby={`splash-card-title-${destination.id}`}>
                                        <BubbleCloud images={destination.images} label={`${destination.label} preview images`} />
                                        <div className="splash-card-content">
                                            <h3 id={`splash-card-title-${destination.id}`} className="text-2xl font-extrabold text-slate-950 dark:text-white sm:text-3xl">{destination.label}</h3>
                                            <p className="mt-1 text-xs font-black uppercase tracking-wide text-slate-600 dark:text-slate-300">{destination.eyebrow}</p>
                                            <p className="splash-card-description mt-4 text-sm leading-6 text-slate-700 dark:text-slate-200 sm:text-base">{destination.description}</p>
                                            <Link
                                                className="splash-card-cta"
                                                to={destination.path}
                                                aria-label={`Explore ${destination.label}`}
                                                onClick={(event) => event.stopPropagation()}
                                            >
                                                Explore {destination.label}
                                            </Link>
                                        </div>
                                    </article>
                                </div>
                            );
                        })}
                        <div className="splash-carousel-controls">
                            <button type="button" className="splash-carousel-chevron splash-carousel-chevron--previous" onClick={showPrevious} aria-label="Show previous portal">
                                <span aria-hidden="true">‹</span>
                            </button>
                            <span className="sr-only" role="status" aria-live="polite">
                                {`Active portal: ${destinations[activeIndex].label}`}
                            </span>
                            <button type="button" className="splash-carousel-chevron splash-carousel-chevron--next" onClick={showNext} aria-label="Show next portal">
                                <span aria-hidden="true">›</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function BubbleCloud({ images, label }: { images: BubbleImage[]; label: string }) {
    return (
        <div className="splash-card-art" role="img" aria-label={label}>
            {images.map((image, index) => (
                <span key={`${image.src}-${index}`} className="splash-art-bubble">
                    <img src={image.src} alt="" loading="lazy" />
                </span>
            ))}
        </div>
    );
}

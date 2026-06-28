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

function assetUrl(path: string) {
    return `${import.meta.env.BASE_URL}${path}`;
}

const mobileSplashLayoutCss = `
@media (max-width: 760px) {
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
    transform: translate3d(calc(-50% - clamp(7rem, 24vw, 8.5rem)), 2.8rem, 0) scale(0.72);
  }

  .splash-portal-card[data-slot="right"] {
    transform: translate3d(calc(-50% + clamp(7rem, 24vw, 8.5rem)), 2.8rem, 0) scale(0.72);
  }

  .splash-carousel-controls {
    width: min(calc(72vw - 1.5rem), 18.5rem);
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

export default function HomeSplash() {
    const outletContext = useOutletContext<Partial<RootOutletContext> | null>();
    const navigate = useNavigate();
    const theme = outletContext?.theme ?? "dark";
    const [activeIndex, setActiveIndex] = useState(0);
    const dragStartX = useRef<number | null>(null);
    const didSwipe = useRef(false);

    function showPrevious() {
        setActiveIndex((value) => (value - 1 + destinations.length) % destinations.length);
    }

    function showNext() {
        setActiveIndex((value) => (value + 1) % destinations.length);
    }

    function handleCarouselPointerDown(event: PointerEvent<HTMLDivElement>) {
        if (event.target instanceof Element && event.target.closest("button")) {
            return;
        }

        didSwipe.current = false;
        dragStartX.current = event.clientX;
    }

    function handleCarouselPointerUp(event: PointerEvent<HTMLDivElement>) {
        const startX = dragStartX.current;
        dragStartX.current = null;

        if (startX === null) {
            return;
        }

        const deltaX = event.clientX - startX;
        if (Math.abs(deltaX) < 48) {
            return;
        }

        didSwipe.current = true;
        if (deltaX < 0) {
            showNext();
        } else {
            showPrevious();
        }
    }

    function handleCarouselPointerCancel() {
        dragStartX.current = null;
        didSwipe.current = false;
    }

    function handleCardClick(event: MouseEvent<HTMLAnchorElement>, index: number) {
        if (didSwipe.current) {
            event.preventDefault();
            didSwipe.current = false;
            return;
        }

        if (index !== activeIndex) {
            event.preventDefault();
            setActiveIndex(index);
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

    return (
        <section
            className="splash-page relative isolate min-h-[calc(100vh-4.5rem)] overflow-hidden px-4 pb-12 pt-20 text-center text-slate-950 dark:text-white sm:px-6 sm:pb-16 sm:pt-20 lg:px-8"
            style={splashStyle}
        >
            <style>{mobileSplashLayoutCss}</style>
            <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center">
                <SchwiftyTitle className="splash-title" revealOnMount />

                <div
                    className="splash-carousel mt-8 w-full sm:mt-10"
                    role="region"
                    aria-label="Portal destinations"
                    tabIndex={0}
                    onKeyDown={handleCarouselKeyDown}
                    onPointerDown={handleCarouselPointerDown}
                    onPointerUp={handleCarouselPointerUp}
                    onPointerCancel={handleCarouselPointerCancel}
                >
                    <div className="splash-carousel-stage">
                        {destinations.map((destination, index) => {
                            const slot = getSlot(index, activeIndex);
                            const isActive = slot === "active";

                            return (
                                <Link
                                    key={destination.id}
                                    to={destination.path}
                                    className={cx(
                                        "splash-portal-card",
                                        `splash-portal-card--${destination.id}`,
                                    )}
                                    data-slot={slot}
                                    data-active={isActive ? "true" : "false"}
                                    aria-label={`${destination.label}: ${destination.description}`}
                                    onClick={(event) => handleCardClick(event, index)}
                                >
                                    <article className="splash-portal-card-inner portal-hover">
                                        <BubbleCloud images={destination.images} label={`${destination.label} preview images`} />
                                        <div className="splash-card-content">
                                            <p className="text-xs font-black uppercase tracking-wide text-slate-600 dark:text-slate-300">{destination.eyebrow}</p>
                                            <h3 className="mt-2 text-2xl font-extrabold text-slate-950 dark:text-white sm:text-3xl">{destination.label}</h3>
                                            <p className="splash-card-description mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200 sm:text-base">{destination.description}</p>
                                        </div>
                                    </article>
                                </Link>
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

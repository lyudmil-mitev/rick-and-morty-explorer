import { Link, useLoaderData } from "react-router-dom";
import { Episode } from "rickmortyapi";
import EmptyResults from "../components/EmptyResults";
import EpisodeCard from "../components/EpisodeCard";
import FilterPanel, { FilterField } from "../components/FilterPanel";
import PaginatedGrid from "../components/PaginatedGrid";

const episodeFilters: FilterField[] = [
    { name: "name", label: "Name", control: "text", placeholder: "Pilot" },
    {
        name: "episode",
        label: "Season",
        control: "select",
        options: [
            { label: "Season 1", value: "S01" },
            { label: "Season 2", value: "S02" },
            { label: "Season 3", value: "S03" },
            { label: "Season 4", value: "S04" },
            { label: "Season 5", value: "S05" },
            { label: "Season 6", value: "S06" },
        ],
    },
];

export default function Episodes() {
    const { episodes, pages } = useLoaderData() as { episodes: Episode[], pages: number };

    return (
        <PaginatedGrid
            pages={pages}
            title="Episodes"
            description="Jump through broadcasts, season arcs, and whatever passed for continuity this week."
            filterPanel={<FilterPanel fields={episodeFilters} />}
            isEmpty={episodes.length === 0}
            emptyState={<EmptyResults />}
        >
            {episodes.map((episode) => (
                <Link key={episode.id} to={`/episodes/${episode.id}`}>
                    <EpisodeCard episode={episode} />
                </Link>
            ))}
        </PaginatedGrid>
    );
}

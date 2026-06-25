import { Link, useLoaderData } from "react-router-dom";
import { Episode } from "rickmortyapi";
import EpisodeCard from "../components/EpisodeCard";
import PaginatedGrid from "../components/PaginatedGrid";

export default function Episodes() {
    const { episodes, pages } = useLoaderData() as { episodes: Episode[], pages: number };

    return (
        <PaginatedGrid pages={pages} title="Episodes" description="Jump through broadcasts, season arcs, and whatever passed for continuity this week.">
            {episodes.map((episode) => (
                <Link key={episode.id} to={`/episodes/${episode.id}`}>
                    <EpisodeCard episode={episode} />
                </Link>
            ))}
        </PaginatedGrid>
    );
}

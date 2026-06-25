import { Link, useLoaderData } from "react-router-dom";
import { Episode } from "rickmortyapi";
import EpisodeCard from "../components/EpisodeCard";
import PaginatedGrid from "../components/PaginatedGrid";

export default function Episodes() {
    const { episodes, pages } = useLoaderData() as { episodes: Episode[], pages: number };

    return (
        <PaginatedGrid pages={pages}>
            {episodes.map((episode) => (
                <Link key={episode.id} to={`/episodes/${episode.id}`}>
                    <EpisodeCard episode={episode} />
                </Link>
            ))}
        </PaginatedGrid>
    );
}

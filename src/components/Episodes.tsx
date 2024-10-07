import { useLoaderData, useSearchParams } from "react-router-dom";
import { Episode } from "rickmortyapi";
import EpisodeDetail from "./EpisodeDetail";
import Pagination from "./Pagination";

export default function Episodes() {
    const [params, ] = useSearchParams()
    const page = parseInt(params.get('page') || '1');
    const { episodes, pages } = useLoaderData() as { episodes: Episode[], pages: number };

    return (
        <section className="p-4 text-left">
            <Pagination page={page} totalPages={pages} />
            {episodes.map((episode) => (
                <EpisodeDetail key={episode.id} episode={episode} />
            ))}
        </section>
    );
}
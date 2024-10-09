import { Link, useLoaderData, useSearchParams } from "react-router-dom";
import { Episode } from "rickmortyapi";
import EpisodeCard from "../components/EpisodeCard";
import Pagination from "../components/Pagination";

export default function Episodes() {
    const [params, ] = useSearchParams()
    const page = parseInt(params.get('page') || '1');
    const { episodes, pages } = useLoaderData() as { episodes: Episode[], pages: number };

    return (
        <section className="p-4 text-left">
            <Pagination page={page} totalPages={pages} />
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {episodes.map((episode) => (
                <Link key={episode.id} to={`/episodes/${episode.id}`}>
                    <EpisodeCard key={episode.id} episode={episode} />
                </Link>
            ))}
            </div>
        </section>
    );
}
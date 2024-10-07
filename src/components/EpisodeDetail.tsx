import { useLoaderData } from "react-router-dom";
import { Episode } from "rickmortyapi";

export default function EpisodeDetail({ episode }: { episode?: Episode }) {
    const ep = episode || useLoaderData() as Episode;
    return (
        <section className="p-4 text-left">
            <div className="flex gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{ep.episode}: {ep.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {ep.air_date}
                    </p>
                    {ep.characters.length} characters
                </div>
            </div>
        </section>
    );
}
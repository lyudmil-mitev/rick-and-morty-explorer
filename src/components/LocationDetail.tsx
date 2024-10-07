import { useLoaderData } from "react-router-dom";
import { Location } from "rickmortyapi";

export default function LocationDetail({ location }: { location?: Location }) {
    const place = location || useLoaderData() as Location;
    return (
        <section className="p-4 text-left">
            <div className="flex gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{place.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {place.type} - {place.dimension}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                        {place.residents.length} residents
                    </p>
                </div>
            </div>
        </section>
    );
}
import { useLoaderData, useSearchParams } from "react-router-dom";
import { Location } from "rickmortyapi";
import LocationDetail from "./LocationDetail";
import Pagination from "./Pagination";

export default function Locations() {
    const [params, ] = useSearchParams()
    const page = parseInt(params.get('page') || '1');
    const { locations, pages } = useLoaderData() as { locations: Location[], pages: number };

    return (
        <section className="p-4 text-left">
            <Pagination page={page} totalPages={pages} />
            {locations.map((location) => (
                <LocationDetail key={location.id} location={location} />
            ))}
        </section>
    );
}
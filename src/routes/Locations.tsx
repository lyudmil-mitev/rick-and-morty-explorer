import { Link, useLoaderData, useSearchParams } from "react-router-dom";
import { Location } from "rickmortyapi";
import LocationCard from "../components/LocationCard";
import Pagination from "../components/Pagination";

export default function Locations() {
    const [params, ] = useSearchParams()
    const page = parseInt(params.get('page') || '1');
    const { locations, pages } = useLoaderData() as { locations: Location[], pages: number };

    return (
        <section className="p-4 text-left">
            <Pagination page={page} totalPages={pages} />
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {locations.map((location) => (
                <Link key={location.id} to={`/locations/${location.id}`}>
                    <LocationCard key={location.id} location={location} />
                </Link>
            ))}
            </div>
        </section>
    );
}
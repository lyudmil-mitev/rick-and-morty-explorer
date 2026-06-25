import { Link, useLoaderData } from "react-router-dom";
import { Location } from "rickmortyapi";
import LocationCard from "../components/LocationCard";
import PaginatedGrid from "../components/PaginatedGrid";

export default function Locations() {
    const { locations, pages } = useLoaderData() as { locations: Location[], pages: number };

    return (
        <PaginatedGrid pages={pages} title="Locations" description="Track planets, stations, dimensions, and the places everyone probably should have avoided.">
            {locations.map((location) => (
                <Link key={location.id} to={`/locations/${location.id}`}>
                    <LocationCard location={location} />
                </Link>
            ))}
        </PaginatedGrid>
    );
}

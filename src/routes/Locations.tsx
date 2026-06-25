import { Link, useLoaderData } from "react-router-dom";
import { Location } from "rickmortyapi";
import EmptyResults from "../components/EmptyResults";
import FilterPanel, { FilterField } from "../components/FilterPanel";
import LocationCard from "../components/LocationCard";
import PaginatedGrid from "../components/PaginatedGrid";
import { locationDimensionOptions, locationTypeOptions } from "../filterOptions";

const locationFilters: FilterField[] = [
    { name: "name", label: "Name", control: "text", placeholder: "Earth" },
    { name: "type", label: "Type", control: "select", options: locationTypeOptions },
    { name: "dimension", label: "Dimension", control: "select", options: locationDimensionOptions },
];

export default function Locations() {
    const { locations, pages } = useLoaderData() as { locations: Location[], pages: number };

    return (
        <PaginatedGrid
            pages={pages}
            title="Locations"
            description="Track planets, stations, dimensions, and the places everyone probably should have avoided."
            filterPanel={<FilterPanel fields={locationFilters} />}
            isEmpty={locations.length === 0}
            emptyState={<EmptyResults />}
        >
            {locations.map((location) => (
                <Link key={location.id} to={`/locations/${location.id}`}>
                    <LocationCard location={location} />
                </Link>
            ))}
        </PaginatedGrid>
    );
}

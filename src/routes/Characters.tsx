import type { Character } from '../rickmorty';
import { Link, useLoaderData } from 'react-router-dom';
import CharacterCard from '../components/CharacterCard';
import EmptyResults from '../components/EmptyResults';
import FilterPanel, { FilterField } from '../components/FilterPanel';
import PaginatedGrid from '../components/PaginatedGrid';
import { characterSpeciesOptions, characterTypeOptions } from '../filterOptions';

const characterFilters: FilterField[] = [
    { name: "name", label: "Name", control: "text", placeholder: "Rick" },
    {
        name: "status",
        label: "Status",
        control: "select",
        options: [
            { label: "Alive", value: "alive" },
            { label: "Dead", value: "dead" },
            { label: "unknown", value: "unknown" },
        ],
    },
    { name: "species", label: "Species", control: "select", options: characterSpeciesOptions },
    { name: "type", label: "Type", control: "select", options: characterTypeOptions },
    {
        name: "gender",
        label: "Gender",
        control: "select",
        options: [
            { label: "Female", value: "female" },
            { label: "Male", value: "male" },
            { label: "Genderless", value: "genderless" },
            { label: "unknown", value: "unknown" },
        ],
    },
];

export default function Characters() {
    const { characters, pages } = useLoaderData() as { characters: Character[], pages: number };

    return (
        <PaginatedGrid
            pages={pages}
            title="Characters"
            description="Browse known beings, variants, and questionable life choices across the multiverse."
            filterPanel={<FilterPanel fields={characterFilters} />}
            isEmpty={characters.length === 0}
            emptyState={<EmptyResults />}
        >
            {characters.map((character) => (
                <Link key={character.id} to={`/characters/${character.id}`}>
                    <CharacterCard character={character} />
                </Link>
            ))}
        </PaginatedGrid>
    );
};

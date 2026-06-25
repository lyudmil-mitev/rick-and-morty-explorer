import { Character } from 'rickmortyapi';
import { Link, useLoaderData } from 'react-router-dom';
import CharacterCard from '../components/CharacterCard';
import PaginatedGrid from '../components/PaginatedGrid';

export default function Characters() {
    const { characters, pages } = useLoaderData() as { characters: Character[], pages: number };

    return (
        <PaginatedGrid pages={pages} title="Characters" description="Browse known beings, variants, and questionable life choices across the multiverse.">
            {characters.map((character) => (
                <Link key={character.id} to={`/characters/${character.id}`}>
                    <CharacterCard character={character} />
                </Link>
            ))}
        </PaginatedGrid>
    );
};

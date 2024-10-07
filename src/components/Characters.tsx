import { Character } from 'rickmortyapi';
import { useLoaderData, useSearchParams } from 'react-router-dom';
import CharacterDetail from './CharacterDetail';
import Pagination from './Pagination';

export default function Characters() {
    const [params, ] = useSearchParams()
    const page = parseInt(params.get('page') || '1');
    const { characters, pages } = useLoaderData() as { characters: Character[], pages: number };

    return (
        <section className="p-4 text-left">
            <Pagination page={page} totalPages={pages} />
            {characters.map((character) => (
                <CharacterDetail key={character.id} character={character} />
            ))}
        </section>
    );
};
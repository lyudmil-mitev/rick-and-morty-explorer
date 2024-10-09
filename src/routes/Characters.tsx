import { Character } from 'rickmortyapi';
import { Link, useLoaderData, useSearchParams } from 'react-router-dom';
import CharacterDetail from '../components/CharacterDetail';
import Pagination from '../components/Pagination';

export default function Characters() {
    const [params, ] = useSearchParams()
    const page = parseInt(params.get('page') || '1');
    const { characters, pages } = useLoaderData() as { characters: Character[], pages: number };

    return (
        <section className="p-4 text-left">
            <Pagination page={page} totalPages={pages} />
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {characters.map((character) => (
                <Link key={character.id} to={`/characters/${character.id}`}>
                    <CharacterDetail key={character.id} character={character} />
                </Link>
            ))}
            </div>
        </section>
    );
};
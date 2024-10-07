import { Character } from 'rickmortyapi';
import { useLoaderData } from 'react-router-dom';

export default function CharacterDetail({ character }: { character?: Character }) {
    const char = character || useLoaderData() as Character;
    return (
        <section className="p-4 text-left">
            <div className="flex gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
                <img src={char.image} alt={char.name} className="w-24 h-24 rounded-full" />
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{char.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {char.species} from {char.origin.name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                        Status: {char.status}
                    </p>
                </div>
            </div>
        </section>
    );
}
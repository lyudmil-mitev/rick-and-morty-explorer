import { Character } from 'rickmortyapi';
import { useLoaderData } from 'react-router-dom';
import MiniCard from './MiniCard';

export default function CharacterDetail({ character }: { character?: Character }) {
    const char = character || useLoaderData() as Character;
    return (
        <MiniCard title={char.name} image={char.image} description={char.species} />
    );
}
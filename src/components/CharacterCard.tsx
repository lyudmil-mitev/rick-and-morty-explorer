import { Character } from 'rickmortyapi';
import MiniCard from './MiniCard';

export default function CharacterCard({ character }: { character: Character }) {
    return (
        <MiniCard title={character.name} image={character.image} description={character.species} />
    );
}
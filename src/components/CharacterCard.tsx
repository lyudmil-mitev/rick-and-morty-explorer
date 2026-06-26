import type { Character } from '../rickmorty';
import MiniCard from './MiniCard';

function getStatusTone(status: Character["status"]) {
    if (status === "Alive") {
        return "green";
    }

    if (status === "Dead") {
        return "red";
    }

    return "gray";
}

export default function CharacterCard({ character }: { character: Character }) {
    return (
        <MiniCard
            title={character.name}
            image={character.image}
            description={character.species}
            badge={character.status}
            badgeTone={getStatusTone(character.status)}
            variant="character"
        />
    );
}

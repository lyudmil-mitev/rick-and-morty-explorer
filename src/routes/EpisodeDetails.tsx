import DetailsLayout, { DetailFacts } from "../components/DetailsLayout";
import { Link, useLoaderData } from "react-router-dom";
import CharacterCard from "../components/CharacterCard";
import { EpisodeDetailsLoaderData } from "../loaders";
import { getEpisodeSeasonImage } from "../media";

export default function EpisodeDetails() {
    const { episode, characters } = useLoaderData() as EpisodeDetailsLoaderData;
    const image = getEpisodeSeasonImage(episode.episode);

    const DetailFacts: DetailFacts[] = [
        { type: "Episode", value: episode.episode },
        { type: "Aired", value: episode.air_date },
        { type: "Characters", value: `${episode.characters.length} characters` },
    ]

    return (
        <DetailsLayout title={episode.name} image={image} facts={DetailFacts} childrenTitle={"Characters"}>
            {characters.map((character) => (
                <Link to={`/characters/${character.id}`} key={character.id}>
                    <CharacterCard character={character} />
                </Link>
            ))}
        </DetailsLayout>
    )
}

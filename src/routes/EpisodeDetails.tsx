import DetailsLayout, { DetailFacts } from "../components/DetailsLayout";
import { Link, useLoaderData } from "react-router-dom";
import CharacterCard from "../components/CharacterCard";
import { EpisodeDetailsLoaderData } from "../loaders";

import Season1 from "/seasons/s01.jpg";
import Season2 from "/seasons/s02.jpg";
import Season3 from "/seasons/s03.jpg";
import Season4 from "/seasons/s04.jpg";
import Season5 from "/seasons/s05.jpg";
import Season6 from "/seasons/s06.jpg";

export default function EpisodeDetails() {
    const { episode, characters } = useLoaderData() as EpisodeDetailsLoaderData;
    const season = parseInt(episode.episode.slice(2, 3), 10);
    const images = [Season1, Season2, Season3, Season4, Season5, Season6];
    const image = season <= 6 ? images[season - 1] : images[0];

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

import { Character, Episode, getCharacter } from "rickmortyapi";
import DetailsLayout, { DetailFacts } from "../components/DetailsLayout";
import { Link, useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import { parseAPIId } from "../loaders";
import CharacterCard from "../components/CharacterCard";

import Season1 from "/seasons/s01.jpg";
import Season2 from "/seasons/s02.jpg";
import Season3 from "/seasons/s03.jpg";
import Season4 from "/seasons/s04.jpg";
import Season5 from "/seasons/s05.jpg";
import Season6 from "/seasons/s06.jpg";
import LoadingSpinner from "../components/LoadingSpinner";

export default function EpisodeDetails() {
    const episode = useLoaderData() as Episode;
    const season = parseInt(episode.episode.slice(2, 3), 10);
    const images = [Season1, Season2, Season3, Season4, Season5, Season6];
    const image = season <= 6 ? images[season - 1] : images[0];
    const [characters, setCharacters] = useState<Character[]>([]);

    const DetailFacts: DetailFacts[] = [
        { type: "Episode", value: episode.episode },
        { type: "Aired", value: episode.air_date },
        { type: "Characters", value: `${episode.characters.length} characters` },
    ]

    useEffect(() => {
        const characterList = episode.characters.map((episode) => parseAPIId(episode));
        getCharacter(characterList).then((data) => {
            if (data.status === 200 && data.data) {
                if (data.data.length) {
                    setCharacters(data.data)
                    return
                } else if (typeof data.data === 'object' && typeof data.data.length === "undefined") {
                    // XXX: Wrong type from client library, when there's only one result the type is Episode and not Episode[]
                    // @ts-ignore
                    setCharacters([data.data]);
                }
            }
        })
    }, [])

    return (
        <DetailsLayout title={episode.name} image={image} facts={DetailFacts} childrenTitle={"Characters"}>
            {characters.length > 0 ? characters.map((character, index) => (
                <Link to={`/characters/${character.id}`} key={index}>
                    <CharacterCard character={character} />
                </Link>
            )) : <><LoadingSpinner/> Loading...</>}
        </DetailsLayout>
    )
}
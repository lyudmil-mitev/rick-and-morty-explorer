import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import { Character, Episode, getEpisode } from "rickmortyapi";
import { parseAPIId } from "../loaders";
import EpisodeCard from "../components/EpisodeCard";
import DetailsLayout, { DetailFacts } from "../components/DetailsLayout";

export default function CharacterDetails() {
    const char = useLoaderData() as Character;
    const [episodes, setEpisodes] = React.useState<Episode[]>([]);
    const originId = parseAPIId(char.origin.url);
    const locationId = parseAPIId(char.location.url);

    const facts: DetailFacts[] = [
        { type: "Species", value: char.species },
        { type: "Status", value: char.status },
        { type: "Gender", value: char.gender },
        { type: "Origin", value: char.origin.name, url: originId !== -1 ? `/locations/${originId}` : undefined },
        { type: "Location", value: char.location.name, url: locationId !== -1 ? `/locations/${locationId}` : undefined }
    ]

    React.useEffect(() => {
        const episodeList = char.episode.map((episode) => parseAPIId(episode));
        getEpisode(episodeList).then((data) => {
            if (data.status === 200 && data.data) {
                if (data.data.length) {
                    setEpisodes(data.data)
                } else if (typeof data.data === 'object') {
                    // XXX: Wrong type from client library, when there's only one result the type is Episode and not Episode[]
                    // @ts-ignore
                    setEpisodes([data.data]);
                }
            }
        })
    }, [])

    return (
        <DetailsLayout title={char.name} image={char.image} facts={facts} childrenTitle={"Episodes"}>
            {episodes.length > 0 ? episodes.map((episode, index) => (
                <Link to={`/episodes/${episode.id}`} key={index}>
                    <EpisodeCard episode={episode} />
                </Link>
            )) : "Loading..."}
        </DetailsLayout>
    );
}
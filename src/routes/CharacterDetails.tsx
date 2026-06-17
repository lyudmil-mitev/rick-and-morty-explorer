import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import { Character, Episode } from "rickmortyapi";
import { parseAPIId } from "../loaders";
import { fetchApiResources } from "../api";
import EpisodeCard from "../components/EpisodeCard";
import DetailsLayout, { DetailFacts } from "../components/DetailsLayout";
import LoadingSpinner from "../components/LoadingSpinner";

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
        fetchApiResources<Episode>('episode', episodeList).then(setEpisodes)
    }, [char.episode])

    return (
        <DetailsLayout title={char.name} image={char.image} facts={facts} childrenTitle={"Episodes"}>
            {episodes.length > 0 ? episodes.map((episode, index) => (
                <Link to={`/episodes/${episode.id}`} key={index}>
                    <EpisodeCard episode={episode} />
                </Link>
            )) : <><LoadingSpinner/> Loading...</>}
        </DetailsLayout>
    );
}
import { Link, useLoaderData } from "react-router-dom";
import EpisodeCard from "../components/EpisodeCard";
import DetailsLayout, { DetailFacts } from "../components/DetailsLayout";
import { CharacterDetailsLoaderData } from "../loaders";
import { parseApiUrlId } from "../api";

export default function CharacterDetails() {
    const { character: char, episodes } = useLoaderData() as CharacterDetailsLoaderData;
    const originId = parseApiUrlId(char.origin.url);
    const locationId = parseApiUrlId(char.location.url);

    const facts: DetailFacts[] = [
        { type: "Species", value: char.species },
        { type: "Status", value: char.status },
        { type: "Gender", value: char.gender },
        { type: "Origin", value: char.origin.name, url: originId !== null ? `/locations/${originId}` : undefined },
        { type: "Location", value: char.location.name, url: locationId !== null ? `/locations/${locationId}` : undefined }
    ]

    return (
        <DetailsLayout title={char.name} image={char.image} facts={facts} childrenTitle={"Episodes"}>
            {episodes.map((episode) => (
                <Link to={`/episodes/${episode.id}`} key={episode.id}>
                    <EpisodeCard episode={episode} />
                </Link>
            ))}
        </DetailsLayout>
    );
}

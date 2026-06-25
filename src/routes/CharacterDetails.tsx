import { useLoaderData } from "react-router-dom";
import EpisodeCard from "../components/EpisodeCard";
import DetailsLayout, { DetailFacts } from "../components/DetailsLayout";
import { CharacterDetailsLoaderData } from "../loaders";
import { parseApiUrlId } from "../api";
import DetailLinkGrid from "../components/DetailLinkGrid";

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
            <DetailLinkGrid
                items={episodes}
                getPath={(episode) => `/episodes/${episode.id}`}
                renderItem={(episode) => <EpisodeCard episode={episode} />}
            />
        </DetailsLayout>
    );
}

import DetailsLayout, { DetailFacts } from "../components/DetailsLayout";
import { useLoaderData } from "react-router-dom";
import CharacterCard from "../components/CharacterCard";
import { EpisodeDetailsLoaderData } from "../loaders";
import { getEpisodeSeasonImage } from "../media";
import DetailLinkGrid from "../components/DetailLinkGrid";

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
            <DetailLinkGrid
                items={characters}
                getPath={(character) => `/characters/${character.id}`}
                renderItem={(character) => <CharacterCard character={character} />}
            />
        </DetailsLayout>
    )
}

import { Episode } from "rickmortyapi";
import MiniCard from "./MiniCard";
import { getEpisodeSeasonImage } from "../media";

export default function EpisodeCard({ episode }: { episode: Episode }) {
    const image = getEpisodeSeasonImage(episode.episode);
    return (
        <MiniCard
            title={episode.name}
            image={image}
            description={episode.air_date}
            eyebrow="Broadcast"
            badge={episode.episode}
            badgeTone="yellow"
            variant="episode"
        />
    );
}

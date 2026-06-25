import { Episode } from "rickmortyapi";
import MiniCard from "./MiniCard";
import { getEpisodeSeasonImage } from "../media";

export default function EpisodeCard({ episode }: { episode: Episode }) {
    const image = getEpisodeSeasonImage(episode.episode);
    return (
        <MiniCard title={episode.episode} image={image} description={episode.name} />
    );
}

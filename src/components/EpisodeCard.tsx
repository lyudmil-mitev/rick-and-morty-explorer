import { useLoaderData } from "react-router-dom";
import { Episode } from "rickmortyapi";
import MiniCard from "./MiniCard";

import Season1 from "/seasons/s01.jpg";
import Season2 from "/seasons/s02.jpg";
import Season3 from "/seasons/s03.jpg";
import Season4 from "/seasons/s04.jpg";
import Season5 from "/seasons/s05.jpg";
import Season6 from "/seasons/s06.jpg";

export default function EpisodeCard({ episode }: { episode?: Episode }) {
    const ep = episode || useLoaderData() as Episode;
    const season = parseInt(ep.episode.slice(2, 3), 10);
    const images = [Season1, Season2, Season3, Season4, Season5, Season6];
    const image = season <= 6 ? images[season - 1] : images[0];
    return (
        <MiniCard title={`${ep.episode}`} image={image} description={`${ep.name}`} />
    );
}
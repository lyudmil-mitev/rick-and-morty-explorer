import { useLoaderData } from "react-router-dom";
import { Location } from "rickmortyapi";
import MiniCard from "./MiniCard";
import PortalImage from "/portal.png"
import PlanetImage from "/planet.png"

export default function LocationDetail({ location }: { location?: Location }) {
    const place = location || useLoaderData() as Location;
    return (
        <MiniCard title={place.name} image={place.type === "Planet" ? PlanetImage : PortalImage} description={`${place.type}`} />
    );
}
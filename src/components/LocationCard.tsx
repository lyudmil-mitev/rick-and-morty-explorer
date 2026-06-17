import { useLoaderData } from "react-router-dom";
import { Location } from "rickmortyapi";
import MiniCard from "./MiniCard";
import PortalImage from "/portal.png"
import PlanetImage from "/planet.png"

export default function LocationCard({ location }: { location?: Location }) {
    const loaderLocation = useLoaderData() as Location;
    const place = location ?? loaderLocation;
    return (
        <MiniCard title={place.name} image={place.type === "Planet" ? PlanetImage : PortalImage} description={`${place.type}`} />
    );
}

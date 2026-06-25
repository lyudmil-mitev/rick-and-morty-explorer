import { Location } from "rickmortyapi";
import MiniCard from "./MiniCard";
import { getLocationImage } from "../media";

export default function LocationCard({ location }: { location: Location }) {
    return (
        <MiniCard title={location.name} image={getLocationImage(location.type)} description={location.type} />
    );
}

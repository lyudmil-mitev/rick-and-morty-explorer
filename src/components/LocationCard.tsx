import type { Location } from "../rickmorty";
import MiniCard from "./MiniCard";
import { getLocationImage } from "../media";

function getLocationTone(locationType: string) {
    return locationType === "Planet" ? "cyan" : "green";
}

export default function LocationCard({ location }: { location: Location }) {
    return (
        <MiniCard
            title={location.name}
            image={getLocationImage(location.type)}
            description={location.dimension}
            eyebrow={location.type}
            badge={location.type === "Planet" ? "Planet" : "Portal"}
            badgeTone={getLocationTone(location.type)}
            variant="location"
        />
    );
}

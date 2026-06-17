import { Link, useLoaderData } from "react-router-dom";
import DetailsLayout, { DetailFacts } from "../components/DetailsLayout";
import PortalImage from "/portal.png"
import PlanetImage from "/planet.png"
import CharacterCard from "../components/CharacterCard";
import { LocationDetailsLoaderData } from "../loaders";

export default function LocationDetails() {
    const { location, residents } = useLoaderData() as LocationDetailsLoaderData;
    const facts:DetailFacts[] = [
        { type: "Type", value: location.type },
        { type: "Dimension", value: location.dimension },
        { type: "Residents", value: `${location.residents.length} residents` }
    ]

    return (
        <DetailsLayout title={location.name} image={location.type === "Planet" ? PlanetImage : PortalImage} facts={facts} childrenTitle="Residents">
            {residents.length > 0 ? residents.map((character) => (
                <Link to={`/characters/${character.id}`} key={character.id}>
                    <CharacterCard character={character} />
                </Link>
            )) : "No residents"}
        </DetailsLayout>
    );
}

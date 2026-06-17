import { Link, useLoaderData } from "react-router-dom";
import DetailsLayout, { DetailFacts } from "../components/DetailsLayout";
import { Character, Location } from "rickmortyapi";
import PortalImage from "/portal.png"
import PlanetImage from "/planet.png"
import { useEffect, useState } from "react";
import { parseAPIId } from "../loaders";
import { fetchApiResources } from "../api";
import CharacterCard from "../components/CharacterCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function LocationDetails() {
    const location = useLoaderData() as Location;
    const facts:DetailFacts[] = [
        { type: "Type", value: location.type },
        { type: "Dimension", value: location.dimension },
        { type: "Residents", value: `${location.residents.length} residents` }
    ]
    const [characters, setCharacters] = useState<Character[]>([]);

    useEffect(() => {
        const characterList = location.residents.map((resident) => parseAPIId(resident));
        fetchApiResources<Character>('character', characterList).then(setCharacters)
    }, [location.residents])

    return (
        <DetailsLayout title={location.name} image={location.type === "Planet" ? PlanetImage : PortalImage} facts={facts} childrenTitle="Residents">
            {characters.length > 0 ? characters.map((character, index) => (
                <Link to={`/characters/${character.id}`} key={index}>
                    <CharacterCard character={character} />
                </Link>
            )) : location.residents.length > 0 ? <><LoadingSpinner/> Loading...</> : "No residents"}
        </DetailsLayout>
    );
}
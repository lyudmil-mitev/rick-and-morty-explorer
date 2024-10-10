import { Link, useLoaderData } from "react-router-dom";
import DetailsLayout, { DetailFacts } from "../components/DetailsLayout";
import { Character, getCharacter, Location } from "rickmortyapi";
import PortalImage from "/portal.png"
import PlanetImage from "/planet.png"
import { useEffect, useState } from "react";
import { parseAPIId } from "../loaders";
import CharacterCard from "../components/CharacterCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function LocationDetails() {
    const location = useLoaderData() as Location;
    console.log(location)
    const facts:DetailFacts[] = [
        { type: "Type", value: location.type },
        { type: "Dimension", value: location.dimension },
        { type: "Residents", value: `${location.residents.length} residents` }
    ]
    const [characters, setCharacters] = useState<Character[]>([]);

    useEffect(() => {
        const characterList = location.residents.map((resident) => parseAPIId(resident));
        getCharacter(characterList).then((data) => {
            if (data.status === 200 && data.data) {
                if (data.data.length > 0) {
                    setCharacters(data.data)
                    return
                } else if (typeof data.data === 'object' && typeof data.data.length === "undefined") {
                    // XXX: Wrong type from client library, when there's only one result the type is Episode and not Episode[]
                    // @ts-ignore
                    setCharacters([data.data])
                }
            }
        })
    }, [])

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
import { useLoaderData } from "react-router-dom";
import DetailsLayout, { DetailFacts } from "../components/DetailsLayout";
import CharacterCard from "../components/CharacterCard";
import { LocationDetailsLoaderData } from "../loaders";
import { getLocationImage } from "../media";
import DetailLinkGrid from "../components/DetailLinkGrid";
import { cx, ui } from "../styles/ui";
import DetailsTextPanel from "../components/DetailsTextPanel";
import { isDisplayableDetails } from "../details";

export default function LocationDetails() {
    const { location, residents, details } = useLoaderData() as LocationDetailsLoaderData;
    const facts:DetailFacts[] = [
        { type: "Type", value: location.type },
        { type: "Dimension", value: location.dimension },
        { type: "Residents", value: `${location.residents.length} residents` }
    ]

    return (
        <DetailsLayout
            title={location.name}
            image={getLocationImage(location.type)}
            facts={facts}
            childrenTitle="Residents"
            recordLabel="Location Record"
            variant="location"
            intro={isDisplayableDetails(details) ? <DetailsTextPanel details={details} /> : undefined}
        >
            {residents.length > 0 ? (
                <DetailLinkGrid
                    items={residents}
                    getPath={(character) => `/characters/${character.id}`}
                    renderItem={(character) => <CharacterCard character={character} />}
                />
            ) : (
                <div className={cx("p-6", ui.mutedPanel)}>
                    No residents logged for this location.
                </div>
            )}
        </DetailsLayout>
    );
}

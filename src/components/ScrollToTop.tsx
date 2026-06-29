import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

type ScrollPosition = {
    left: number;
    top: number;
}

export default function ScrollToTop() {
    const location = useLocation();
    const navigationType = useNavigationType();
    const previousLocation = useRef(location);
    const scrollPositions = useRef(new Map<string, ScrollPosition>());

    useEffect(() => {
        const previous = previousLocation.current;

        if (previous.key === location.key) {
            return;
        }

        scrollPositions.current.set(previous.key, {
            left: window.scrollX,
            top: window.scrollY,
        });

        if (navigationType === "POP") {
            const savedPosition = scrollPositions.current.get(location.key);

            if (savedPosition !== undefined) {
                window.scrollTo({ ...savedPosition, behavior: "instant" });
            }
        } else if (previous.pathname !== location.pathname) {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }

        previousLocation.current = location;
    }, [location, navigationType]);

    return null;
}

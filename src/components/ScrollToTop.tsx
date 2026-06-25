import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();
    const previousPathname = useRef(pathname);

    useEffect(() => {
        if (previousPathname.current !== pathname) {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
            previousPathname.current = pathname;
        }
    }, [pathname]);

    return null;
}

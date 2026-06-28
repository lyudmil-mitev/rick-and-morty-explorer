import { useState } from "react";
import { cx } from "../styles/ui";

export default function SchwiftyTitle({
    className,
    revealOnMount = false,
}: {
    className?: string;
    revealOnMount?: boolean;
}) {
    const [titleZapVersion, setTitleZapVersion] = useState(0);

    return (
        <h1 className={cx("schwifty text-center", className)} aria-label="Rick and Morty Explorer">
            <button
                type="button"
                className="schwifty-title-trigger"
                aria-label="Replay title animation"
                data-title-zap-version={titleZapVersion}
                onClick={() => setTitleZapVersion((value) => value + 1)}
            >
                <span
                    key={titleZapVersion}
                    className={cx(
                        "schwifty-title-text",
                        titleZapVersion > 0 && "schwifty-title-text--replay",
                        titleZapVersion === 0 && revealOnMount && "schwifty-title-text--intro",
                    )}
                    aria-hidden="true"
                >
                    Rick and Morty <span className="max-[760px]:block">Explorer</span>
                </span>
            </button>
        </h1>
    );
}

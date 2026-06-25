import { ReactNode } from "react";
import { Link } from "react-router-dom";

export default function DetailLinkGrid<TItem extends { id: number }>({
    items,
    getPath,
    renderItem,
}: {
    items: TItem[],
    getPath: (item: TItem) => string,
    renderItem: (item: TItem) => ReactNode,
}) {
    return (
        <>
            {items.map((item) => (
                <Link to={getPath(item)} key={item.id}>
                    {renderItem(item)}
                </Link>
            ))}
        </>
    );
}

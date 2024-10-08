import { Link, useNavigation } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

export default function Pagination({ page, totalPages }: { page: number, totalPages: number }) {
    const { state } = useNavigation();
    if (isNaN(page) || isNaN(totalPages) || page < 1 || page > totalPages) {
        throw new Error('Page not found');
    }

    return (
        <nav className="flex justify-center gap-4 p-4">
            <Link to={`?page=${page - 1}`} className={`p-2 rounded-lg ${page === 1 ? 'invisible' : 'bg-gray-100 dark:bg-gray-800'}`}>
                &lt;
                <span> Previous</span>
            </Link>
            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                Page {state === "loading" ? <LoadingSpinner /> : page } of {totalPages}
            </span>
            <Link to={`?page=${page + 1}`} className={`p-2 rounded-lg ${page === totalPages ? 'invisible' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <span>Next </span>
                &gt;
            </Link>
        </nav>
    );
}
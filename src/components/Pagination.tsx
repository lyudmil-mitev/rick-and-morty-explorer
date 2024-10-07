import { Link } from "react-router-dom";

export default function Pagination({ page, totalPages }: { page: number, totalPages: number }) {
    return (
        <nav className="flex justify-center gap-4 p-4">
            <Link to={`?page=${page - 1}`} className={`p-2 rounded-lg ${page === 1 ? 'invisible' : 'bg-gray-100 dark:bg-gray-800'}`}>
                &lt;
                <span className="sr-only">Previous</span>
            </Link>
            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                Page {page} of {totalPages}
            </span>
            <Link to={`?page=${page + 1}`} className={`p-2 rounded-lg ${page === totalPages ? 'invisible' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <span className="sr-only">Next</span>
                &gt;
            </Link>
        </nav>
    );
}
import { Link } from 'react-router-dom';
import MrPBH from '/mr_pbh.webp'

export default function ErrorPage() {
    return (
        <div className="flex flex-col items-center h-screen space-y-4 pt-8">
          <h1 className="text-6xl font-bold text-center dark:text-white">Oooh weee!</h1>
          <h2 className="text-xl font-semibold text-center dark:text-gray">Looks like something went wrong!</h2>
          <img src={MrPBH} alt="Mr. Poopybutthole" className="w-18 h-auto" />

          <Link to="/" className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">Go Back</Link>
        </div>
    );
}
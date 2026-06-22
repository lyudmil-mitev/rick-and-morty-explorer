import MrPbhImage from "/mr_pbh.webp";

const linkClass = "font-semibold text-blue-600 underline-offset-4 hover:underline dark:text-blue-300";

export default function About() {
    return (
        <section className="px-4 py-10 text-left sm:px-6 lg:px-8">
            <article className="mx-auto grid max-w-5xl grid-cols-[7rem_1fr] gap-4 text-gray-700 dark:text-gray-200 sm:grid-cols-[9rem_1fr] sm:gap-6 lg:grid-cols-[16rem_1fr] lg:items-start">
                <header className="col-span-2 space-y-3">
                    <p className="text-sm font-bold uppercase tracking-wide text-lime-700 dark:text-lime-300">About</p>
                    <h1 className="text-3xl font-bold leading-tight text-gray-950 dark:text-white sm:text-4xl">
                        Rick and Morty Explorer
                    </h1>
                    <p className="text-lg leading-8 text-gray-600 dark:text-gray-300">
                        A fan-built browser for characters, locations, and episodes using the Rick and Morty API.
                    </p>
                </header>

                <aside className="sticky top-4 w-full self-start lg:top-6">
                    <img
                        src={MrPbhImage}
                        alt="Mr. Poopybutthole"
                        className="mx-auto h-56 w-full rounded-lg object-contain object-top sm:h-72 lg:h-auto lg:aspect-square"
                    />
                </aside>

                <div className="space-y-6">
                    <section className="rounded-lg bg-white p-5 shadow-sm dark:bg-gray-800 sm:p-6">
                        <h2 className="text-xl font-semibold text-gray-950 dark:text-white">Project</h2>
                        <p className="mt-3 leading-7">
                            Thank you for visiting Rick and Morty Explorer. This project was created by{" "}
                            <a className={linkClass} href="https://www.linkedin.com/in/lyudmil-mitev-97556318/" target="_blank" rel="noreferrer">
                                Lyudmil Mitev
                            </a>{" "}
                            using Vite, React, TypeScript and React Router.
                        </p>
                        <p className="mt-3 leading-7">
                            Check out the source code on{" "}
                            <a className={linkClass} href="https://github.com/lyudmil-mitev/rick-and-morty-explorer" target="_blank" rel="noreferrer">
                                GitHub
                            </a>
                            , and feel free to comment or contribute.
                        </p>
                    </section>

                    <section className="rounded-lg bg-white p-5 shadow-sm dark:bg-gray-800 sm:p-6">
                        <h2 className="text-xl font-semibold text-gray-950 dark:text-white">Data and Ownership</h2>
                        <p className="mt-3 leading-7">
                            Implemented with{" "}
                            <a className={linkClass} href="https://rickandmortyapi.com/" target="_blank" rel="noreferrer">
                                Rick and Morty API
                            </a>
                            .
                        </p>
                        <p className="mt-3 leading-7">
                            Rick and Morty is a copyright and trademark of The Cartoon Network, Inc, Adult Swim,
                            Justin Roiland, Dan Harmon and others. This is a fan website and is in no way affiliated
                            to them.
                        </p>
                        <p className="mt-3 leading-7">
                            The data and images are used without claim of ownership and belong to their respective owners.
                        </p>
                    </section>

                    <section className="rounded-lg bg-white p-5 shadow-sm dark:bg-gray-800 sm:p-6">
                        <h2 className="text-xl font-semibold text-gray-950 dark:text-white">Credits</h2>
                        <p className="mt-3 leading-7">
                            The title font is made and{" "}
                            <a className={linkClass} href="https://www.deviantart.com/jonizaak/art/Get-Schwifty-A-Rick-and-Morty-font-638073728" target="_blank" rel="noreferrer">
                                generously provided by John Izaak
                            </a>
                            .
                        </p>
                        <p className="mt-3 leading-7">
                            The deep space background SVG image is adapted from{" "}
                            <a className={linkClass} href="https://codepen.io/finnhvman/pen/bGOYpbO" target="_blank" rel="noreferrer">
                                work by Bence Szabo
                            </a>
                            .
                        </p>
                    </section>
                </div>
            </article>
        </section>
    );
}

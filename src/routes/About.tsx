import MrPbhImage from "/mr_pbh.webp";

const linkClass = "font-semibold text-cyan-700 underline-offset-4 hover:text-lime-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 dark:text-cyan-300 dark:hover:text-lime-200";
const panelClass = "rounded-lg border border-cyan-700/15 bg-[#fbfaf2] p-5 shadow-md shadow-slate-300/30 dark:border-cyan-300/15 dark:bg-slate-800 dark:shadow-black/20 sm:p-6";

export default function About() {
    return (
        <section className="px-4 pb-10 pt-5 text-left sm:px-6 lg:px-8">
            <article className="mx-auto grid max-w-5xl grid-cols-[7rem_1fr] gap-4 text-slate-700 dark:text-slate-200 sm:grid-cols-[9rem_1fr] sm:gap-6 lg:grid-cols-[16rem_1fr] lg:items-start">
                <header className="col-span-2 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Fan project file</p>
                    <h1 className="text-3xl font-extrabold leading-tight text-slate-950 dark:text-white sm:text-4xl">
                        Rick and Morty Explorer
                    </h1>
                    <p className="text-lg leading-8 text-slate-600 dark:text-slate-300">
                        A fan-built browser for characters, locations, and episodes using the Rick and Morty API.
                    </p>
                </header>

                <aside className="sticky top-4 w-full self-start rounded-lg border border-lime-400/25 bg-white/60 p-3 shadow-inner dark:bg-slate-900/40 lg:top-6">
                    <img
                        src={MrPbhImage}
                        alt="Mr. Poopybutthole"
                        className="mx-auto h-56 w-full rounded-lg object-contain object-top sm:h-72 lg:h-auto lg:aspect-square"
                    />
                </aside>

                <div className="space-y-6">
                    <section className={panelClass}>
                        <h2 className="text-xl font-bold text-slate-950 dark:text-white">Project</h2>
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

                    <section className={panelClass}>
                        <h2 className="text-xl font-bold text-slate-950 dark:text-white">Data and Ownership</h2>
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

                    <section className={panelClass}>
                        <h2 className="text-xl font-bold text-slate-950 dark:text-white">Credits</h2>
                        <p className="mt-3 leading-7">
                            The title font is made and{" "}
                            <a className={linkClass} href="https://www.deviantart.com/jonizaak/art/Get-Schwifty-A-Rick-and-Morty-font-638073728" target="_blank" rel="noreferrer">
                                generously provided by John Izaak
                            </a>
                            , with the self-hosted webfont converted by{" "}
                            <a className={linkClass} href="https://github.com/tommyeastman/getSchwifty" target="_blank" rel="noreferrer">
                                tommyeastman/getSchwifty
                            </a>
                            .
                        </p>
                        <p className="mt-3 leading-7">
                            The light-mode alien landscape SVG image is adapted from{" "}
                            <a className={linkClass} href="https://codepen.io/finnhvman/pen/bGopgee" target="_blank" rel="noreferrer">
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

import MrPbhImage from "/mr_pbh.webp";
import { cx, ui } from "../styles/ui";

const panelClass = cx("p-5 sm:p-6", ui.panel);

export default function About() {
    return (
        <section className="overflow-hidden px-4 pb-10 pt-5 text-left sm:px-6 lg:px-8">
            <article className="mx-auto grid max-w-5xl grid-cols-1 gap-5 text-slate-700 dark:text-slate-200 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start">
                <header className="space-y-3 sm:col-span-2">
                    <p className={ui.eyebrow}>Fan project file</p>
                    <h1 className="text-3xl font-extrabold leading-tight text-slate-950 dark:text-white sm:text-4xl">
                        Rick and Morty Explorer
                    </h1>
                    <p className="text-lg leading-8 text-slate-600 dark:text-slate-300">
                        A fan-built browser for characters, locations, and episodes using a Kaggle dataset sourced from the Rick and Morty API.
                    </p>
                </header>

                <aside className="w-full self-start sm:sticky sm:top-4 lg:top-6">
                    <img
                        src={MrPbhImage}
                        alt="Mr. Poopybutthole"
                        className="mx-auto h-48 w-full max-w-xs object-contain object-top sm:h-72 sm:max-w-none lg:h-auto lg:aspect-square"
                    />
                </aside>

                <div className="min-w-0 space-y-6">
                    <section className={panelClass}>
                        <h2 className="text-xl font-bold text-slate-950 dark:text-white">Project</h2>
                        <p className="mt-3 leading-7">
                            Thank you for visiting Rick and Morty Explorer. This project was created by{" "}
                            <a className={ui.link} href="https://www.linkedin.com/in/lyudmil-mitev-97556318/" target="_blank" rel="noreferrer">
                                Lyudmil Mitev
                            </a>{" "}
                            using Vite, React, TypeScript and React Router.
                        </p>
                        <p className="mt-3 leading-7">
                            Check out the source code on{" "}
                            <a className={ui.link} href="https://github.com/lyudmil-mitev/rick-and-morty-explorer" target="_blank" rel="noreferrer">
                                GitHub
                            </a>
                            , and feel free to comment or contribute.
                        </p>
                    </section>

                    <section className={panelClass}>
                        <h2 className="text-xl font-bold text-slate-950 dark:text-white">Data and Ownership</h2>
                        <p className="mt-3 leading-7">
                            Base records are downloaded from{" "}
                            <a className={ui.link} href="https://www.kaggle.com/datasets/robbroadhead/rick-and-morty-api-dataset" target="_blank" rel="noreferrer">
                                Kaggle&apos;s Rick and Morty API dataset
                            </a>
                            , which is sourced from the{" "}
                            <a className={ui.link} href="https://rickandmortyapi.com/" target="_blank" rel="noreferrer">
                                Rick and Morty API
                            </a>
                            .
                        </p>
                        <p className="mt-3 leading-7">
                            Detail text and source links are downloaded from{" "}
                            <a className={ui.link} href="https://www.kaggle.com/datasets/robbroadhead/rick-and-morty-details-fandom-wiki-dataset" target="_blank" rel="noreferrer">
                                Kaggle&apos;s Rick and Morty details Fandom Wiki dataset
                            </a>
                            , gathered from the{" "}
                            <a className={ui.link} href="https://rickandmorty.fandom.com/" target="_blank" rel="noreferrer">
                                Rick and Morty Wiki
                            </a>
                            . Fandom wiki text is licensed under{" "}
                            <a className={ui.link} href="https://www.fandom.com/licensing" target="_blank" rel="noreferrer">
                                CC BY-SA
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
                            <a className={ui.link} href="https://www.deviantart.com/jonizaak/art/Get-Schwifty-A-Rick-and-Morty-font-638073728" target="_blank" rel="noreferrer">
                                generously provided by John Izaak
                            </a>
                            , with the self-hosted webfont converted by{" "}
                            <a className={ui.link} href="https://github.com/tommyeastman/getSchwifty" target="_blank" rel="noreferrer">
                                tommyeastman/getSchwifty
                            </a>
                            .
                        </p>
                        <p className="mt-3 leading-7">
                            The light-mode alien landscape SVG image is adapted from{" "}
                            <a className={ui.link} href="https://codepen.io/finnhvman/pen/bGopgee" target="_blank" rel="noreferrer">
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

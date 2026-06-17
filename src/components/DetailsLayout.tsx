import React from "react";
import { Link } from "react-router-dom";

export type DetailFacts = {
    type: string;
    value: string;
    url?: string;
}

export default function DetailsLayout({ image, title, facts, childrenTitle, children }: { image: string, title: string, facts: DetailFacts[], childrenTitle: string, children?: React.ReactNode }) {
    return (
        <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 lg:grid lg:grid-cols-[minmax(18rem,24rem)_1fr] lg:items-start lg:p-6">
            <aside className="rounded-lg bg-white shadow-lg dark:bg-gray-800">
                <div className="p-4 sm:p-6">
                    <img className="mx-auto aspect-square w-full max-w-xs rounded object-cover" src={image} alt={title} />
                    <h1 className="mt-4 break-words text-3xl font-bold leading-tight dark:text-white lg:text-4xl">{title}</h1>

                    <dl className="mt-6 space-y-2">
                        {facts.map((fact, index) => (
                            <div key={index} className="flex justify-between gap-4 rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                                <dt className="font-semibold dark:text-gray-300">{fact.type}</dt>
                                <dd className="text-right dark:text-gray-300">
                                    {fact.url ? (
                                        <Link to={fact.url} className="text-blue-500 hover:underline dark:text-blue-400">{fact.value}</Link>
                                    ) : fact.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </aside>
            <section className="min-w-0">
                <h2 className="mb-4 text-left text-2xl font-semibold dark:text-gray-100">{childrenTitle}:</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {children}
                </div>
            </section>
        </section>
    );
}

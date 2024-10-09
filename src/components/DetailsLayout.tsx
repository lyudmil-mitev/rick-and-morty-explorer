import React from "react";
import { Link } from "react-router-dom";

export type DetailFacts = {
    type: string;
    value: string;
    url?: string;
}

export default function DetailsLayout({ image, title, facts, childrenTitle, children }: { image: string, title: string, facts: DetailFacts[], childrenTitle: string, children?: React.ReactNode }) {
    return (
        <section className="flex flex-col md:flex-row gap-4 p-4">
            <div className="flex flex-col md:flex-row bg-white dark:bg-gray-800 shadow-lg rounded-lg">
                <div className="p-4 flex-1">
                    <img className="mx-auto" src={image} alt={title} />
                    <h1 className="text-2xl font-bold mb-4 dark:text-white">{title}</h1>

                    <dl className="space-y-2">
                        {facts.map((fact, index) => (
                            <div key={index} className="flex justify-between items-center hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded">
                                <dt className="font-semibold dark:text-gray-300">{fact.type}</dt>
                                <dd className="dark:text-gray-300">
                                    {fact.url ? (
                                        <Link to={fact.url} className="text-blue-500 hover:underline dark:text-blue-400">{fact.value}</Link>
                                    ) : fact.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
            <div className="flex-1">
                <h2 className="text-xl text-left font-semibold mb-4">{childrenTitle}:</h2>
                <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {children}
                </div>
            </div>
        </section>
    );
}
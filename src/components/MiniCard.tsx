export default function MiniCard({ title, image, description}: { title: string, image: string, description: string }) {
    return (
        <section className="portal-hover h-full overflow-hidden rounded-lg bg-white text-left shadow-md dark:bg-gray-800">
            <div className="grid h-full min-h-24 grid-cols-[6rem_1fr]">
                <img src={image} alt={title} className="h-full w-24 object-cover" />
                <div className="z-10 min-w-0 p-4">
                    <h2 className="break-words text-xl font-bold leading-tight text-gray-800 dark:text-gray-200">{title}</h2>
                    <p className="mt-2 break-words text-base leading-snug text-gray-600 dark:text-gray-400">
                        {description}
                    </p>
                </div>
            </div>
        </section>
    );
}

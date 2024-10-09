export default function MiniCard({ title, image, description}: { title: string, image: string, description: string }) {
    return (<section className="portal-hover h-full text-left max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="flex h-full gap-4">
                <img src={image} alt={title} className="w-24 h-24 rounded-tl-lg rounded-bl-lg" />
                <div className='z-10'>
                    <h2 className="text-xl mt-2 font-bold text-gray-800 dark:text-gray-200">{title}</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {description}
                    </p>
                </div>
            </div>
    </section>);
}
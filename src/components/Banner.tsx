
import mortyLogo from '/android-chrome-512x512.png'
import starrySpace from '/StarrySpace.svg'

const Banner = () => <section className="flex justify-center items-center bg-cover bg-center py-20" style={{ backgroundImage: `url(${starrySpace})` }}>
    <a title="Powered by Rick and Morty API!" href="https://rickandmortyapi.com/" target="_blank">
        <img src={mortyLogo} className="logo" alt="Morty Logo" />
    </a>
    <h1 className="schwifty text-6xl sm:text-10xl">Rick and Morty Explorer</h1>
</section>

export default Banner;
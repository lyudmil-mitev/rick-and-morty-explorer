import mortyLogo from '/android-chrome-512x512.png'
import starrySpace from '/StarrySpace.svg'

const Banner = () => (
  <section
    className="flex flex-col items-center justify-center bg-cover bg-center px-4 py-10 sm:flex-row sm:py-14"
    style={{ backgroundImage: `url(${starrySpace})` }}
  >
    <a
      title="Powered by Rick and Morty API!"
      href="https://rickandmortyapi.com/"
      target="_blank"
    >
      <img src={mortyLogo} className="logo" alt="Morty Logo" />
    </a>

    <h1 className="schwifty text-center text-5xl sm:text-7xl lg:text-8xl">
      Rick and Morty Explorer
    </h1>
  </section>
)

export default Banner

import mortyLogo from '/android-chrome-512x512.png'
import starrySpace from '/StarrySpace.svg'

const Banner = () => (
  <section
    className="flex flex-col items-center justify-center bg-cover bg-center px-4 pb-8 pt-6 sm:flex-row sm:pb-10 sm:pt-8"
    style={{ backgroundImage: `url(${starrySpace})` }}
  >
    <a
      title="Powered by Rick and Morty API!"
      href="https://rickandmortyapi.com/"
      target="_blank"
    >
      <img src={mortyLogo} className="logo" alt="Morty Logo" />
    </a>

    <h1 className="schwifty text-center">
      Rick and Morty Explorer
    </h1>
  </section>
)

export default Banner

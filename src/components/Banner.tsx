import mortyLogo from '/android-chrome-512x512.png'
import { bannerBackgroundImage } from './backgroundImages'
import SchwiftyTitle from './SchwiftyTitle'

const Banner = ({ theme }: { theme: "light" | "dark" }) => (
  <section
    className="relative flex flex-col items-center justify-center overflow-hidden bg-cover bg-center px-4 pb-10 pt-4 before:absolute before:inset-x-0 before:bottom-0 before:h-20 before:bg-gradient-to-t before:from-[#eef2ed] before:to-transparent dark:before:from-[#111827] sm:flex-row sm:gap-3 sm:pb-12 sm:pt-6"
    style={{ backgroundImage: bannerBackgroundImage[theme] }}
  >
    <a
      className="relative z-10 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#eef2ed] dark:focus-visible:ring-lime-300 dark:focus-visible:ring-offset-slate-950"
      title="Powered by Rick and Morty API!"
      href="https://rickandmortyapi.com/"
      target="_blank"
    >
      <img src={mortyLogo} className="logo" alt="Morty Logo" fetchPriority="high" loading="eager" />
    </a>

    <SchwiftyTitle className="relative z-10" />
  </section>
)

export default Banner

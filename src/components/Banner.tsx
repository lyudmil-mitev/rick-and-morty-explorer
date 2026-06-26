import mortyLogo from '/android-chrome-512x512.png'

const darkBannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 480" preserveAspectRatio="xMidYMid slice">
  <filter id="filter">
    <feTurbulence type="fractalNoise" baseFrequency=".006" numOctaves="8" seed="4"/>
    <feDisplacementMap scale="80"/>
    <feColorMatrix values="1 0 0 0 0
                           0 1 0 0 0
                           0 0 1 0 0
                           0 0 0 1.2 -.2"/>
    <feColorMatrix values="2 0 0 0 -.6
                           .1 0 .6 .5 -.5
                           0 0 .1 0 .1
                           0 0 0 1 0" result="n"/>
    <feTurbulence baseFrequency=".2" result="s"/>
    <feTurbulence baseFrequency=".1"/>
    <feBlend in="s"/>
    <feColorMatrix values="0 0 0 9 -6
                           0 0 0 9 -6
                           0 0 0 9 -6
                           0 0 0 0 1"/>
    <feBlend in="n"/>
  </filter>
  <rect width="1920" height="480" filter="url(#filter)"/>
</svg>`;

const lightBannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 360" preserveAspectRatio="none">
  <defs>
    <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#eaffd1"/>
      <stop offset="45%" stop-color="#9ff4d5"/>
      <stop offset="100%" stop-color="#eef2ed"/>
    </linearGradient>
    <linearGradient id="fade" x2="0" y2="1">
      <stop stop-color="#102030" stop-opacity=".46"/>
      <stop offset="100%" stop-color="#102030" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="haze" x1="0" x2="1" y1="0" y2="0">
      <stop stop-color="#08bae3" stop-opacity=".16"/>
      <stop offset="48%" stop-color="#b7ff44" stop-opacity=".24"/>
      <stop offset="100%" stop-color="#ff4fa3" stop-opacity=".12"/>
    </linearGradient>
    <filter id="terrainNoise">
      <feComponentTransfer>
        <feFuncA type="discrete" tableValues="0 0 .17 .37 .5 .57 .33 1 1"/>
      </feComponentTransfer>
      <feColorMatrix values="0 0 0 .06 0
                             0 0 0 .85 .02
                             0 0 0 .45 .02
                             0 0 0 0 1" result="s"/>
      <feTurbulence type="fractalNoise" baseFrequency=".005" numOctaves="2"/>
      <feDisplacementMap in="s" scale="99"/>
    </filter>
    <filter id="softBlur">
      <feGaussianBlur stdDeviation="10"/>
    </filter>
  </defs>

  <rect width="1600" height="360" fill="url(#sky)"/>
  <rect x="-20%" y="-5%" width="120%" height="122%" fill="url(#fade)" filter="url(#terrainNoise)" opacity=".5"/>
  <rect width="1600" height="360" fill="url(#haze)"/>
</svg>`;

const bannerBackgroundImage: Record<"light" | "dark", string> = {
  dark: `url("data:image/svg+xml,${encodeURIComponent(darkBannerSvg)}")`,
  light: `url("data:image/svg+xml,${encodeURIComponent(lightBannerSvg)}")`,
};

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

    <h1 className="schwifty relative z-10 text-center">
      Rick and Morty Explorer
    </h1>
  </section>
)

export default Banner

function publicAssetUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path}`
}

function backgroundUrl(path: string) {
  return `url("${publicAssetUrl(path)}")`
}

export const bannerBackgroundImage: Record<"light" | "dark", string> = {
  dark: backgroundUrl("backgrounds/banner-dark.jpg"),
  light: backgroundUrl("backgrounds/banner-light.jpg"),
}

export const splashBackgroundImage: Record<"light" | "dark", string> = {
  dark: backgroundUrl("backgrounds/splash-dark.jpg"),
  light: backgroundUrl("backgrounds/splash-light.jpg"),
}

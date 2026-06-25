const availableSeasons = new Set([1, 2, 3, 4, 5, 6])

function publicAssetUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path}`
}

export function getEpisodeSeasonImage(episodeCode: string) {
  const seasonMatch = /^S(\d+)E\d+$/i.exec(episodeCode)
  const season = Number.parseInt(seasonMatch?.[1] ?? "", 10)
  const imageSeason = availableSeasons.has(season) ? season : 1

  return publicAssetUrl(`seasons/s${String(imageSeason).padStart(2, "0")}.jpg`)
}

export function getLocationImage(locationType: string) {
  return publicAssetUrl(locationType === "Planet" ? "planet.png" : "portal.png")
}

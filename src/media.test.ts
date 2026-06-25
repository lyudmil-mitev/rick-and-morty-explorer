import { describe, expect, it } from "vitest"
import { getEpisodeSeasonImage, getLocationImage } from "./media"

describe("media helpers", () => {
  it("returns the matching image for known episode seasons", () => {
    expect(getEpisodeSeasonImage("S02E01")).not.toBe(getEpisodeSeasonImage("S01E01"))
  })

  it("falls back to the first season image for unknown or malformed episode codes", () => {
    const fallbackImage = getEpisodeSeasonImage("S01E01")

    expect(getEpisodeSeasonImage("S10E01")).toBe(fallbackImage)
    expect(getEpisodeSeasonImage("Pilot")).toBe(fallbackImage)
  })

  it("returns different images for planets and non-planets", () => {
    expect(getLocationImage("Planet")).not.toBe(getLocationImage("Space station"))
  })
})

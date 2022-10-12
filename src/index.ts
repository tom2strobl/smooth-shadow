import BezierEasing from './bezier'

const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a
const clamp = (a: number, min = 0, max = 1) => Math.min(max, Math.max(min, a))
const invlerp = (x: number, y: number, a: number) => clamp((a - x) / (y - x))

const roundPixel = (num: number): number => Math.round(num * 10) / 10
const roundTransparency = (num: number): number => Math.round(num * 1000) / 1000

type GetSmoothShadowFunction = (
  distance?: number,
  intensity?: number,
  sharpness?: number,
  rgb?: [number, number, number]
) => string

export const getSmoothShadow: GetSmoothShadowFunction = (
  rawDistance = 100,
  rawIntensity = 0.5,
  rawSharpness = 0.5,
  rgb = [0, 0, 0]
) => {
  // in terms of performance it makes sense to limit a maximum
  const maxDistance = 2000
  const maxLayers = 24
  // clamp user values so the result doesnt go apeshit
  const distance = clamp(rawDistance * 2, 0, maxDistance)
  const intensity = clamp(rawIntensity, 0, 1)
  const sharpness = clamp(rawSharpness, 0, 1)
  // the fractional distance to the maximum 0-1
  const interpolatedDistance = invlerp(1, maxDistance, distance)
  // the more distance, the more layers
  const amountEasing = BezierEasing(0.25, 1 - interpolatedDistance, 0.5, 1)
  // dont forget to round since we can only handle an integer amount of layers
  const amountLayers = Math.round(maxLayers * amountEasing(interpolatedDistance))
  // no reason to make this dynamic as it always looks good
  const distanceTransparency = BezierEasing(0, 0.3, 0, 0.06)
  // we want short distances to have enough opacity to look good
  const transparencyBase = (distanceTransparency(interpolatedDistance) / interpolatedDistance) * 6.5
  // now factor in intensity
  const finalTransparency = (transparencyBase / maxLayers) * intensity
  // no reason to make this dynamic as it always looks good
  const transparencyEasing = BezierEasing(0, 1, 0.8, 0.5)
  // we like it if the light source is closer to the center and generally speaking we want some shadow left at the top and left as well
  const distanceX = distance * 0.5
  const distanceY = distance * 0.75
  // maxBlur scales with distance
  const maxBlur = lerp(200, 500, interpolatedDistance)
  // factor in sharpness to base blur value
  const finalBlur = lerp(100, maxBlur, sharpness)
  // this one's a little tricky, but for good looks we want multiple layers of ease
  const blurSharpnessEase = BezierEasing(1, 0, 1, 0)
  const easingBlurSharpness = lerp(0, 2, blurSharpnessEase(1 - sharpness))
  const blurEasing = BezierEasing(1, easingBlurSharpness, 1, easingBlurSharpness)
  // closer distances need to be paired with sharpness slightly differently to look good
  const easingSharpness = lerp(0, 0.075, 1 - sharpness)
  const distanceEasing = BezierEasing(1, easingSharpness, 1, easingSharpness)
  // iterate of the all layers and generate the final box-shadow string
  return Array.from(Array(amountLayers))
    .map((_, i) => {
      const transparencyCoeff = transparencyEasing(i / amountLayers)
      const distanceCoeff = distanceEasing(i / amountLayers)
      const blurCoeff = blurEasing(i / amountLayers)
      const x = roundPixel(distanceX * distanceCoeff)
      const y = roundPixel(distanceY * distanceCoeff)
      const b = roundPixel(finalBlur * blurCoeff)
      const t = roundTransparency(finalTransparency * transparencyCoeff)
      return `${x}px ${y}px ${b}px rgba(${rgb[0]},${rgb[1]},${rgb[2]},${t})`
    })
    .join(', ')
}

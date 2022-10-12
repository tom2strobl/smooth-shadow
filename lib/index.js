'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const NEWTON_ITERATIONS = 4;
const NEWTON_MIN_SLOPE = 1e-3;
const SUBDIVISION_PRECISION = 1e-7;
const SUBDIVISION_MAX_ITERATIONS = 10;
const kSplineTableSize = 11;
const kSampleStepSize = 1 / (kSplineTableSize - 1);
const float32ArraySupported = typeof Float32Array === "function";
function A(aA1, aA2) {
  return 1 - 3 * aA2 + 3 * aA1;
}
function B(aA1, aA2) {
  return 3 * aA2 - 6 * aA1;
}
function C(aA1) {
  return 3 * aA1;
}
function calcBezier(aT, aA1, aA2) {
  return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
}
function getSlope(aT, aA1, aA2) {
  return 3 * A(aA1, aA2) * aT * aT + 2 * B(aA1, aA2) * aT + C(aA1);
}
function binarySubdivide(aX, aA, aB, mX1, mX2) {
  let currentX;
  let currentT;
  let i = 0;
  do {
    currentT = aA + (aB - aA) / 2;
    currentX = calcBezier(currentT, mX1, mX2) - aX;
    if (currentX > 0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
  return currentT;
}
function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
  for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
    const currentSlope = getSlope(aGuessT, mX1, mX2);
    if (currentSlope === 0) {
      return aGuessT;
    }
    const currentX = calcBezier(aGuessT, mX1, mX2) - aX;
    aGuessT -= currentX / currentSlope;
  }
  return aGuessT;
}
function LinearEasing(x) {
  return x;
}
function bezier(mX1, mY1, mX2, mY2) {
  if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
    throw new Error("bezier x values must be in [0, 1] range");
  }
  if (mX1 === mY1 && mX2 === mY2) {
    return LinearEasing;
  }
  const sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
  for (let i = 0; i < kSplineTableSize; ++i) {
    sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
  }
  function getTForX(aX) {
    let intervalStart = 0;
    let currentSample = 1;
    const lastSample = kSplineTableSize - 1;
    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
      intervalStart += kSampleStepSize;
    }
    --currentSample;
    const dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
    const guessForT = intervalStart + dist * kSampleStepSize;
    const initialSlope = getSlope(guessForT, mX1, mX2);
    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
    } else if (initialSlope === 0) {
      return guessForT;
    } else {
      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
    }
  }
  return function BezierEasing(x) {
    if (x === 0 || x === 1) {
      return x;
    }
    return calcBezier(getTForX(x), mY1, mY2);
  };
}

const lerp = (x, y, a) => x * (1 - a) + y * a;
const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const invlerp = (x, y, a) => clamp((a - x) / (y - x));
const roundPixel = (num) => Math.round(num * 10) / 10;
const roundTransparency = (num) => Math.round(num * 1e3) / 1e3;
const getSmoothShadow = (rawDistance = 100, rawIntensity = 0.5, rawSharpness = 0.5, rgb = [0, 0, 0]) => {
  const maxDistance = 2e3;
  const maxLayers = 24;
  const distance = clamp(rawDistance * 2, 0, maxDistance);
  const intensity = clamp(rawIntensity, 0, 1);
  const sharpness = clamp(rawSharpness, 0, 1);
  const interpolatedDistance = invlerp(1, maxDistance, distance);
  const amountEasing = bezier(0.25, 1 - interpolatedDistance, 0.5, 1);
  const amountLayers = Math.round(maxLayers * amountEasing(interpolatedDistance));
  const distanceTransparency = bezier(0, 0.3, 0, 0.06);
  const transparencyBase = distanceTransparency(interpolatedDistance) / interpolatedDistance * 6.5;
  const finalTransparency = transparencyBase / maxLayers * intensity;
  const transparencyEasing = bezier(0, 1, 0.8, 0.5);
  const distanceX = distance * 0.5;
  const distanceY = distance * 0.75;
  const maxBlur = lerp(200, 500, interpolatedDistance);
  const finalBlur = lerp(100, maxBlur, sharpness);
  const blurSharpnessEase = bezier(1, 0, 1, 0);
  const easingBlurSharpness = lerp(0, 2, blurSharpnessEase(1 - sharpness));
  const blurEasing = bezier(1, easingBlurSharpness, 1, easingBlurSharpness);
  const easingSharpness = lerp(0, 0.075, 1 - sharpness);
  const distanceEasing = bezier(1, easingSharpness, 1, easingSharpness);
  return Array.from(Array(amountLayers)).map((_, i) => {
    const transparencyCoeff = transparencyEasing(i / amountLayers);
    const distanceCoeff = distanceEasing(i / amountLayers);
    const blurCoeff = blurEasing(i / amountLayers);
    const x = roundPixel(distanceX * distanceCoeff);
    const y = roundPixel(distanceY * distanceCoeff);
    const b = roundPixel(finalBlur * blurCoeff);
    const t = roundTransparency(finalTransparency * transparencyCoeff);
    return `${x}px ${y}px ${b}px rgba(${rgb[0]},${rgb[1]},${rgb[2]},${t})`;
  }).join(", ");
};

exports.getSmoothShadow = getSmoothShadow;
//# sourceMappingURL=index.js.map

declare type GetSmoothShadowFunction = (distance?: number, intensity?: number, sharpness?: number, rgb?: [number, number, number]) => string;
declare const getSmoothShadow: GetSmoothShadowFunction;

export { getSmoothShadow };

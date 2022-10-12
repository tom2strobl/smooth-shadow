declare type GetSmoothShadowOptions = {
    distance?: number;
    intensity?: number;
    sharpness?: number;
    color?: [number, number, number];
    lightPosition?: [number, number];
};
declare const getSmoothShadow: (options: GetSmoothShadowOptions) => string;

export { getSmoothShadow };

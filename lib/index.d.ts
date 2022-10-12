declare type GetSmoothShadowProps = {
    distance?: number;
    intensity?: number;
    sharpness?: number;
    color?: [number, number, number];
    lightPosition?: [number, number];
};
declare const getSmoothShadow: ({ distance, intensity, sharpness, color, lightPosition }: GetSmoothShadowProps) => string;

export { getSmoothShadow };

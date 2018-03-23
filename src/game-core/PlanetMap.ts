import { IPlanetConfig } from "./Planet";

export const PLANET_MAP: Map<string, IPlanetConfig> = new Map([
    ['test',
        {
            columns: 9,
            physics: {
                fallIV: 20,
                gravity: 0.05,
                maxGravity: 50,

                thrustIV: -2,
                thrustAccel: -0.1,
                maxThrust: -50,
                thrustDur: 0.2 * 1000,
                minThrust: -40
            },
            distribution: {
                YELLOW: 28,
                RED: 25,
                PURPLE: 25,
                PINK: 12,
                MINT: 10,
            },
        }
    ],
]);
import { IPlanetConfig } from "./Planet";

export const PLANET_MAP: Map<string, IPlanetConfig> = new Map([
    ['test',
        {
            columns: 9,
            spawner: {
                startInterval: 0.2 * 1000,
            },
            physics: {
                fallIV: 10,
                gravity: 1,
                maxGravity: 30,

                thrustIV: -0,
                thrustAccel: -3,
                maxThrust: -29.2,
                thrustDur: 1 * 1000,
            },
            distribution: {
                YELLOW: 23,
                RED: 23,
                PURPLE: 23,
                PINK: 17,
                MINT: 14,
            },
        }
    ],
]);

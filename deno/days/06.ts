import { assertEquals } from "jsr:@std/assert";

function parseInput(input: string) {
    const rows = input.split("\n").filter((r) => r);
    const height = rows.length;
    const width = rows[0].length;
    let guardLocation: [number, number] = [0, 0];
    const obstacleLocations = new Set<string>();
    

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (rows[i][j] === ".") {
                continue;
            }

            if (rows[i][j] === "^") {
                guardLocation = [i, j];
            } else if (rows[i][j] === "#") {
                obstacleLocations.add(`${i}:${j}`);
            }
        }
    }

    return { height, width, guardLocation, obstacleLocations };
}

export function partOne(input: string) {
    const { height, width, guardLocation, obstacleLocations } = parseInput(input);
    const walked = new Set<string>();
    let orientation = [-1, 0];  // up

    while ((0 <= guardLocation[0] && guardLocation[0] < height) && (0 <= guardLocation[1] && guardLocation[1] < width)) {
        walked.add(`${guardLocation[0]}:${guardLocation[1]}`);

        while (true) {
            const nextLocation = `${guardLocation[0] + orientation[0]}:${guardLocation[1] + orientation[1]}`;
            
            if (obstacleLocations.has(nextLocation)) {
                orientation = [orientation[1], -orientation[0]];
            } else {
                guardLocation[0] += orientation[0];
                guardLocation[1] += orientation[1];
                break;
            }
        }
    }

    return walked.size;
}

export function partTwo(input: string) {
    let { height, width, guardLocation, obstacleLocations } = parseInput(input);
    const originalGuardLocation: [number, number] = [...guardLocation];
    const walked = new Set<string>();
    const walkedWithOrientation = new Set<string>();
    let potentialObstacleLocations = 0;
    let orientation = [-1, 0];  // up

    // traverse the original path
    while ((0 <= guardLocation[0] && guardLocation[0] < height) && (0 <= guardLocation[1] && guardLocation[1] < width)) {
        walked.add(`${guardLocation[0]}:${guardLocation[1]}`);

        const nextLocation = `${guardLocation[0] + orientation[0]}:${guardLocation[1] + orientation[1]}`;

        if (obstacleLocations.has(nextLocation)) {
            orientation = [orientation[1], -orientation[0]];
        } else {
            guardLocation[0] += orientation[0];
            guardLocation[1] += orientation[1];
        }
    }

    for (const location of [...walked]) {
        orientation = [-1, 0];
        guardLocation = [...originalGuardLocation];
        walked.clear();
        walkedWithOrientation.clear();

        while ((0 <= guardLocation[0] && guardLocation[0] < height) && (0 <= guardLocation[1] && guardLocation[1] < width)) {
            const locationWithOrientation = `${guardLocation[0]}:${guardLocation[1]}:${orientation[0]}:${orientation[1]}`;

            if (walkedWithOrientation.has(locationWithOrientation)) {
                potentialObstacleLocations++;
                break;
            }

            walked.add(`${guardLocation[0]}:${guardLocation[1]}`);
            walkedWithOrientation.add(`${guardLocation[0]}:${guardLocation[1]}:${orientation[0]}:${orientation[1]}`);

            while (true) {
                const nextLocation = `${guardLocation[0] + orientation[0]}:${guardLocation[1] + orientation[1]}`;
                
                if (obstacleLocations.has(nextLocation) || location === nextLocation) {
                    orientation = [orientation[1], -orientation[0]];
                } else {
                    guardLocation[0] += orientation[0];
                    guardLocation[1] += orientation[1];
                    break;
                }
            }
        }
    }

    return potentialObstacleLocations;
}

Deno.test("test part 1", async () => {
    const input = await Deno.readTextFile(import.meta.dirname + "/../../data/examples/06.txt");

    assertEquals(partOne(input), 41);
});

Deno.test("test part 2", async () => {
    const input = await Deno.readTextFile(import.meta.dirname + "/../../data/examples/06.txt");

    assertEquals(partTwo(input), 6);
});

import { assertEquals } from "jsr:@std/assert/equals";

export function partOne(input: string) {
    const grid: string[][] = [];

    for (const row of input.split("\n")) {
        if (!row) {
            continue;
        }

        grid.push(row.split(""));
    }

    // preoptimization: use regex to match all horizontal XMAS/SAMXes
    // which is somehow 1ms faster than just matching manually
    // the lookahead is required to match overlapping XMAS/SAMXes
    let xmasCount = [...input.matchAll(/(?=(SAMX|XMAS))/gu)].length;

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] !== "X" && grid[i][j] !== "S") {
                continue;
            }

            if (i < grid.length - 3) {
                const str = grid[i][j] + grid[i + 1][j] + grid[i + 2][j] +
                    grid[i + 3][j];

                if (str === "XMAS" || str === "SAMX") {
                    xmasCount++;
                }
            }

            if (i < grid.length - 3 && j < grid[i].length - 3) {
                const str = grid[i][j] + grid[i + 1][j + 1] + grid[i + 2][j + 2] +
                    grid[i + 3][j + 3];

                if (str === "XMAS" || str === "SAMX") {
                    xmasCount++;
                }
            }

            if (i < grid.length - 3 && j >= 3) {
                const str = grid[i][j] + grid[i + 1][j - 1] + grid[i + 2][j - 2] +
                    grid[i + 3][j - 3];

                if (str === "XMAS" || str === "SAMX") {
                    xmasCount++;
                }
            }
        }
    }

    return xmasCount;
}

export function partTwo(input: string) {
    const grid: string[][] = [];

    for (const row of input.split("\n")) {
        if (!row) {
            continue;
        }

        grid.push(row.split(""));
    }

    let xmasCount = 0;

    // we're searching for the center of the X-MAS, so start from 1
    for (let i = 1; i < grid.length - 1; i++) {
        for (let j = 1; j < grid[i].length - 1; j++) {
            if (grid[i][j] !== "A") {
                continue;
            }

            const backward = grid[i - 1][j - 1] + grid[i][j] + grid[i + 1][j + 1];
            const forward = grid[i - 1][j + 1] + grid[i][j] + grid[i + 1][j - 1];
            const backwardMatches = backward === "MAS" || backward === "SAM";
            const forwardMatches = forward === "MAS" || forward === "SAM";

            if (backwardMatches && forwardMatches) {
                xmasCount += 1;
            }
        }
    }

    return xmasCount;
}

Deno.test("test part 1", async () => {
    const input = await Deno.readTextFile(
        import.meta.dirname + "/../../data/examples/04.txt",
    );

    assertEquals(partOne(input), 18);
});

Deno.test("test part 2", async () => {
    const input = await Deno.readTextFile(
        import.meta.dirname + "/../../data/examples/04.txt",
    );

    assertEquals(partTwo(input), 9);
});

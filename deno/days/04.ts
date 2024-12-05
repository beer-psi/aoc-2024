import { assertEquals } from "jsr:@std/assert/equals";

export function partOne(input: string) {
    const grid: string[][] = [];

    for (const row of input.split("\n")) {
        if (!row) {
            continue;
        }

        grid.push(row.split(""));
    }

    const targetWord = "XMAS" as const;
    const targetWordRev = targetWord.split("").reverse().join("");

    // evil regex hack to match horizontals, since it's faster than matching
    // individual characters like in the loop below
    let xmasCount =
        [...input.matchAll(new RegExp(`(?=(${targetWord}|${targetWordRev}))`, "gu"))].length;

    const directions: Array<[0 | 1 | -1, 0 | 1 | -1]> = [
        [1, 0], // vertical
        [1, 1], // forward slash
        [1, -1], // backward slash
    ];

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] !== targetWord[0] && grid[i][j] !== targetWordRev[0]) {
                continue;
            }

            for (const direction of directions) {
                const [dx, dy] = direction;
                const dxCheck = dx === 0 ||
                    (dx === 1 && i < grid.length - targetWord.length + 1) ||
                    (dx === -1 && i >= targetWord.length - 1);
                const dyCheck = dy === 0 ||
                    (dy === 1 && j < grid[i].length - targetWord.length + 1) ||
                    (dy === -1 && j >= targetWord.length - 1);

                if (!dxCheck || !dyCheck) {
                    continue;
                }

                let match = 1;

                for (let idx = 0; idx < targetWord.length; idx++) {
                    const char = grid[i + dx * idx][j + dy * idx];

                    if (char !== targetWord[idx] && char !== targetWordRev[idx]) {
                        match = 0;
                        break;
                    }
                }

                xmasCount += match;
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
    const input = await Deno.readTextFile(import.meta.dirname + "/../../data/examples/04.txt");

    assertEquals(partOne(input), 18);
});

Deno.test("test part 2", async () => {
    const input = await Deno.readTextFile(import.meta.dirname + "/../../data/examples/04.txt");

    assertEquals(partTwo(input), 9);
});

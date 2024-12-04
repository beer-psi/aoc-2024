import { assertEquals } from "jsr:@std/assert";

function parseInput(input: string) {
    return input
        .split("\n")
        .filter((row) => row)
        .map((row) => row.split(" ").map((c) => Number(c)));
}

function* windowGen<T>(input: Array<T>, size: number) {
    for (let i = 0; i + size <= input.length; i++) {
        yield input.slice(i, i + size);
    }
}

function checkReport(report: Array<number>) {
    const windows = Array.from(windowGen(report, 2));
    const sorted = windows.every((w) => w[0] < w[1]) || windows.every((w) => w[0] > w[1]);

    if (!sorted) {
        return false;
    }

    const maxDiffPair = windows.reduce((acc, c) => {
        const currentDiff = Math.abs(acc[0] - acc[1]);
        const newDiff = Math.abs(c[0] - c[1]);

        return newDiff > currentDiff ? c : acc;
    });

    if (Math.abs(maxDiffPair[0] - maxDiffPair[1]) > 3) {
        return false;
    }

    return true;
}

export function partOne(input: string) {
    const reports = parseInput(input);

    return reports.reduce((acc, _, i) => acc + (checkReport(reports[i]) ? 1 : 0), 0);
}

export function partTwo(input: string) {
    const reports = parseInput(input);

    return reports.reduce(
        (acc, _, i) => {
            const safeIsh = checkReport(reports[i]) || reports[i].some((_, j) => {
                const oneRemoved = reports[i].toSpliced(j, 1);

                return checkReport(oneRemoved);
            });

            return acc + (safeIsh ? 1 : 0);
        },
        0,
    );
}

Deno.test("test part 1", async () => {
    const input = await Deno.readTextFile(import.meta.dirname + "/../../data/examples/02.txt");

    assertEquals(partOne(input), 2);
});

Deno.test("test part 2", async () => {
    const input = await Deno.readTextFile(import.meta.dirname + "/../../data/examples/02.txt");

    assertEquals(partTwo(input), 4);
});

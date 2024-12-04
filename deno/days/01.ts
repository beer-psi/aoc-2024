import { assertEquals } from "jsr:@std/assert";

export function partOne(input: string) {
    const lhs: Array<number> = [];
    const rhs: Array<number> = [];

    for (const row of input.split("\n")) {
        const [left, right] = row.split("   ");

        if (!left || !right) {
            continue;
        }

        lhs.push(Number(left));
        rhs.push(Number(right));
    }

    lhs.sort((a, b) => a - b);
    rhs.sort((a, b) => a - b);

    return lhs.reduce((acc, c, i) => acc + Math.abs(c - rhs[i]), 0);
}

export function partTwo(input: string) {
    const lhs: Array<number> = [];
    const rhs: Array<number> = [];

    for (const row of input.split("\n")) {
        const [left, right] = row.split("   ");

        if (!left || !right) {
            continue;
        }

        lhs.push(Number(left));
        rhs.push(Number(right));
    }

    const lhsOccurences: Record<string, number> = {};
    const rhsOccurences: Record<string, number> = {};

    lhs.forEach((i) => lhsOccurences[i] = (lhsOccurences[i] ?? 0) + 1);
    rhs.forEach((i) => rhsOccurences[i] = (rhsOccurences[i] ?? 0) + 1);

    let score = 0;

    for (const [numStr, occurence] of Object.entries(lhsOccurences)) {
        const num = Number(numStr);
        const rhsOccurence = rhsOccurences[num];

        if (!rhsOccurence) {
            continue;
        }

        score += num * occurence * rhsOccurence;
    }

    return score;
}

Deno.test("test part 1", async () => {
    const input = await Deno.readTextFile(import.meta.dirname + "/../../data/examples/01.txt");

    assertEquals(partOne(input), 11);
});

Deno.test("test part 2", async () => {
    const input = await Deno.readTextFile(import.meta.dirname + "/../../data/examples/02.txt");

    assertEquals(partTwo(input), 31);
});

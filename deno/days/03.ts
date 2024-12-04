import { assertEquals } from "jsr:@std/assert/equals";

export function partOne(input: string) {
    return input
        .matchAll(/mul\((\d+),(\d+)\)/ug)
        .map((m) => {
            const [_, first, second] = m;

            if (!first || !second) {
                return 0;
            }

            return Number(first) * Number(second);
        })
        .reduce((acc, c) => acc + c, 0);
}

export function partTwo(input: string) {
    let enabled = true;
    let result = 0;

    for (
        const match of input.matchAll(/(mul)\((\d+),(\d+)\)|(do)\(\)|(don't)\(\)/ug)
    ) {
        if (match[4] === "do") {
            enabled = true;
            continue;
        }

        if (match[5] === "don't") {
            enabled = false;
            continue;
        }

        if (match[1] === "mul" && enabled) {
            const left = Number(match[2]);
            const right = Number(match[3]);

            result += left * right;
        }
    }

    return result;
}

Deno.test("test part 1", async () => {
    const input = await Deno.readTextFile(
        import.meta.dirname + "/../../data/examples/03_1.txt",
    );

    assertEquals(partOne(input), 161);
});

Deno.test("test part 2", async () => {
    const input = await Deno.readTextFile(
        import.meta.dirname + "/../../data/examples/03_2.txt",
    );

    assertEquals(partTwo(input), 48);
});

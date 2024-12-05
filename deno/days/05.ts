import { assertEquals } from "jsr:@std/assert";

type Input = {
    orderingRules: Array<[number, number]>;
    updates: Array<Array<number>>;
};

function parseRules(input: string): Input {
    const [pageOrderingRules, pagesToProduce] = input.split("\n\n", 2);

    return {
        orderingRules: pageOrderingRules
            .split("\n")
            .filter((r) => r)
            .map((r) =>
                r.split("|", 2).map((n) => Number(n)) as [number, number]
            ),
        updates: pagesToProduce
            .split("\n")
            .filter((r) => r)
            .map((r) => 
                r.split(",").map((n) => Number(n))
            )
    };
}

export function partOne(input: string) {
    const { orderingRules, updates } = parseRules(input);
    let sum = 0;

    for (const update of updates) {
        const sorted = update.toSorted((a, b) => {
            const relevantRule = orderingRules.find((r) => (r[0] === a && r[1] === b) || (r[0] === b && r[1] === a));

            if (!relevantRule) {
                return 0;
            }

            if (relevantRule[0] === a) {
                return -1;
            }

            if (relevantRule[0] === b) {
                return 1;
            }

            return 0;
        });

        if (update.every((p, i) => p === sorted[i])) {
            const middlePage = update[Math.floor(update.length / 2)];
            
            sum += middlePage;
        }
    }

    return sum;
}

export function partTwo(input: string) {
    const { orderingRules, updates } = parseRules(input);
    let sum = 0;

    for (const update of updates) {
        const sorted = update.toSorted((a, b) => {
            const relevantRule = orderingRules.find((r) => (r[0] === a && r[1] === b) || (r[0] === b && r[1] === a));

            if (!relevantRule) {
                return 0;
            }

            if (relevantRule[0] === a) {
                return -1;
            }

            if (relevantRule[0] === b) {
                return 1;
            }

            return 0;
        });

        if (update.some((p, i) => p !== sorted[i])) {
            const middlePage = sorted[Math.floor(sorted.length / 2)];
            
            sum += middlePage;
        }
    }

    return sum;
}

Deno.test("test part 1", async () => {
    const input = await Deno.readTextFile(import.meta.dirname + "/../../data/examples/05.txt");

    assertEquals(partOne(input), 143);
});

Deno.test("test part 2", async () => {
    const input = await Deno.readTextFile(import.meta.dirname + "/../../data/examples/05.txt");

    assertEquals(partTwo(input), 123);
});

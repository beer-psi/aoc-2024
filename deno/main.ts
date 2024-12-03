import { Command } from "npm:commander";

interface DaySolution<T0 = unknown, T1 = unknown> {
    partOne: (input: string) => T0;
    partTwo: (input: string) => T1;
}

function runPart<R>(fn: (input: string) => R, input: string, part: number) {
    const start = performance.now();
    const result = fn(input);
    const end = performance.now();

    console.log(`Part ${part}: ${result} (${(end - start).toFixed(6)}ms)`);
}

if (import.meta.main) {
    const program = new Command().name("advent-of-code");

    program
        .command("solve")
        .option("-d, --day <number>", "day to solve", (new Date().getDay() + 1).toString())
        .action(async (options) => {
            const day = Number(options.day);

            if (day < 1 || day > 25) {
                throw new TypeError("Invalid date. Must be between 1 and 25.");
            }

            const dayPadded = day.toString().padStart(2, "0");
            const input = await Deno.readTextFile(
                import.meta.dirname + `/data/inputs/${dayPadded}.txt`,
            );
            const module: DaySolution = await import(
                "file://" + import.meta.dirname + `/days/${dayPadded}.ts`
            );

            runPart(module.partOne, input, 1);
            runPart(module.partTwo, input, 2);
        });

    await program.parseAsync();
}

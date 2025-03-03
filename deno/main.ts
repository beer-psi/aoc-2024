import { Command } from "npm:commander";
import Mustache from "npm:mustache";

interface DaySolution<T0 = unknown, T1 = unknown> {
    partOne: (input: string) => T0;
    partTwo: (input: string) => T1;
}

async function runPart<R>(
    fn: (input: string) => R,
    input: string,
    day: number,
    part: number,
    submit: boolean = false,
) {
    const start = performance.now();
    const result = fn(input);
    const end = performance.now();

    if (result !== null && result !== undefined) {
        console.log(`Part ${part}: ${result} (${(end - start).toFixed(6)}ms)`);

        if (submit) {
            console.log(`Submitting solution for part ${part}...`);

            const command = new Deno.Command("aoc", {
                args: [
                    "submit",
                    "--day",
                    day.toString(),
                    part.toString(),
                    result.toString(),
                ],
                stdout: "inherit",
                stderr: "inherit",
            });

            await command.output();
        }
    } else {
        console.log(`Part ${part}: No answer`);
    }
}

if (import.meta.main) {
    const program = new Command().name("advent-of-code");

    program
        .command("solve")
        .option(
            "-d, --day <number>",
            "day to solve",
            (new Date().getDay() + 1).toString(),
        )
        .option("-s, --submit", "submit your solution", false)
        .action(async (options) => {
            const day = Number(options.day);
            const submit = options.submit as boolean;

            if (day < 1 || day > 25) {
                throw new TypeError("Invalid date. Must be between 1 and 25.");
            }

            const dayPadded = day.toString().padStart(2, "0");
            const input = await Deno.readTextFile(
                import.meta.dirname + `/../data/inputs/${dayPadded}.txt`,
            );
            const module: DaySolution = await import(
                "file://" + import.meta.dirname + `/days/${dayPadded}.ts`
            );

            await runPart(module.partOne, input, day, 1, submit);
            await runPart(module.partTwo, input, day, 2, submit);
        });

    program
        .command("scaffold")
        .argument("[day]", "day to scaffold", (new Date().getDay() + 1).toString())
        .option("-o, --overwrite", "force overwrite", false)
        .action(async (dayString: string) => {
            const day = Number(dayString);

            if (day < 1 || day > 25) {
                throw new TypeError("Invalid date. Must be between 1 and 25.");
            }

            const dayPadded = day.toString().padStart(2, "0");
            const template = await Deno.readTextFile(
                import.meta.dirname + `/_template.ts.mustache`,
            );
            const rendered = Mustache.render(template, { day: dayPadded });

            await Deno.writeTextFile(
                import.meta.dirname + `/days/${dayPadded}.ts`,
                rendered,
            );
            console.log(`Created module file days/${dayPadded}.ts`);

            await Deno.writeTextFile(
                import.meta.dirname + `/../data/inputs/${dayPadded}.txt`,
                "",
            );
            console.log(`Created empty example file data/inputs/${dayPadded}.txt`);

            await Deno.writeTextFile(
                import.meta.dirname + `/../data/examples/${dayPadded}.txt`,
                "",
            );
            console.log(`Created empty example file data/examples/${dayPadded}.txt`);
        });

    await program.parseAsync();
}

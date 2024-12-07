import { assertEquals } from "jsr:@std/assert";

type Calibration = {
    numbers: number[];
    result: number;
}

function parseInput(input: string) {
    return input.split("\n")
        .filter((r) => r)
        .map((r) => {
            const [result, numbers] = r.split(": ");

            return {
                numbers: numbers.split(" ").map((n) => Number(n)),
                result: Number(result),
            } as Calibration;
        });
}


function isValidCalibrationP1(calibration: Calibration) {
    const { numbers, result } = calibration;
    const operatorCount = numbers.length - 1;

    // abusing a bitmask to create operator combinations for us
    // high: multiply, low: addition
    for (let i = 0; i < (1 << operatorCount); i++) {
        let currentResult = numbers[0];

        for (let j = 0; j < operatorCount; j++) {
            const currentOperator = i & (1 << j);

            if (currentOperator) {
                currentResult *= numbers[j + 1];
            } else {
                currentResult += numbers[j + 1];
            }
        }

        if (result === currentResult) {
            return true;
        }
    }

    return false;
}

export function partOne(input: string) {
    const calibrations = parseInput(input);
    let totalCalibrationResult = 0;

    for (const calibration of calibrations) {
        const maxPossible = calibration.numbers.reduce((acc, c) => acc * c, 1);

        if (calibration.result > maxPossible) {
            continue;
        }

        if (isValidCalibrationP1(calibration)) {
            totalCalibrationResult += calibration.result;
        }
    }

    return totalCalibrationResult;
}

function isValidCalibrationP2(calibration: Calibration) {
    const { numbers, result } = calibration;
    const operatorCount = numbers.length - 1;
    
    for (let i = 0; i < Math.pow(3, operatorCount); i++) {
        let currentResult = numbers[0];
        let multiplier = 1;

        for (let j = 0; j < operatorCount; j++) {
            const currentOperator = Math.floor(i / multiplier) % 3;
            const currentNumber = numbers[j + 1];

            if (currentOperator === 0) {
                currentResult += currentNumber;
            } else if (currentOperator === 1) {
                currentResult *= currentNumber;
            } else {
                const currentNumberDigits = Math.log10(currentNumber);
                currentResult = currentResult * currentNumberDigits + currentNumber;
            }

            multiplier *= 3;
        }

        if (result === currentResult) {
            return true;
        }
    }

    return false;
}

export function partTwo(input: string) {
    const calibrations = parseInput(input);
    let totalCalibrationResult = 0;

    for (const calibration of calibrations) {
        if (isValidCalibrationP2(calibration)) {
            totalCalibrationResult += calibration.result;
        }
    }

    return totalCalibrationResult;
}

Deno.test("test part 1", async () => {
    const input = await Deno.readTextFile(import.meta.dirname + "/../../data/examples/07.txt");

    assertEquals(partOne(input), 3749);
});

Deno.test("test part 2", async () => {
    const input = await Deno.readTextFile(import.meta.dirname + "/../../data/examples/07.txt");

    assertEquals(partTwo(input), 11387);
});

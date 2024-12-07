Deno.bench("concatenating using number -> string -> number", { baseline: true }, () => {
    const number1 = Math.random() * Number.MAX_SAFE_INTEGER | 0;
    const number2 = Math.random() * Number.MAX_SAFE_INTEGER | 0;

    Number(`${number1}${number2}`);
})

Deno.bench("concatenating by counting number of digits in 2nd number", () => {
    const number1 = Math.random() * Number.MAX_SAFE_INTEGER | 0;
    const number2 = Math.random() * Number.MAX_SAFE_INTEGER | 0;

    const numberOfDigits = Math.log10(number2) + 1 | 0;

    const result = number1 * (10 ** numberOfDigits) + number2;
}); 

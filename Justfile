# Download puzzle input to file.
download DAY:
    aoc download --day "{{DAY}}" \
        --input-file "$(printf 'data/inputs/%02d.txt' {{DAY}})" \
        --input-only --overwrite

solve DAY *FLAGS:
    deno run -A deno/main.ts solve --day "{{DAY}}" {{FLAGS}}

fmt:
    deno fmt --indent-width=4 --line-width=100 deno/

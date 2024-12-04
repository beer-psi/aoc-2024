# List the current recipes.
default:
    just --list

# Download puzzle input to file.
download DAY:
    aoc download --day "{{DAY}}" \
        --input-file "$(printf 'data/inputs/%02d.txt' {{DAY}})" \
        --input-only --overwrite

# Scaffold a day's solution.
scaffold *ARGS:
    deno run -A deno/main.ts scaffold {{ARGS}}

# Solve the puzzle for a given day, and optionally submit it with -s, --submit.
solve DAY *FLAGS:
    deno run -A deno/main.ts solve --day "{{DAY}}" {{FLAGS}}

# Format the code.
fmt:
    deno fmt --indent-width=4 --line-width=100 deno/

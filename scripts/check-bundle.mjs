// Fails if the bundled script contains constructs the Flipper's mJS engine
// has choked on (see CLAUDE.md "Observed on a real device").
import { readFileSync } from "node:fs";

const file = process.argv[2] ?? "dist/flipper-js-playground.js";
const lines = readFileSync(file, "utf8").split("\n");
const problems = [];

lines.forEach((line, i) => {
    if (/__toESM|__commonJS|__getOwnPropNames|__copyProps/.test(line)) {
        problems.push(`${i + 1}: esbuild module helper (needs closures/Object APIs mJS lacks): ${line.trim()}`);
    }
    // esbuild prints `} else {` on one line, so a line starting with `else`
    // means the source used a brace-less if/else, which mJS cannot parse.
    if (/^\s*else\b/.test(line)) {
        problems.push(`${i + 1}: brace-less if/else (use braces in the source): ${line.trim()}`);
    }
});

if (problems.length > 0) {
    console.error(`${file} is not mJS-safe:\n${problems.join("\n")}`);
    process.exit(1);
}
console.log(`${file}: ok (${lines.length} lines)`);

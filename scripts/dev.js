import { spawn } from "node:child_process";

function run(command, args, options = {}) {
    const child = spawn(command, args, { stdio: "inherit", shell: true, ...options });

    child.on("exit", (code) => {
        if (code !== 0) {
            console.error(`Process exited with code ${code}: ${command} ${args.join(" ")}`);
        }
        });

        return child;
}

// Run backend and frontend in parallel
run("npm", ["run", "dev"], { cwd: "backend" });
run("npm", ["run", "dev"], { cwd: "frontend" });

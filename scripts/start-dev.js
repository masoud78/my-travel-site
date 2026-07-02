/**
 * Robust dev-server starter for Rivansafar.
 * Prefers PORT env or 3001 (stable fallback because 3000 is occupied).
 * If Next.js fails with EADDRINUSE, auto-retries on the next free port.
 */
const { spawn } = require("child_process");
const net = require("net");
const path = require("path");

const PREFERRED_PORT = Number(process.env.PORT) || 3001;
const MAX_TRIES = 20; // ports PREFERRED_PORT .. PREFERRED_PORT+19

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    server.listen(port, "0.0.0.0");
  });
}

async function findNextAvailablePort(start) {
  for (let port = start; port < start + MAX_TRIES; port++) {
    if (await isPortAvailable(port)) return port;
  }
  throw new Error(`No free port found between ${start} and ${start + MAX_TRIES - 1}`);
}

const nextBin = require.resolve("next/dist/bin/next");

function startNext(port, attempt = 0) {
  if (port !== PREFERRED_PORT) {
    console.warn(`⚠ Port ${PREFERRED_PORT} was in use. Using fallback port ${port} (attempt ${attempt + 1}).`);
  } else {
    console.log(`✓ Starting Next.js dev server on port ${port}...`);
  }

  const child = spawn(process.execPath, [nextBin, "dev", "-p", String(port)], {
    stdio: "pipe",
    env: process.env,
  });

  let output = "";
  child.stdout.on("data", (d) => {
    output += d.toString();
    process.stdout.write(d);
  });
  child.stderr.on("data", (d) => {
    output += d.toString();
    process.stderr.write(d);
  });

  child.on("exit", async (code) => {
    const isAddrInUse = output.includes("EADDRINUSE");
    if (isAddrInUse && attempt < MAX_TRIES - 1) {
      const nextPort = await findNextAvailablePort(port + 1);
      return startNext(nextPort, attempt + 1);
    }
    process.exit(code ?? 0);
  });
}

async function main() {
  const port = await findNextAvailablePort(PREFERRED_PORT);
  startNext(port, 0);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

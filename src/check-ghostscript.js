import { spawn } from "child_process";

export async function checkGhostscript() {
  return new Promise((resolve, reject) => {
    const command = process.platform === "win32" ? "gswin64c" : "gs";

    const processGs = spawn(command, ["-version"]);

    processGs.on("error", () => {
      reject(new Error("Ghostscript is not installed or not found in PATH."));
    });

    processGs.on("close", (code) => {
      if (code === 0) {
        resolve(true);
      } else {
        reject(new Error("Ghostscript check failed."));
      }
    });
  });
}

import { spawn } from "child_process";

export const processAI = (req, res) => {
  try {
    const process = spawn("python", ["./scripts/test.py"]);

    let result = "";
    process.stdout.on("data", (data) => {
      result += data.toString();
    });

    process.stderr.on("data", (data) => {
      console.error(`Python error: ${data}`);
    });

    process.on("close", () => {
      res.json({ message: result.trim() }); // Trimite un singur răspuns JSON
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

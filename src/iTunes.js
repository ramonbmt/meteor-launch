import { execSync } from "child_process";
import util from "./util";

const uploadTestFlight = env => (
  new Promise((resolve) => {
    console.log(env)
    if (!util.hasPlatform("ios",env)) {
      console.log("Skipping iOS upload to TestFlight...");
      return resolve("skipped");
    }
    
    console.log("Uploading iOS to TestFlight...");

    execSync("fastlane ios beta", {
      stdio: [0, 1, 2],
      env,
    });

    return resolve("uploaded");
  })
);

const uploadAppStore = env => (
  new Promise((resolve) => {
    if (!util.hasPlatform("ios",env)) {
      console.log("Skipping iOS upload to iTunes...");
      return resolve("skipped");
    }

    console.log("Uploading to iTunes...");

    execSync("fastlane ios deploy", {
      stdio: [0, 1, 2],
      env,
    });

    return resolve("uploaded");
  })
);

export default {
  uploadTestFlight,
  uploadAppStore,
};

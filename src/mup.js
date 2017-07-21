import { execSync } from "child_process";

const deploy = env => (
  new Promise((resolve, reject) => {
    try {
      execSync("which mup");
    } catch (e) {
      /* istanbul ignore next */
      console.log("Please install mup");
      /* istanbul ignore next */
      //execSync("npm install -g playup");
    }
    execSync("mup deploy");

    return resolve("deploy");
  })
);

export default {
  deploy,
};

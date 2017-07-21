import { execSync } from "child_process";
import { join } from "path";
import util from "./util";

const settings = util.generateSettings(process.env);
const outputDir = settings.METEOR_OUTPUT_ABSOLUTE;
const xcode_name = settings.XCODE_SCHEME_NAME;

const buildFolder = {
  root: `${outputDir}/ios/project/${xcode_name}/Images.xcassets/AppIcon.appiconset`,
};

const unusedIcons = {
  "icon.png"        : `${buildFolder.root}/icon.png`,
  "icon@2x.png"     : `${buildFolder.root}/icon@2x.png`,
  "icon-50.png"     : `${buildFolder.root}/icon-50.png`,
  "icon-50@2x.png"  : `${buildFolder.root}/icon-50@2x.png`,
  "icon-72.png"     : `${buildFolder.root}/icon-72.png`,
  "icon-72@2x.png"  : `${buildFolder.root}/icon-72@2x.png`,
}

const cleanUnusedIcons = (env) => {
  const contentsFile = join(buildFolder.root, "Contents.json");
  let contentsVars = {};
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    contentsVars = require(contentsFile);
    // eslint-disable-next-line no-empty
    //console.log(contentsVars)
  } catch (error) { return {}; }
  for(let key in unusedIcons){
    let value = unusedIcons[key];
    
    execSync(`rm -f ${value}`)
  }
  //console.log(contentsVars)
}

const uploadTestFlight = env => (
  new Promise((resolve,reject) => {
    if (!util.hasPlatform("ios",env)) {
      console.log("Skipping iOS upload to TestFlight...");
      return resolve("skipped");
    }
    try {
      cleanUnusedIcons(env);
    } catch (error) { 
      return reject(error);
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

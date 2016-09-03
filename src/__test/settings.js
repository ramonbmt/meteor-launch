/* global describe it beforeEach */

// eslint-disable-next-line
import { assert } from "chai";
import { execSync } from "child_process";
import { resolve } from "path";

import util from "../util";

describe("settings", () => {
  describe("ANDROID_ZIPALIGN", () => {
    beforeEach(() => {
      delete process.env.ANDROID_ZIPALIGN;
      // eslint-disable-next-line
      execSync(`echo '{"ANDROID_ZIPALIGN": "/nonsense"}' > launch.json`);
    });
    it("should pass through absolute zipalign path", () => {
      process.env.ANDROID_ZIPALIGN = "/meow";
      const results = util.generateSettings(process.env);
      assert.equal(results.ANDROID_ZIPALIGN, "/meow");
    });
    it("should resolve home zipalign path", () => {
      process.env.ANDROID_ZIPALIGN = "~/meow";
      const results = util.generateSettings(process.env);
      assert.equal(results.ANDROID_ZIPALIGN, `${process.env.HOME}/meow`);
    });
    it("should resolve relative zipalign path", () => {
      process.env.ANDROID_ZIPALIGN = "../meow";
      const results = util.generateSettings(process.env);
      assert.equal(
        results.ANDROID_ZIPALIGN,
        resolve(
          process.cwd(),
          "../meow"
        )
      );
    });
  });
  describe("METEOR_INPUT_DIR", () => {
    beforeEach(() => {
      delete require.cache[
        `${process.cwd()}/launch.json`
      ];
    });
    it("should be root directory if doesn't exists", () => {
      // eslint-disable-next-line
      execSync(`echo '{}' > launch.json`);
      const results = util.generateSettings(process.env);
      assert.equal(results.METEOR_INPUT_DIR, process.cwd());
    });
    it("should be root directory if blank", () => {
      // eslint-disable-next-line
      execSync(`echo '{"METEOR_INPUT_DIR": ""}' > launch.json`);
      const results = util.generateSettings(process.env);
      assert.equal(results.METEOR_INPUT_DIR, process.cwd());
    });
    it("should be absolute path to directory if set", () => {
      // eslint-disable-next-line
      execSync(`echo '{"METEOR_INPUT_DIR": "nonsense"}' > launch.json`);
      const results = util.generateSettings(process.env);
      assert.equal(
        results.METEOR_INPUT_DIR,
        resolve(
          process.cwd(),
          "nonsense"
        )
      );
    });
  });
  describe("METEOR_OUTPUT_DIR", () => {
    beforeEach(() => {
      delete require.cache[
        `${process.cwd()}/launch.json`
      ];
    });
    it("should set as .build if no METEOR_OUTPUT_DIR", () => {
      // eslint-disable-next-line
      execSync(`echo '{}' > launch.json`);
      const results = util.generateSettings(process.env);
      assert.equal(results.METEOR_OUTPUT_DIR, ".build");
    });
    it("should set as .build if blank METEOR_OUTPUT_DIR", () => {
      // eslint-disable-next-line
      execSync(`echo '{"METEOR_OUTPUT_DIR": ""}' > launch.json`);
      const results = util.generateSettings(process.env);
      assert.equal(results.METEOR_OUTPUT_DIR, ".build");
    });
    it("should set METEOR_OUTPUT_DIR if in launch.json", () => {
      // eslint-disable-next-line
      execSync(`echo '{"METEOR_OUTPUT_DIR": "../nonsense"}' > launch.json`);
      const results = util.generateSettings(process.env);
      assert.equal(results.METEOR_OUTPUT_DIR, "../nonsense");
    });
  });
  describe("METEOR_OUTPUT_ABSOLUTE", () => {
    beforeEach(() => {
      delete require.cache[
        `${process.cwd()}/launch.json`
      ];
    });
    it("should set as absolute of .build if no METEOR_OUTPUT_DIR", () => {
      // eslint-disable-next-line
      execSync(`echo '{}' > launch.json`);
      const results = util.generateSettings(process.env);
      assert.equal(results.METEOR_OUTPUT_ABSOLUTE, `${process.cwd()}/.build`);
    });
    it("should set as absolute of .build if blank METEOR_OUTPUT_DIR", () => {
      // eslint-disable-next-line
      execSync(`echo '{"METEOR_OUTPUT_DIR": ""}' > launch.json`);
      const results = util.generateSettings(process.env);
      assert.equal(results.METEOR_OUTPUT_ABSOLUTE, `${process.cwd()}/.build`);
    });
    it("should set absolute of METEOR_OUTPUT_DIR if exists", () => {
      // eslint-disable-next-line
      execSync(`echo '{"METEOR_OUTPUT_DIR": "../nonsense"}' > launch.json`);
      const results = util.generateSettings(process.env);
      assert.equal(
        results.METEOR_OUTPUT_ABSOLUTE,
        resolve(
          process.cwd(),
          "..",
          "nonsense"
        )
      );
    });
  });
  describe("FL_REPORT_PATH", () => {
    beforeEach(() => {
      delete require.cache[
        `${process.cwd()}/launch.json`
      ];
    });
    it("should use .build by default", () => {
      // eslint-disable-next-line
      execSync(`echo '{}' > launch.json`);
      const results = util.generateSettings(process.env);
      assert.equal(results.FL_REPORT_PATH, resolve(
        process.cwd(),
        ".build",
        "ios"
      ));
    });
    it("should use custom output dir if specified", () => {
      // eslint-disable-next-line
      execSync(`echo '{"METEOR_OUTPUT_DIR": "../nonsense"}' > launch.json`);
      const results = util.generateSettings(process.env);
      assert.equal(results.FL_REPORT_PATH, resolve(
        process.cwd(),
        "..",
        "nonsense",
        "ios"
      ));
    });
  });
  describe("XCODE_PROJECT", () => {
    beforeEach(() => {
      delete require.cache[
        `${process.cwd()}/launch.json`
      ];
    });
    it("should use .build by default", () => {
      // eslint-disable-next-line
      execSync(`echo '{"XCODE_SCHEME_NAME": "scheme"}' > launch.json`);
      const results = util.generateSettings(process.env);
      assert.equal(results.XCODE_PROJECT, resolve(
        process.cwd(),
        ".build",
        "ios",
        "project",
        "scheme.xcodeproj"
      ));
    });
    it("should use custom output dir if specified", () => {
      // eslint-disable-next-line
      execSync(`echo '{"XCODE_SCHEME_NAME": "scheme", "METEOR_OUTPUT_DIR": "../nonsense"}' > launch.json`);
      const results = util.generateSettings(process.env);
      assert.equal(results.XCODE_PROJECT, resolve(
        process.cwd(),
        "..",
        "nonsense",
        "ios",
        "project",
        "scheme.xcodeproj"
      ));
    });
  });
  describe("SIGH_OUTPUT_PATH", () => {
    beforeEach(() => {
      delete require.cache[
        `${process.cwd()}/launch.json`
      ];
    });
    it("should be the current directory", () => {
      // eslint-disable-next-line
      execSync(`echo '{}' > launch.json`);
      const results = util.generateSettings(process.env);
      assert.equal(results.SIGH_OUTPUT_PATH, process.cwd());
    });
  });
  describe("GYM_OUTPUT_DIRECTORY", () => {
    beforeEach(() => {
      delete require.cache[
        `${process.cwd()}/launch.json`
      ];
    });
    it("should be the current directory", () => {
      // eslint-disable-next-line
      execSync(`echo '{}' > launch.json`);
      const results = util.generateSettings(process.env);
      assert.equal(results.GYM_OUTPUT_DIRECTORY, process.cwd());
    });
  });
});
/** @type {import("jest").Config} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests/unitTests"],
  testMatch: ["**/*.unit.test.ts"],
  clearMocks: true,
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
      },
    ],
  },
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/*.spec.ts",
    "!**/*.test.ts",
    "!**/**/__tests__/**",
    "!**/**/node_modules/**",
    "!**/**/dist/**",
    "!**/generated/**"
  ],
  coverageDirectory: "coverage",

};

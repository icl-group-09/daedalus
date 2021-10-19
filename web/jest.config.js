module.exports = {
    setupFilesAfterEnv: ['./jest-setup.js'],
    transformIgnorePatterns: ["node_modules/(?!(three/examples|three/src))"]
  }
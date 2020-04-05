module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleFileExtensions: ['js', 'json', 'vue', 'ts'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest'
  },
  moduleNameMapper: {
    '^[@~]/(.*)$': '<rootDir>/$1'
  },
  snapshotSerializers: ['jest-serializer-vue'],
  setupFiles: ['<rootDir>/__tests__/setup.ts'],
  testRegex: '/__tests__/.*.(test|spec).[jt]sx?$'
}

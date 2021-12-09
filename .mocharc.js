module.exports = {
  require: ['ts-node/register'],
  checkLeaks: true,
  timeout: 10 * 1000,
  growl: true,
  extension: ['.spec.ts']
}
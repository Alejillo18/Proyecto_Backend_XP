module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['tests/step_definitions/**/*.ts'],
    format: ['progress-bar', 'summary'],
    paths: ['features/**/*.feature']
  }
};

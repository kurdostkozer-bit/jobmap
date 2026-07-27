const webpack = require('webpack');
const configFactory = require('./node_modules/react-scripts/config/webpack.config');
const paths = require('./node_modules/react-scripts/config/paths');
const fs = require('fs-extra');
const chalk = require('react-dev-utils/chalk');

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
process.env.CI = 'true';
process.env.GENERATE_SOURCEMAP = 'false';

const config = configFactory('production');

function logStage(label) {
  console.log(`[TRACE] ${label}`);
}

const compiler = webpack(config);

compiler.hooks.environment.tap('TracePlugin', () => logStage('environment'));
compiler.hooks.afterEnvironment.tap('TracePlugin', () => logStage('afterEnvironment'));
compiler.hooks.entryOption.tap('TracePlugin', () => logStage('entryOption'));
compiler.hooks.beforeRun.tap('TracePlugin', () => logStage('beforeRun'));
compiler.hooks.run.tap('TracePlugin', () => logStage('run'));
compiler.hooks.watchRun.tap('TracePlugin', () => logStage('watchRun'));
compiler.hooks.normalModuleFactory.tap('TracePlugin', () => logStage('normalModuleFactory'));
compiler.hooks.contextModuleFactory.tap('TracePlugin', () => logStage('contextModuleFactory'));
compiler.hooks.compile.tap('TracePlugin', () => logStage('compile'));
compiler.hooks.thisCompilation.tap('TracePlugin', compilation => logStage(`thisCompilation:${compilation.name}`));
compiler.hooks.compilation.tap('TracePlugin', compilation => logStage(`compilation:${compilation.name}`));
compiler.hooks.make.tap('TracePlugin', compilation => logStage(`make:${compilation.name}`));
compiler.hooks.afterCompile.tap('TracePlugin', () => logStage('afterCompile'));
compiler.hooks.shouldEmit.tap('TracePlugin', () => logStage('shouldEmit'));
compiler.hooks.emit.tap('TracePlugin', () => logStage('emit'));
compiler.hooks.afterEmit.tap('TracePlugin', () => logStage('afterEmit'));
compiler.hooks.done.tap('TracePlugin', stats => logStage(`done:${stats.compilation.errors.length}/${stats.compilation.warnings.length}`));

compiler.hooks.normalModuleFactory.tap('TracePlugin', nmf => {
  nmf.hooks.beforeResolve.tap('TracePlugin', r => {
    if (r) {
      console.log(`[TRACE] beforeResolve:${r.request}`);
    }
  });
  nmf.hooks.afterResolve.tap('TracePlugin', r => {
    if (r) {
      console.log(`[TRACE] afterResolve:${r.createData && r.createData.resource}`);
    }
  });
});

config.plugins.forEach((plugin, index) => {
  if (plugin && plugin.constructor && plugin.constructor.name) {
    console.log(`[PLUGIN] ${index}:${plugin.constructor.name}`);
  }
});

fs.emptyDirSync(paths.appBuild);

compiler.run((err, stats) => {
  if (err) {
    console.error('ERR', err);
    process.exit(1);
  }
  console.log('[TRACE] compiler.run callback');
  console.log(stats.toString({ all: false, assets: true, modules: false, errors: true, warnings: true }));
});

const webpack = require('webpack');
const configFactory = require('react-scripts/config/webpack.config');
const paths = require('react-scripts/config/paths');
const fs = require('fs-extra');

process.env.NODE_ENV = 'production';
process.env.BABEL_ENV = 'production';
process.env.CI = 'true';
process.env.GENERATE_SOURCEMAP = 'false';

const config = configFactory('production');
console.log('[TRACE] starting webpack build');
console.log('[TRACE] minimizers', config.optimization.minimizer.map(m => m && m.constructor && m.constructor.name));

const compiler = webpack(config);
let lastModule = '(none)';
let moduleCount = 0;

compiler.hooks.environment.tap('Trace', () => console.log('[HOOK] environment'));
compiler.hooks.afterEnvironment.tap('Trace', () => console.log('[HOOK] afterEnvironment'));
compiler.hooks.entryOption.tap('Trace', () => console.log('[HOOK] entryOption'));
compiler.hooks.beforeRun.tap('Trace', () => console.log('[HOOK] beforeRun'));
compiler.hooks.run.tap('Trace', () => console.log('[HOOK] run'));
compiler.hooks.compile.tap('Trace', () => console.log('[HOOK] compile'));
compiler.hooks.thisCompilation.tap('Trace', compilation => {
  console.log('[HOOK] thisCompilation');
  compilation.hooks.buildModule.tap('Trace', module => {
    moduleCount += 1;
    const id = module.resource || module.identifier || module.name || module.rawRequest || '(unknown)';
    lastModule = id;
    if (moduleCount <= 20 || moduleCount % 100 === 0) {
      console.log(`[MODULE] ${moduleCount}: ${id}`);
    }
  });
  compilation.hooks.finishModules.tap('Trace', () => {
    console.log(`[HOOK] finishModules (last module: ${lastModule})`);
  });
  compilation.hooks.seal.tap('Trace', () => console.log('[HOOK] seal'));
  compilation.hooks.optimizeModules.tap('Trace', () => console.log('[HOOK] optimizeModules'));
  compilation.hooks.optimizeChunkModules.tap('Trace', () => console.log('[HOOK] optimizeChunkModules'));
  compilation.hooks.optimizeAssets.tap('Trace', assets => console.log('[HOOK] optimizeAssets', Object.keys(assets).slice(0, 10)));
  compilation.hooks.optimizeChunkAssets.tap('Trace', assets => console.log('[HOOK] optimizeChunkAssets', Object.keys(assets).slice(0, 10)));
  compilation.hooks.processAssets.tap('Trace', () => console.log('[HOOK] processAssets'));
});
compiler.hooks.make.tap('Trace', compilation => console.log('[HOOK] make'));
compiler.hooks.afterCompile.tap('Trace', () => console.log('[HOOK] afterCompile'));
compiler.hooks.shouldEmit.tap('Trace', () => console.log('[HOOK] shouldEmit'));
compiler.hooks.emit.tap('Trace', () => console.log('[HOOK] emit'));
compiler.hooks.afterEmit.tap('Trace', () => console.log('[HOOK] afterEmit'));
compiler.hooks.done.tap('Trace', stats => console.log('[HOOK] done', stats.toJson({all:false,assets:true,errors:true,warnings:true}).errors.slice(0,5)));
compiler.hooks.failed.tap('Trace', err => console.log('[HOOK] failed', err && err.message));

config.plugins.forEach((plugin, index) => {
  const name = plugin && plugin.constructor && plugin.constructor.name;
  if (name) console.log(`[PLUGIN] ${index}: ${name}`);
});

fs.emptyDirSync(paths.appBuild);
compiler.run((err, stats) => {
  if (err) {
    console.error('[RUNERR]', err);
    process.exit(1);
  }
  console.log('[RUN] callback');
  console.log(stats.toString({ all: false, assets: true, modules: false, errors: true, warnings: true }));
});

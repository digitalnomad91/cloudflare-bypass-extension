import select from '@inquirer/select';
import webExt from 'web-ext';

const answer = await select({
  message: 'Which Browser You Want to Build the Extension For?',
  choices: [
    {
      name: 'Firefox',
      value: 'firefox',
      description: 'Build extension for Firefox (requires using old Manifest V2).',
    },
    {
      name: 'Chrome',
      value: 'chrome',
      description: 'Build Extension for Chrome (using latest Manivest V3).',
    },
  ],
});


const createWebExt = (done) => {
  if (BRANCH !== BRANCH_BETA && BRANCH !== BRANCH_RELEASE) {
      return done();
  }

  return webExt.cmd.build({
      sourceDir: paths.dest,
      artifactsDir: dest.buildDir,
      overwriteDest: true
  }).then((file) => {
      fs.renameSync(file.extensionPath, dest.webext);
      done();
  });
};


createWebExt();

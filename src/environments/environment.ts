// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyB-lgb4Llye_81tSfipgrMo37mq9GnObfM',
    authDomain: 'budget-dev-f38a3.firebaseapp.com',
    databaseURL: 'https://budget-dev-f38a3.firebaseio.com',
    projectId: 'budget-dev-f38a3',
    storageBucket: 'budget-dev-f38a3.appspot.com',
    messagingSenderId: '800149842908'
  }
};

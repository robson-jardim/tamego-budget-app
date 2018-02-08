// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    firebase: {
        apiKey: 'AIzaSyCgpvPTYnEeEOCck0gJje2XbnHZH92Oi00',
        authDomain: 'budget-app-dev.firebaseapp.com',
        databaseURL: 'https://budget-app-dev.firebaseio.com',
        projectId: 'budget-app-dev',
        storageBucket: 'budget-app-dev.appspot.com',
        messagingSenderId: '428455197993'
    },
    functions: 'http://localhost:5000/budget-app-dev/us-central1/',
    stripe: {
        public_key: 'pk_test_WIIBXcPsp6SP6b1YHzRKm4Lt\n'
    }
};


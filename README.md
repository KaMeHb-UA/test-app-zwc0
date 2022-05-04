## Test project

This is just a test project, nothing interesting. Ready to dive in?

### Structure

#### Project structure is pretty simple:

##### src

The main program sources. Consists of providers, services, runner and index.js.  
Providers are designed to make data getters replaceable (for tests, as an example).  
Services is an external data getters.  
Runner is the main logical "core" of the program.
`index.js` is a standard file that brings together providers, launches runner and prints the result.

##### docker

Consists of just a Dockerfile

##### tests

Tests lives here!)  
Every test is located in a separate file, exports the test itself and the name of the test.
`all.js` brings them all together
`index.js` launches all the tests asynchronously and prints its results

### Build and launch

#### Local way

First, install required deps. We have yarn lockfile and support installing deps with yarn:
```sh
yarn
```

To build project locally, run
```sh
yarn build
```
or
```sh
npm run build
```

Next, if you want launch the bundle, use
```sh
node dist/index.js
```
or with original stacktraces:
```sh
node --enable-source-maps dist/index.js
```

#### Docker

Use next command to build docker image:
```sh
docker build -f docker/Dockerfile .
```

If you want to run the resulted container, use
```sh
docker run <image-sha>
```

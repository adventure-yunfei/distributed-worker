# Promisable WEB Worker Runner

Run task on web worker and retrieve the result, simply by Promise api.

# How to use it

### Inside the main script, import and initialize a `WorkersManager`

```javascript
// include WorkersManager.js first
var workersManager = new WorkersManager();
```

### Inside the worker executive script, import and initialize a `ActualWorker` with a `work` method
 
There're two ways to initialize a `ActualWorker`:

1. Directly pass `work` method to constructor:

```javascript```
// include ActualWorker.js first
var worker = new ActualWorker({work: fnDoWork});
```

2. Extend to a sub class of `ActualWorker` (by es6 js):

```javascript
// include ActualWorker.js first
class RealWorker extends ActualWorker {
    work: fnDoWork
}

var worker = new RealWorker();
```

### Use `WorkersManager` to run work. E.g.:

```javascript
workersManager
    .work(inputData)
    .then(function (outputData) {
        ...
    })
    .catch(function (outputError) {
        ...
    });
```

# API

```javascript
// Create a new worker and let it do the work with specified data
// @returns Promise with work output data if succeeds
WorkersManager.prototype.work(data: *, workerFile: string/*url to a worker script file*/)
```

```javascript
// Receive work input and produce direct output or Promise for aync
// @returns * | Promise with work output data if succeeds
ActualWorker.prototype.work(data: *)
```

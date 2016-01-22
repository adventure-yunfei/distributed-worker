import isFunction from 'lodash/lang/isFunction';
import __assert__ from 'js-assert/__assert__';
import global from 'global';

function notifyTaskResult(taskId, data = null, error = null) {
    global.postMessage({
        __id: taskId,
        data,
        error
    });
}

let workerReady = false;
export default class ActualWorker {
    constructor({work = null} = {}) {
        if (workerReady) {
            throw new Error('There can only be one HardWorker!');
        } else {
            global.onmessage = ({data: {__id: taskId, data}}) => {
                __assert__(taskId, 'task id is not passed along with message');
                try {
                    const result = this.work(data);
                    if (result && isFunction(result.then)) {
                        result
                            .then((data) => notifyTaskResult(taskId, data))
                            .catch((error) => notifyTaskResult(taskId, null, error));
                    } else {
                        notifyTaskResult(taskId, result);
                    }
                } catch (e) {
                    notifyTaskResult(taskId, null, e);
                }
            };

            if (work) {
                this.work = work;
            }

            workerReady = true;
        }
    }

    work() {
        throw new Error('HardWorker.work is not implemented');
    }
}

if (typeof window !== 'undefined') {
    window.WorkersManager = HardWorker;
}

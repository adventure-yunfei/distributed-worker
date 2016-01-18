import isFunction from 'lodash/lang/isFunction';
import __assert__ from 'js-assert/__assert__';
import global from 'global';

import {PROP_TASK_ID} from './enums';

function notifyTaskResult(taskId, data = null, error = null) {
    global.postMessage({
        [PROP_TASK_ID]: taskId,
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
            global.onmessage = ({data: {[PROP_TASK_ID]: taskId, data}}) => {
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

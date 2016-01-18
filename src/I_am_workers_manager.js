import global from 'global';
import uniqueId from 'lodash/utility/uniqueId';
import __assert__ from 'js-assert/__assert__';

import {PROP_TASK_ID} from './enums';

export class WorkersManager {
    constructor() {
        this._tasksMap = {};
    }

    _onWorkerMessage = (msg) => {
        const taskId = msg[PROP_TASK_ID];
        __assert__(taskId, 'task id is not passed along with message');
        __assert__(this._tasksMap[taskId], `WorkersManager doesn't receive this task id: ${taskId}`);
        this._tasksMap[taskId](msg);
    };

    work(data, workerFile) {
        return new Promise((resolve, reject) => {
            const worker = new global.Worker(workerFile);
            const taskId = uniqueId('taskId_');
            this._tasksMap[taskId] = ({data, error}) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
                delete this._tasksMap[taskId];
            };
            worker.onmessage = this._onWorkerMessage;
            worker.postMessage({
                [PROP_TASK_ID]: uniqueId('taskId_'),
                data
            });
        });
    }
}

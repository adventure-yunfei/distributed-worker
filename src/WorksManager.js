import global from 'global';
import uniqueId from 'lodash/utility/uniqueId';
import __assert__ from 'js-assert/__assert__';
import Promise from 'promise-aplus';

export default class WorkersManager {
    constructor() {
        this._tasksMap = {};
    }

    _onWorkerMessage = ({data: msgData}) => {
        const taskId = msgData.__id;
        __assert__(taskId, 'task id is not passed along with message');
        __assert__(this._tasksMap[taskId], `WorkersManager doesn't receive this task id: ${taskId}`);
        this._tasksMap[taskId](msgData);
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
                __id: taskId,
                data
            });
        });
    }
}

if (typeof window !== undefined) {
    window.WorkersManager = WorkersManager;
}

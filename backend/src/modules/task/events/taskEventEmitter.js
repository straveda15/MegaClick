import EventEmitter from 'events';

export const TASK_EVENTS = {
  CREATED: 'task:created',
  CLAIMED: 'task:claimed',
  TRANSITIONED: 'task:transitioned',
  OVERDUE: 'task:overdue',
  COMPLETED: 'task:completed'
};

const taskEventEmitter = new EventEmitter();

taskEventEmitter.on('error', (err) => {
  console.error('[taskEventEmitter] error:', err);
});

export default taskEventEmitter;

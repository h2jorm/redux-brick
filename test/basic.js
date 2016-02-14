const assert = require('assert');
const {genActionsAndReducers} = require('../src');
const {
  createStore,
  combineReducers,
} = require('redux');

const countApp = require('./helper/countApp');
const todoApp = require('./helper/todoApp');

describe('single brick', () => {
  let store, actions, reducers;
  beforeEach(() => {
    const actionsAndReducer = genActionsAndReducers(countApp);
    actions = actionsAndReducer.actions;
    reducers = actionsAndReducer.reducers;
    store = createStore(combineReducers(reducers));
  });
  it('should brick default value to store', () => {
    assert.equal(store.getState().countApp.count, 0);
  });
  it('should change state after dispatching an action', () => {
    store.dispatch(actions.countAppAdd());
    const newState = store.getState();
    assert.equal(newState.countApp.count, 1);
  });
});

describe('states of multiple bricks', () => {
  let store, actions, reducers;
  beforeEach(() => {
    const actionsAndReducer = genActionsAndReducers(
      todoApp,
      countApp
    );
    actions = actionsAndReducer.actions;
    reducers = actionsAndReducer.reducers;
    store = createStore(combineReducers(reducers));
  });
  it('should not disturb with each other when sharing the same action name', () => {
    const newTodo = {
      title: 'hello',
      done: false
    };
    store.dispatch(actions.todoAppAdd(newTodo));
    store.dispatch(actions.countAppAdd());
    const newState = store.getState();
    assert.equal(newState.todoApp.todos.length, 1);
    assert.deepEqual(newTodo, newState.todoApp.todos[0]);
    assert.equal(newState.countApp.count, 1);
  });
});

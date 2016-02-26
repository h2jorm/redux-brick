const assert = require('assert');
const {genActionsAndReducers} = require('../src');
const {
  createStore,
  combineReducers,
} = require('redux');

const countApp = require('./helper/countApp');
const todoApp = require('./helper/todoApp');

describe('single brick', () => {
  let store, actionCreators, reducers;
  beforeEach(() => {
    const actionsAndReducer = genActionsAndReducers(countApp);
    actionCreators = actionsAndReducer.actionCreators;
    reducers = actionsAndReducer.reducers;
    store = createStore(combineReducers(reducers));
  });
  it('should brick default value to store', () => {
    assert.equal(store.getState().countApp.count, 0);
  });
  it('should change state after dispatching an action', () => {
    store.dispatch(actionCreators.countApp.add());
    const newState = store.getState();
    assert.equal(newState.countApp.count, 1);
  });
});

describe('states of multiple bricks', () => {
  let store, actionCreators, reducers;
  beforeEach(() => {
    const actionsAndReducer = genActionsAndReducers(
      todoApp,
      countApp
    );
    actionCreators = actionsAndReducer.actionCreators;
    reducers = actionsAndReducer.reducers;
    store = createStore(combineReducers(reducers));
  });
  it('should not disturb with each other when sharing the same action name', () => {
    const newTodo = {
      title: 'hello',
      done: false
    };
    store.dispatch(actionCreators.todoApp.add(newTodo));
    store.dispatch(actionCreators.countApp.add());
    const newState = store.getState();
    assert.equal(newState.todoApp.todos.length, 1);
    assert.deepEqual(newTodo, newState.todoApp.todos[0]);
    assert.equal(newState.countApp.count, 1);
  });
});

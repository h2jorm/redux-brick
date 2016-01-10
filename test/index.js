const assert = require('assert');
const {register} = require('../src');
const {
  createStore,
  combineReducers,
} = require('redux');

const countApp = require('./helper/countApp');
const todoApp = require('./helper/todoApp');

describe('single set', () => {
  let store, actions, reducer;
  beforeEach(() => {
    const actionsAndReducer = register(countApp);
    actions = actionsAndReducer.actions;
    reducer = actionsAndReducer.reducer;
    store = createStore(combineReducers(reducer));
  });
  it('should set default value to store', () => {
    assert.equal(store.getState().countApp.count, 0);
  });
  it('should change state after dispatching an action', () => {
    store.dispatch(actions.countAppAdd());
    const newState = store.getState();
    assert.equal(newState.countApp.count, 1);
  });
});

describe('states of multiple sets', () => {
  let store, actions, reducer;
  beforeEach(() => {
    const actionsAndReducer = register(
      todoApp,
      countApp
    );
    actions = actionsAndReducer.actions;
    reducer = actionsAndReducer.reducer;
    store = createStore(combineReducers(reducer));
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

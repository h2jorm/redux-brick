# redux-hub
Redux-hub is a collection of helper functions for redux operation.

For now, it has only one helper function named `register` to simplify the declaration of actions and reducers. It helps to declaring a few names of **redux sets** instead of a lot of action names.

## Redux set
Redux set is an object with three specific attribute names.
* name: name of redux set
* defaultState: the default state of current redux set
* mutation: a generator function wrapping redux action and reducer together

Here are two demos of redux set.
```js
// src/store/countApp.js
module.exports = {
  name: 'countApp',
  defaultState: {
    count: 0
  },
  mutation: {
    add: function *() {
      yield type => {
        return () => ({type});
      };
      yield (state, action) => {
        return Object.assign({}, state, {
          count: state.count + 1
        });
      };
    }
  }
};

// src/store/todoApp.js
module.exports = {
  name: 'todoApp',
  defaultState: {
    todos: []
  },
  mutation: {
    add: function *() {
      yield type => {
        return todo => ({
          todo, type
        });
      };
      yield (state, action) => {
        return Object.assign({}, state, {
          todos: [
            ...state.todos,
            action.todo
          ]
        });
      };
    }
  }
};
```
The `register` helper function from `redux-hub` takes redux sets as arguments and returns an object containing `actions` and `reducer`. Then it will go back the redux way to apply middle wares, create store and so on.

```js
// src/store/index.js
import {
  createStore,
  combineReducers,
} from 'redux';
import {register} from 'redux-hub';

import countApp from './countApp';
import todoApp from './todoApp';

// register sets to redux
const {actions, reducer} = register(
  countApp,
  todoApp
);

// for now, `reducer` is an object.
// Use `combineReducers` to convert it to a valid redux reducer.
const store = createStoreWithMiddleware(
  combineReducers(reducer)
);

// dispatch some actions
store.dispatch(actions.countAppAdd());
expect(store.getState().countApp.count).toBe(1);// true

// the mutation name scope are isolated in different redux sets
const newTodo = {
  title: 'hello',
  done: false
};
store.dispatch(actions.todoAppAdd(newTodo));
expect(store.getState().countApp.count).toBe(1);// true
expect(store.getState().todoApp.todos.length).toBe(1);// true
expect(store.getState90.todoApp.todos[0]).toEqual(newTodo);// true
```
`type` is a reserved word to record a unique action name.
A unique action name is composed by two parts.
* a unique redux set name
* a mutation name

For example, mutation `add` of `countApp` will be `countAppAdd`.
When writing redux in a traditional way, it is verbose and dull to ensure all action names unique with each other by declaring constants. However, it is much easier to ensure set names unique when writing redux sets instead of separated actions and reducers.

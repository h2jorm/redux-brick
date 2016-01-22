const forEach = require('lodash/forEach');
const camelCase = require('lodash/camelCase');
const kebabCase = require('lodash/kebabCase');

module.exports = function (...reduxBricks) {
  let $actions = {};
  let $reducer = {};
  reduxBricks.forEach(reduxBrick => {
    const {name, defaultState = {}, mutation = {}} = reduxBrick;

    if (!name)
      throw new Error('every redux brick should own its name');
    if ($reducer.hasOwnProperty(name))
      throw new Error('redux brick name should be unique');

    let stateHandlers = {};
    let actions = {};
    forEach(mutation, (generatorFn, actionName) => {
      let actionLackOfTypeFn, stateHandler;
      try {
        const iterator = generatorFn();
        actionLackOfTypeFn = iterator.next().value;
        stateHandler = iterator.next().value;
      } catch (e) {
        throw new Error(`invalid mutation ${name}-${actionName}`);
      }

      if (!actionLackOfTypeFn || !stateHandler || !isInstance(actionLackOfTypeFn, Function) || !isInstance(stateHandler, Function)) {
        throw new Error(`${name}-${actionName} mutation should yield two functions`);
      }

      const action = actionLackOfTypeFn(`${name}-${actionName}`);
      actions[actionName] = action;
      if (!isInstance(action, Function))
        throw new Error(`${name}-${actionName} fails to compile the first yield value to a valid action creator function`);
      stateHandlers[actionName] = stateHandler;
    });

    const reducer = function (state = defaultState, action) {
      const [setName, actionName] = action.type.split('-');
      if (setName === name && stateHandlers.hasOwnProperty(actionName)) {
        return stateHandlers[actionName](state, action);
      }
      return state;
    };

    registerActions(actions, name, $actions);
    $reducer[name] = reducer;
  });
  return {
    actions: $actions,
    reducer: $reducer,
  };
};

function registerActions(actions, setName, $actions) {
  forEach(actions, (actionFn, actionName) => {
    const camelCasedActionName = camelCase(`${setName}-${actionName}`);
    $actions[camelCasedActionName] = actionFn;
  });
}

function isInstance(instance, prototype) {
  return instance instanceof prototype;
}

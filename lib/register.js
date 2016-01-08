const forEach = require('lodash/collection/forEach');
const camelCase = require('lodash/string/camelCase');
const kebabCase = require('lodash/string/kebabCase');

module.exports = function register(...groups) {
  let $actions = {};
  let $reducer = {};
  groups.forEach(group => {
    const {name, defaultState, fromActionToReducer} = group;

    if (!name)
      throw new Error('should assign name');
    if ($reducer.hasOwnProperty(name))
      throw new Error('state name should be unique');

    let stateHandlers = {};
    let actions = {};
    forEach(fromActionToReducer, (generatorFn, actionName) => {
      const iterator = generatorFn();
      const action = iterator.next().value;
      const stateHandler = iterator.next().value;
      actions[actionName] = action;
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

/**
 * @param actions
 * @param setName
 */
function registerActions(actions, setName, $actions) {
  forEach(actions, (actionFn, actionName) => {
    const camelCasedActionName = camelCase(`${setName}-${actionName}`);
    $actions[camelCasedActionName] = actionFn;
  });
}
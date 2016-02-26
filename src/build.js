module.exports = function (...reduxBricks) {
  let $acs = {};
  let $reducers = {};
  reduxBricks.forEach(reduxBrick => {
    const {name, defaultState = {}, mutations = {}} = reduxBrick;

    if (!name)
      throw new Error('every redux brick should own its name');
    if ($reducers.hasOwnProperty(name))
      throw new Error('redux brick name should be unique');

    let stateHandlers = {};
    // `ac` is abbreviation for action creator
    let acs = {};
    Object.keys(mutations).forEach(acName => {
      const generatorFn = mutations[acName];
      let acLackOfTypeFn, stateHandler;
      try {
        const iterator = generatorFn();
        acLackOfTypeFn = iterator.next().value;
        stateHandler = iterator.next().value;
      } catch (e) {
        throw new Error(`invalid mutation ${name}-${acName}`);
      }

      if (!acLackOfTypeFn || !stateHandler || !isInstance(acLackOfTypeFn, Function) || !isInstance(stateHandler, Function)) {
        throw new Error(`${name}-${acName} mutation should yield two functions`);
      }

      const ac = acLackOfTypeFn(`${name}-${acName}`);
      acs[acName] = ac;
      if (!isInstance(ac, Function))
        throw new Error(`${name}-${acName} fails to compile the first yield value to a valid action creator function`);
      stateHandlers[acName] = stateHandler;
    });

    const reducer = function (state = defaultState, action) {
      const [setName, actionName] = action.type.split('-');
      if (setName === name && stateHandlers.hasOwnProperty(actionName)) {
        return stateHandlers[actionName](state, action);
      }
      return state;
    };

    registerAcs(acs, name, $acs);
    $reducers[name] = reducer;
  });
  return {
    actionCreators: $acs,
    reducers: $reducers,
  };
};

function registerAcs(acs, setName, $acs) {
  const acNames = Object.keys(acs);
  if (!acNames.length)
    return;
  const set = $acs[setName] = {};
  acNames.forEach(acName => {
    set[acName] = acs[acName];
  });
}

function isInstance(instance, prototype) {
  return instance instanceof prototype;
}

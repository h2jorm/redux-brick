module.exports = {
  name: 'countApp',
  defaultState: {
    count: 0
  },
  fromActionToReducer: {
    add: function *() {
      yield () => ({
        type: 'countApp-add'
      });
      yield (state, action) => {
        return Object.assign({}, state, {
          count: state.count + 1
        });
      };
    }
  }
};

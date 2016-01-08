module.exports = {
  name: 'todoApp',
  defaultState: {
    todos: []
  },
  fromActionToReducer: {
    add: function *() {
      yield todo => ({
        todo,
        type: 'todoApp-add'
      });
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

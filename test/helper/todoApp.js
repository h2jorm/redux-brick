module.exports = {
  name: 'todoApp',
  defaultState: {
    todos: []
  },
  mutations: {
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

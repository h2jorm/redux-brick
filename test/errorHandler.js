const assert = require('assert');
const {build} = require('../src');
const {
  createStore,
  combineReducers,
} = require('redux');

describe('empty mutation & invalid name', () => {
  it('should leave actionCreators empty in undefined mutation case', () => {
    const brickWithoutMutation = {
      name: 'demo'
    };
    const {actionCreators} = build(brickWithoutMutation);
    assert.deepEqual(actionCreators, {});
  });
  it('should throw when composing an unnamed brick', () => {
    const unnamedBrick = {};
    const composeUnnamedBrick = function () {
      build(unnamedBrick);
    };
    assert.throws(composeUnnamedBrick, /every redux brick should own its name/);
  });
  it('should throw when composing two redux bricks of the same name', () => {
    const demoBrick01 = {
      name: 'demo',
    };
    const demoBrick02 = {
      name: 'demo',
    };
    const composeDemos = function () {
      build(demoBrick01, demoBrick02);
    };
    assert.throws(composeDemos, /redux brick name should be unique/);
  });
});

describe('invalid mutation', () => {
  it('should throw in case that function is not a generator', () => {
    const composeDemo1 = function () {
      const demo = {
        name: 'demo',
        mutations: {
          add: {}
        }
      };
      build(demo);
    };
    const composeDemo2 = function () {
      const demo2 = {
        name: 'demo2',
        mutations: {
          add2: function () {}
        }
      };
      build(demo2);
    };
    assert.throws(composeDemo1, /invalid mutation demo-add/);
    assert.throws(composeDemo2, /invalid mutation demo2-add2/);
  });
  it('should throw in case that two yield values are not function', () => {
    const composeDemo1 = function () {
      const demo = {
        name: 'demo',
        mutations: {
          add: function *() {
            yield ({});
          }
        }
      };
      build(demo);
    };
    const composeDemo2 = function () {
      const demo = {
        name: 'demo2',
        mutations: {
          add2: function *() {
            yield () => {};
            yield ({});
          }
        }
      };
      build(demo);
    };
    assert.throws(composeDemo1, /demo-add mutation should yield two functions/);
    assert.throws(composeDemo2, /demo2-add2 mutation should yield two functions/);
  });
  it('should throw in case that 1st yield value is not a vaild function', () => {
    const composeDemo = function () {
      const demo = {
        name: 'demo',
        mutations: {
          add: function *() {
            yield () => ({});
            yield () => ({});
          }
        }
      };
      build(demo);
    };
    assert.throws(composeDemo, /demo-add fails to compile the first yield value to a valid action creator function/);
  });
});

import { find } from 'ember-awesome-macros/array';
import { raw } from 'ember-awesome-macros';
import EmberObject from 'ember-object';
import { A as emberA } from 'ember-array/utils';
import get from 'ember-metal/get';
import computed from 'ember-computed';
import { module, test } from 'qunit';
import compute from 'ember-macro-test-helpers/compute';
import sinon from 'sinon';

module('Integration | Macro | array | find');

test('it returns undefined if array undefined', function(assert) {
  compute({
    assert,
    computed: find('array'),
    strictEqual: undefined
  });
});

test('it returns undefined if not found', function(assert) {
  compute({
    assert,
    computed: find('array', result => result === 3),
    properties: {
      array: emberA([1, 2])
    },
    strictEqual: undefined
  });
});

test('it returns item if found', function(assert) {
  compute({
    assert,
    computed: find('array', result => result === 2),
    properties: {
      array: emberA([1, 2])
    },
    strictEqual: 2
  });
});

test('it responds to array property value changes', function(assert) {
  let array = emberA([
    EmberObject.create({ prop: false }),
    EmberObject.create({ prop: true })
  ]);

  let { subject } = compute({
    computed: find('array.@each.prop', item => {
      return get(item, 'prop');
    }),
    properties: {
      array
    }
  });

  assert.strictEqual(subject.get('computed'), array[1]);

  array.set('0.prop', true);
  array.set('1.prop', false);

  assert.strictEqual(subject.get('computed'), array[0]);

  array.set('0.prop', false);
  array.pushObject(EmberObject.create({ prop: true }));

  assert.strictEqual(subject.get('computed'), array[2]);
});

test('doesn\'t calculate when unnecessary', function(assert) {
  let callback = sinon.spy();

  compute({
    computed: find(
      undefined,
      computed(callback)
    )
  });

  assert.notOk(callback.called);
});

test('composable: it returns item if found', function(assert) {
  compute({
    assert,
    computed: find(
      raw(emberA([1, 2])),
      result => result === 2
    ),
    strictEqual: 2
  });
});

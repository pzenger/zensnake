import Ember from 'ember';

export default Ember.Component.extend({

    tagName: 'div',
    classNames: ['gameblock'],
    classNameBindings: ['empty', 'playerBody', 'playerHead', 'pickup'],

    empty: function () {
        return this.get('num') === 0;
    }.property('num'),

    playerBody: function () {
        return this.get('num') === 1;
    }.property('num'),

    playerHead: function () {
        return this.get('num') === 2;
    }.property('num'),

    pickup: function() {
        return this.get('num') === 10;
    }.property('num')
});

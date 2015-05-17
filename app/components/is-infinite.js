import Ember from 'ember';

export default Ember.Component.extend({

  unbound: Ember.computed.equal("infinite", true),

  click: function() {
    this.sendAction();
  }

});

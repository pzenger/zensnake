import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    restart: function(){
      this.sendAction("restart");
    },
    toggleInfinite: function(){
      this.sendAction("toggleInfinite");
    }
  }
});

import Ember from 'ember';

export default Ember.Component.extend({
  imgNum: 0,
  
  showNum: function() {
    return this.get('imgNum');
  }.property('imgNum'),

  randomize: function() {
    this.set('imgNum', Math.floor(Math.random() * 1000)+1)
  }.on('didInsertElement'),

});

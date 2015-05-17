import Ember from 'ember';

export default Ember.Component.extend({


  twitter: {
    display: "PZenger",
    url: "https://twitter.com/PeterZenger",
    tag: "PeterZenger",
    iconClass: "fa fa-twitter"
  },
  blog: {
    display: "Blog",
    url: "http://www.pzenger.com",
    iconClass: "fa fa-bookmark-o"
  }
});

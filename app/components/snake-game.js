import Ember from 'ember';
import Em from 'ember';

function matrix(rows, cols, value) {
  var m = Ember.A([]);

  for (var i = 0; i < rows; i++) {
    let temp = Ember.A([]);
    for (let j = 0; j < cols; j++) {
      temp.push(value);
    }
    m.push(temp);
  }
  return m;
}

var speedInterval = null;

export default Ember.Component.extend({

  // Game score
  highScore: 0,
  score: 0,

  // Game board
  height: 12,
  width: 12,

  // Game state
  grid: null,
  speed: 9.0, // seconds per tick
  playing: true,
  started: false,
  infinite: false,

  snakeHead: Em.A([0, 0]),
  snakeBody: Em.A([
    [0, 0]
  ]),

  points: Em.A([
    [5, 5],
    [6, 6],
  ]),

  direction: 'right',
  directionLast: 'right',

  displayGrid: function() {
    return this.buildGrid(this.get('snakeHead'), this.get('snakeBody'), this.get('points'));
  }.property('grid.[]', 'snakeHead.[]', 'snakeBody.[]', 'points.[]'),

  buildGrid: function(snakeHead, snakeBody, points) {
    // Place each of the items onto the grid before sending it to components for rendering

    let grid = matrix(this.get('height'), this.get('width'), 0);
    if (grid === null) {
      return null;
    }

    grid[snakeHead[0]][snakeHead[1]] = 2;

    snakeBody.forEach(function(point) {
      grid[point[0]][point[1]] = 1;
    });

    points.forEach(function(point) {
      grid[point[0]][point[1]] = 10;
    });

    return grid;
  },

  didInsertElement: function() {
    let self = this;
    // Capture keyboard events and assign proper directional data
    // For the next update loop
    Em.$(document).keypress(function(event) {
      let code = event.charCode;
      switch (code) {
        case 119: // W
          if (self.get('directionLast') !== 'down'){
            self.set('direction', 'up');
          }
          break;
        case 97: // A
          if (self.get('directionLast') !== 'right'){
            self.set('direction', 'left');
          }
          break;
        case 115: // S
          if (self.get('directionLast') !== 'up'){
            self.set('direction', 'down');
          }
          break;
        case 100: // D
          if (self.get('directionLast') !== 'left'){
            self.set('direction', 'right');
          }
          break;
        default:
          break;
      }
    });
  },

  setSpeed: function() {
    let self = this;
    if (speedInterval) {
      window.clearInterval(speedInterval);
    }

    speedInterval = setInterval(function() {
      let dir = self.get('direction');
      self.moveSnake(dir);
    }, this.get('speed') * 500);
  }.observes('speed', 'playing'),

  moveSnake: function(dir) {
    if(!this.get('playing')){
      return;
    }
    this.set('directionLast', dir);
    let snakeHead = this.get('snakeHead');
    let snakeBody = this.get('snakeBody');

    let oldHead = Em.copy(snakeHead);
    let self = this;

    // Move Head
    switch (dir) {
      case 'up':
        snakeHead[0] = snakeHead[0] - 1;
        break;
      case 'down':
        snakeHead[0] = snakeHead[0] + 1;
        break;
      case 'left':
        snakeHead[1] = snakeHead[1] - 1;
        break;
      case 'right':
        snakeHead[1] = snakeHead[1] + 1;
        break;
    }

    // Check out of bound collisions
    let snakeX = snakeHead[1];
    let snakeY = snakeHead[0];

    if (self.get('infinite')) {
      if (snakeY < 0) {
        snakeHead[0] = this.get('width') - 1;
      } else if (snakeX < 0) {
        snakeHead[1] = this.get('height') - 1;
      } else if (snakeY >= this.get('height')) {
        snakeHead[0] = 0;
      } else if (snakeX >= this.get('width')) {
        snakeHead[1] = 0;
      }
    } else {
      if (snakeY < 0 || snakeX < 0 || snakeY >= this.get('height') || snakeX >= this.get('width')) {
        this.set('playing', false);
        return;
      }
    }

    // Move Body
    let tmp = Em.A([oldHead[0], oldHead[1]]);
    snakeBody.pushObject(tmp);

    // Check point collisions
    let grow = false;
    let points = this.get('points');

    var updatedPoints = points.map(
      function(point) {
        return function(point, head, body, points) {
          if (head[0] === point[0] && head[1] === point[1]) {

            let randomY = 0;
            let randomX = 0;

            let retry = true;
            while (retry) {
              retry = false;
              randomX = Math.floor(Math.random() * self.get('width'));
              randomY = Math.floor(Math.random() * self.get('height'));

              points.forEach(function(point_z) {
                if (point_z[0] === randomY && point_z[1] === randomX) {
                  retry = true;
                }
              });
              body.forEach(function(part) {
                if (part[0] === randomY && part[1] === randomX) {
                  retry = true;
                }
              });
              if (head[0] === randomY && head[1] === randomX) {
                retry = true;
              }
            }

            self.updateScore(100);
            grow = true;
            point[0] = randomY;

            point[1] = randomX;
            return point;
          }
          return point;
        }(point, snakeHead, snakeBody, points);

      });

    this.set('points', updatedPoints);
    if(!grow){
      snakeBody.shiftObject();
    }

    // Check self.body collisions
    snakeBody.forEach(function(part) {
      if (part[0] === snakeHead[0] && part[1] === snakeHead[1]) {
        self.set('playing', false);
        return;
      }
    });

  },

  updateScore: function(amount) {
    // Later can have different types of points
    this.set('score', this.get('score') + amount);

    if (this.get('score') % 400 === 0) {
      this.set('speed', this.get('speed') * 0.9);
    }
    if (this.get('score') > this.get('highScore')) {
      this.set('highScore', this.get('score'));
    }
  },


  initGrid: function() {
    var board = matrix(this.get('height'), this.get('width'), 0);

    let points = Em.A([]);
    for(let i = 0; i < 2; i++){
      let randY = Math.floor(Math.random() * (this.get('height')-2)) + 2;
      let randX = Math.floor(Math.random() * (this.get('width')-2)) + 2;
      points.pushObject([randY, randX]);
    }
    this.set('points', points);

    this.set('snakeBody', Em.A([
      [0, 0]
    ]));
    this.set('snakeHead', Em.A([0, 0]));
    this.set('playing', true);
    this.set('started', true);
    this.set('grid', Ember.copy(board));
    this.set('direction', 'right');
    this.set('score', 0);
    this.set('speed', 0.75);
  },

  removeInterval: function() {
    if (this.get('playing') === false) {
      window.clearInterval(speedInterval);
    }
  }.observes('playing'),

  actions: {
    restart: function() {
      this.initGrid();
    },
    toggleInfinite: function(){
      this.set('infinite', !this.get('infinite'));
    }
  }
});

"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Game =
/*#__PURE__*/
function () {
  function Game() {
    _classCallCheck(this, Game);

    this.options = {
      level_1: {
        id: 1,
        bullets: 30,
        level_time: 6000,
        speed: 15,
        bulletsTime: 500
      },
      level_2: {
        id: [2, 3],
        bullets: 30,
        level_time: 4000,
        speed: "30px",
        bulletsTime: 500
      }
    };
    this.position = 0;
    this.tankPark();
  }

  _createClass(Game, [{
    key: "tankPark",
    value: function tankPark() {
      var block = $(".tank");

      for (var i = 0; i < block.length; i++) {
        block.eq(i).attr("data-id", i + 1);
      }

      this.getTank();
    }
  }, {
    key: "getTank",
    value: function getTank() {
      var option = this.options.level_1;
      var tankId = option.id;
      var block = $(".tank[data-id='".concat(tankId, "']"));
      var activeTank = block.clone();
      $(".gameZone").append(activeTank);
      activeTank.addClass("active");
      block.remove();
      var bullets = option.bullets;

      for (var i = 0; i < bullets; i++) {
        var bullet = "<img src=\"images/bullets/bullet.jpg\" class=\"d- bullet\" alt=\"bullet\" data-img=\"".concat(i + 1, "\">");
        $(".arsenal").append(bullet);
      }
    }
  }, {
    key: "shoot",
    value: function shoot() {}
  }, {
    key: "move",
    value: function move(keyCode) {
      var activeTank = $(".active");
      var parent = activeTank.parent();
      var widthPar = parent.outerWidth();
      var speed = this.options.level_1.speed;
      console.log(
      /*activeTank.position().left >= parent.offset().left ||*/
      activeTank.offset().left, parent.offset().left + widthPar);

      if (
      /*activeTank.position().left >= parent.offset().left ||*/
      activeTank.offset().left <= parent.offset().left + widthPar) {
        if (keyCode === 37) {
          this.position -= speed;
          activeTank.css("transform", "translateX(".concat(this.position, "px"));
        } else if (keyCode === 39) {
          this.position += speed;
          activeTank.css("transform", "translateX(".concat(this.position, "px"));
        }
      }
    }
  }]);

  return Game;
}();

var game = new Game();
$(document).on("keydown", function (e) {
  var key = e.which;
  if (key === 32) game.shoot();else if (key === 37 || key === 39) game.move(key);
});
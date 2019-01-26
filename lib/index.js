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
        bulletsSpeed: 500
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
        var bullet = "<img src=\"images/bullet.png\" class=\"bullet\" alt=\"bullet\" data-img=\"".concat(i + 1, "\">");
        $(".arsenal").append(bullet);
      }
    }
  }, {
    key: "shoot",
    value: function shoot() {
      var positionBullet = 0;
      var bullet = $(".bullet");
      var lastBullet = bullet.eq(bullet.length - 1);
      var activeBullet = lastBullet.clone();
      activeBullet.addClass("activeBull");
      $(".gameZone").append(activeBullet);
      lastBullet.remove(); // for (let i = 0; i < 124 ; i++) {
      //     activeBullet.css(`transform`,[`translateY(${-(i += 10)}px) rotate(90deg)`]);
      // }
      // setInterval(function () {
      //     console.log(positionBullet += 10);
      //     activeBullet.css(`transform`,[`translateY(${-(positionBullet += 10)}px) rotate(90deg)`]);
      // },1200);
    }
  }, {
    key: "move",
    value: function move(keyCode) {
      var activeTank = $(".active");
      var activeTankPosLeft = activeTank.offset().left;
      var speed = this.options.level_1.speed;

      if (keyCode === 37) {
        if (this.position > -270) {
          this.position -= speed;
          activeTank.css("transform", "translateX(".concat(this.position, "px"));
        }
      } else if (keyCode === 39) {
        if (this.position < 330) {
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
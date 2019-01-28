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
        bulletsSpeed: 5000,
        targetSpeed: 10
      },
      level_2: {
        id: [2, 3],
        bullets: 30,
        level_time: 4000,
        speed: 30,
        bulletsTime: 500
      }
    };
    this.targetIntervals = {};
    this.position = 0;
  }

  _createClass(Game, [{
    key: "play",
    value: function play(option) {
      this.tankPark();
      this.targets(option.targetSpeed);
      this.getTank(option);
    }
  }, {
    key: "tankPark",
    value: function tankPark() {
      var block = $(".tank");

      for (var i = 0; i < block.length; i++) {
        block.eq(i).attr("data-id", i + 1);
      }
    }
  }, {
    key: "moveTarget",
    value: function moveTarget(elem) {
      var top = elem.position().top;
      elem.css('top', top + 0.3 + 'px');
      console.log(top);
    }
  }, {
    key: "targets",
    value: function targets(speed) {
      var _this = this;

      var intervalId = 0,
          gameZone = $(".gameZone"),
          time = Math.ceil(Math.random() * 6500);
      console.log(time);
      setInterval(function () {
        var imgTarget = $("<img src=\"images/targets/".concat(Math.ceil(Math.random() * 10), ".png\" alt=\"Target\" class=\"_target\" data-intervalId=\"").concat(intervalId, "\">"));
        gameZone.prepend(imgTarget);
        imgTarget.css("left", "".concat(Math.ceil(Math.random() * 90), "%"));
        _this.targetIntervals['interval-' + intervalId] = setInterval(function () {
          _this.moveTarget(imgTarget);
        }, speed);
        intervalId++;
      }, time);
    }
  }, {
    key: "getTank",
    value: function getTank(option) {
      var tankId = option.id;
      var block = $(".tank[data-id='".concat(tankId, "']"));
      var activeTank = block.clone();
      $(".gameZone").append(activeTank);
      activeTank.addClass("active");
      block.remove();
      var bullets = option.bullets;

      for (var i = 0; i < bullets; i++) {
        var bullet = "<img src=\"images/bullets/bullet.png\" class=\"bullet\" alt=\"bullet\" data-img=\"".concat(i + 1, "\">");
        $(".arsenal").append(bullet);
      }
    }
  }, {
    key: "shoot",
    value: function shoot() {
      var bullet = $(".bullet");
      var tank = $(".active");
      var tankPos = tank.position().left;
      var lastBullet = bullet.eq(bullet.length - 1);
      var activeBullet = lastBullet.clone();
      activeBullet.attr("src", "images/bullets/activeBullet.png");
      $(".gameZone").append(activeBullet);
      lastBullet.remove();
      var activeBulletId = activeBullet.attr("data-img");
      activeBullet.css("left", "".concat(tankPos + 27, "px"));
      activeBullet.addClass("activeBull").removeClass("bullet");
      var positionBullet = 0;

      if (bullet.length) {
        var activeBullPos = bullet.position().top;
        var interval = setInterval(function () {
          if (activeBullPos !== -1) {
            $(".activeBull[data-img='".concat(activeBulletId, "']")).css("transform", "translateY(".concat(-(positionBullet += 10), "px)"));
          } else $(".activeBull[data-img='".concat(activeBulletId, "']")).remove();
        }, 50);
      }
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
$(".play").click(function (event) {
  game.play(game.options.level_1);
  $(event.target).remove();
});
$(document).on("keydown", function (e) {
  var key = e.which;
  if (key === 32) game.shoot();else if (key === 37 || key === 39) game.move(key);
});
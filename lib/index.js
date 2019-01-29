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
        targetSpeed: 60,
        score: 0
      },
      level_2: {
        id: [2, 3],
        bullets: 30,
        level_time: 4000,
        speed: 30,
        bulletsTime: 500
      }
    };
    this.targetIntervalId = null;
    this.targetIntervals = [];
    this.position = 0;
  }

  _createClass(Game, [{
    key: "play",
    value: function play(option) {
      this.tankPark(option.score);
      this.targets(option.targetSpeed);
      this.getTank(option);
    }
  }, {
    key: "tankPark",
    value: function tankPark(score) {
      var block = $(".tank");

      for (var i = 0; i < block.length; i++) {
        block.eq(i).attr("data-id", i + 1);
      }

      $(".gameZone").before("<p class=\"score\">".concat(score, "</p>"));
    }
  }, {
    key: "moveTarget",
    value: function moveTarget(elem, intervalId) {
      var top = elem.position().top;
      game.meetingModels({
        target: elem,
        targetIntervalId: this.targetIntervals[intervalId]
      });
      elem.css('top', top + 1 + 'px');
    }
  }, {
    key: "targets",
    value: function targets(speed) {
      var _this = this;

      var intervalId = 0,
          gameZone = $(".gameZone"),
          time = Math.ceil(Math.random() * 6500);
      this.targetIntervalId = setTimeout(function () {
        var imgTarget = $("<img src=\"images/targets/".concat(Math.ceil(Math.random() * 10), ".png\" alt=\"Target\" class=\"_target\" data-intervalId=\"").concat(intervalId, "\">"));
        gameZone.prepend(imgTarget);
        imgTarget.css("left", "".concat(Math.ceil(Math.random() * 90), "%"));
        _this.targetIntervals[intervalId] = setInterval(function () {
          _this.moveTarget(imgTarget, intervalId);
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

      for (var i = 1; i < bullets; i++) {
        var bullet = "<img src=\"images/bullets/bullet.png\" class=\"bullet\" alt=\"bullet\" data-img=\"".concat(i, "\">");
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
        var interval = setInterval(function () {
          var activeBullPos = activeBullet.offset().top;
          var elem = $(".activeBull[data-img='".concat(activeBulletId, "']"));
          game.meetingModels({
            bullet: elem,
            bulletIntervalId: interval
          });
          elem.css("transform", "translateY(".concat(-(positionBullet += 10), "px)"));
        }, 200);
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
  }, {
    key: "meetingModels",
    value: function meetingModels(params) {
      var bullet = params.bullet,
          target = params.target,
          bulletIntervalId = params.bulletIntervalId,
          targetIntervalId = params.targetIntervalId; // GAME ZONE PARAMS

      var zone = $(".gameZone"),
          zoneWidth = zone.outerWidth(),
          zoneHeight = zone.height(),
          zonePosTop = zone.position().top,
          zonePosLeft = zone.offset().left; // TANK PARAMETRS

      var tank = $(".active"),
          tankWidth = tank.width(),
          tankHeight = tank.height(),
          tankPos = tank.position(),
          tankPosLeft = Math.round(tankPos.left),
          tankPosTop = tankPos.top;

      if (bullet && !target) {
        var bulletPos = bullet.offset(),
            bulletPosTop = bulletPos.top;

        if (bulletPosTop > zonePosTop - 6 && bulletPosTop < zonePosTop + 6) {
          clearInterval(bulletIntervalId);
          bullet.remove();
        }
      } else if (target && !bullet) {
        var targetHeight = target.height(),
            targetPos = target.position(),
            targetPosTop = targetPos.top,
            targetPosLeft = Math.round(targetPos.left) + target.width();

        if (targetPosTop + targetHeight === zoneHeight) {
          clearInterval(targetIntervalId);
          target.remove();
        } else if (
        /*(zoneHeight - (tankHeight + targetHeight) <= targetPosTop) && */
        targetPosLeft > tankPosLeft && targetPosLeft < tankPosLeft + tankWidth) {
          console.log(true);
        }

        console.log(targetPosLeft + "NerqinS" + tankPosLeft + "--" + targetPosLeft + 'VerinS' + (tankPosLeft + tankWidth));
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
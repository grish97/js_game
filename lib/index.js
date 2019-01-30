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
        bullets: 13,
        level_time: 6000,
        speed: 5,
        bulletsSpeed: 6,
        targetSpeed: 60,
        score: 24
      },
      level_2: {
        id: 1,
        bullets: 30,
        level_time: 6000,
        speed: 15,
        bulletsSpeed: 15,
        targetSpeed: 30,
        score: 60
      }
    };
    this.localScore = 0;
    this.addTarget = null;
    this.targetIntervals = {};
    this.bulletIntervals = {};
    this.interval = 0;
    this.position = 0;
  }

  _createClass(Game, [{
    key: "play",
    value: function play(option) {
      this.tankPark();
      this.targets(option.targetSpeed, option.score);
      this.getTank(option);
    }
  }, {
    key: "tankPark",
    value: function tankPark() {
      var block = $(".tank");

      for (var i = 0; i < block.length; i++) {
        block.eq(i).attr("data-id", i + 1);
      }

      $(".gameZone").before("<div class=\"scoreBlock text-center font-weight-bold\"><p class=\"text-muted\">Score</p><p class=\"score\">".concat(this.localScore, "</p></div>"));
    }
  }, {
    key: "moveTarget",
    value: function moveTarget(elem, score) {
      var top = elem.position().top;
      this.meetingModels({
        target: elem,
        score: score
      });
      elem.css('top', top + 1 + 'px');
    }
  }, {
    key: "targets",
    value: function targets(speed, score) {
      var _this = this;

      var intervalId = 0,
          gameZone = $(".gameZone"),
          time = Math.ceil(Math.random() * 6000);
      this.addTarget = setInterval(function () {
        var imgTarget = $("<img src=\"images/targets/".concat(Math.ceil(Math.random() * 5), ".png\" alt=\"Target\" class=\"_target\" data-intervalId=\"").concat(intervalId, "\">"));
        gameZone.prepend(imgTarget);
        imgTarget.css("left", "".concat(Math.round(Math.random() * 95), "%"));
        _this.targetIntervals['interval-' + intervalId] = setInterval(function () {
          _this.moveTarget(imgTarget, score);
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
      var _this2 = this;

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
      activeBullet.attr("data-img", "".concat(this.interval));
      var positionBullet = 0;

      if (bullet && bullet.length) {
        this.bulletIntervals['interval-' + this.interval] = setInterval(function () {
          var top = activeBullet.position().top;
          activeBullet.css("top", "".concat(top - 1, "px"));

          _this2.meetingModels({
            bullet: activeBullet
          });
        }, 5);
      } else if (bullet.length === 0) {
        this.gameOver();
      }

      console.log(this.bulletIntervals);
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
          score = params.score;
      var bullets = $(".activeBull"); // GAME ZONE PARAMS

      var zone = $(".gameZone"),
          zoneWidth = zone.outerWidth(),
          zoneHeight = zone.height(),
          zonePosTop = zone.offset().top,
          zonePosLeft = zone.offset().left; // TANK PARAMETRS

      var tank = $(".active"),
          tankWidth = tank.width(),
          tankHeight = tank.height(),
          tankPos = tank.position(),
          tankPosLeft = Math.round(tankPos.left),
          tankPosTop = tankPos.top;

      if (bullet && !target) {
        var bulletIntervalId = bullet.attr("data-img"),
            bulletHeight = bullet.height(),
            bulletPos = bullet.position(),
            bulletPosTop = bulletPos.top;

        if (bulletPosTop === zonePosTop - (tankHeight + bulletHeight)) {
          clearInterval(this.bulletIntervals['interval-' + bulletIntervalId]);
          bullet.remove();
        }
      } else if (target && !bullet) {
        var targetIntervalId = this.targetIntervals[target.attr("data-intervalId")],
            targetHeight = target.height(),
            targetWidth = target.outerWidth(),
            targetPos = target.position(),
            targetPosTop = targetPos.top,
            targetPosLeft = Math.round(targetPos.left);

        if (targetPosTop + targetHeight === zoneHeight) {
          clearInterval(this.targetIntervals['interval-' + targetIntervalId]);
          target.remove();
        } else if (zoneHeight - (tankHeight + targetHeight) <= targetPosTop && tankPosLeft <= targetPosLeft + targetWidth && targetPosLeft < tankPosLeft + tankWidth) {
          clearInterval(this.targetIntervals['interval-' + targetIntervalId]);
          this.gameOver();
        } else if (bullets && target) {
          for (var i = 0; i < bullets.length; i++) {
            var _bullet = bullets.eq(i),
                _bulletIntervalId = bullets.eq(i).attr("data-img"),
                bulletWidth = bullets.eq(i).width(),
                _bulletHeight = bullets.eq(i).height(),
                _bulletPos = bullets.eq(i).position(),
                _bulletPosTop = _bulletPos.top,
                bulletPosLeft = _bulletPos.left;

            if (targetPosLeft < bulletPosLeft + bulletWidth && bulletPosLeft < targetPosLeft + targetWidth && targetPosTop + targetWidth >= _bulletPosTop) {
              clearInterval(this.targetIntervals['interval-' + targetIntervalId]);
              clearInterval(this.bulletIntervals['interval-' + _bulletIntervalId]);
              console.log(this.bulletIntervals['interval-' + _bulletIntervalId]);
              target.remove();

              _bullet.remove();

              score = $(".score").text(this.localScore += 2);
            }
          }
        }
      }

      console.log(score);

      if (this.localScore === score) {
        var content = $("#content"),
            vicBlock = "<div class=\"gameOver text-center pb-5\">\n                                <h3>VICTORY LEVEL 1</h3>\n                                <p class=\"text-muted\">YOUR SCORE: ".concat(this.localScore, "</p>\n                                <button type=\"submit\" class=\" btn btn-danger nextLevel\">level 2</button>\n                            </div>");
        content.append(vicBlock);
        content.addClass("victory");

        for (var _i = 0; _i < this.targetIntervals.length; _i++) {
          clearInterval(this.targetIntervals[_i]);
        }

        this.emptyData();
      }
    }
  }, {
    key: "gameOver",
    value: function gameOver() {
      var content = $("#content"),
          gameOverBlock = "<div class=\"gameOver text-center pb-5\">\n                                <p class=\"text-muted\">YOUR SCORE: ".concat(this.localScore, "</p>\n                                <button type=\"submit\" class=\" btn btn-danger playAgain\">Play Again</button>\n                            </div>");
      content.addClass("end");
      content.append(gameOverBlock);
      this.emptyData();
    }
  }, {
    key: "emptyData",
    value: function emptyData() {
      $.each(this.targetIntervals, function (key, value) {
        clearInterval(value);
      });
      $.each(this.bulletIntervals, function (key, value) {
        clearInterval(value);
      });
      this.score = 0;
      this.localScore = 0;
      this.addTarget = null;
      this.targetIntervals = {};
      this.bulletIntervals = {};
      this.position = 0;
      $(".arsenal").empty();
      $("._target").remove();
      $(".scoreBlock").remove();
      $(".active").css("transform", "translateY(0)");
    }
  }]);

  return Game;
}();

var game = new Game();
$(".play").click(function (event) {
  $("#content").removeClass("start");
  game.play(game.options.level_1);
  $(event.target).remove();
});
$(document).on("keydown", function (e) {
  var key = e.which;

  if (key === 32) {
    game.shoot();
    game.interval++;
  } else if (key === 37 || key === 39) game.move(key);
});
$(document).on("click", ".playAgain", function () {
  $("#content").removeClass("end");
  $(".gameOver").remove();
  game.play(game.options.level_1);
});
$(document).on("click", ".nextLevel", function () {
  $("#content").removeClass("victory");
  $(".gameOver").remove();
  game.play(game.options.level_2);
  $(event.target).remove();
});
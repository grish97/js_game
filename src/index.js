class Game
{
    constructor () {
        this.options = {
            level_1 : {
                id : 1,
                bullets : 30,
                level_time : 6000,
                speed    : 15,
                bulletsSpeed : 5000,
                targetSpeed : 60,
                score : 0
            },
            level_2 : {
                id : [2,3],
                bullets : 30,
                level_time : 4000,
                speed    : 30,
                bulletsTime  : 500
            },
        };
        this.addTarget = null;
        this.targetIntervals = [];
        this.position = 0;
    }

    play (option) {
        this.tankPark(option.score);
        this.targets(option.targetSpeed);
        this.getTank(option);
    }

    tankPark (score) {
        let block =  $(`.tank`);
        for (let i = 0; i < block.length; i++) {
            block.eq(i).attr(`data-id`,(i+1));
        }
        $(`.gameZone`).before(`<p class="score">${score}</p>`);
    }

    moveTarget(elem) {
        let top = elem.position().top;
        this.meetingModels({target: elem});
        elem.css('top',(top+1)+'px');
    }

    targets (speed) {
        let intervalId = 0,
            gameZone = $(`.gameZone`),
            time = Math.ceil(Math.random() * 7000);

        this.addTarget = setTimeout(()=> {
            let imgTarget = $(`<img src="images/targets/${Math.ceil(Math.random() * 5)}.png" alt="Target" class="_target" data-intervalId="${intervalId}">`);
            gameZone.prepend(imgTarget);
            imgTarget.css(`left`,`${Math.round(Math.random() * 95)}%`);
            this.targetIntervals[intervalId] = setInterval(() => {
                this.moveTarget(imgTarget);
            },speed);
            intervalId++;
        },time);
    }

    getTank (option) {
        let tankId = option.id;
        let block = $(`.tank[data-id='${tankId}']`);
        let activeTank = block.clone();
        $(`.gameZone`).append(activeTank);
        activeTank.addClass(`active`);
        block.remove();
        let bullets = option.bullets;

        for (let i = 1; i < bullets; i++) {
            let bullet = `<img src="images/bullets/bullet.png" class="bullet" alt="bullet" data-img="${i}">`;
            $(`.arsenal`).append(bullet);
        }
    }

    shoot () {
        let bullet = $(`.bullet`);
        let tank   = $(`.active`);
        let tankPos = tank.position().left;
        let lastBullet = bullet.eq(bullet.length - 1);
        let activeBullet = lastBullet.clone();
        activeBullet.attr(`src`,`images/bullets/activeBullet.png`);
        $(`.gameZone`).append(activeBullet);
        lastBullet.remove();
        let activeBulletId = activeBullet.attr(`data-img`);
        activeBullet.css(`left`,`${tankPos + 27}px`);
        activeBullet.addClass(`activeBull`).removeClass(`bullet`);
        let positionBullet = 0;

        if (bullet.length) {
            let interval = setInterval(() => {
                let activeBullPos = activeBullet.offset().top;
                let elem = $(`.activeBull[data-img='${activeBulletId}']`);
                game.meetingModels({bullet : elem, bulletIntervalId : interval});
                elem.css(`transform`,`translateY(${-(positionBullet += 10)}px)`);
            },200);
        }


    }

    move (keyCode) {
        let activeTank  = $(`.active`);
        let activeTankPosLeft = activeTank.offset().left;
        let speed = this.options.level_1.speed;
        if(keyCode === 37) {
            if (this.position > (-270)) {
                this.position  -= speed;
                activeTank.css(`transform`,`translateX(${this.position}px`);

            }
        }else if(keyCode === 39) {
            if (this.position < 330) {
                this.position  += speed;
                activeTank.css(`transform`,`translateX(${this.position}px`);
            }
        }
    }

    meetingModels (params) {
        let {bullet,target,bulletIntervalId} = params;
            // GAME ZONE PARAMS
        let zone = $(`.gameZone`),
            zoneWidth = zone.outerWidth(),
            zoneHeight = zone.height(),
            zonePosTop = zone.position().top,
            zonePosLeft = zone.offset().left;

        // TANK PARAMETRS
        let tank = $(`.active`),
            tankWidth = tank.outerWidth(),
            tankHeight = tank.height(),
            tankPos = tank.position(),
            tankPosLeft = Math.round(tankPos.left),
            tankPosTop = tankPos.top;

        let bullets = $(`.activeBull`);

        if (bullet && !target) {
            let bulletPos = bullet.offset(),
                bulletPosTop = bulletPos.top;

            if (bulletPosTop > zonePosTop -6 && bulletPosTop < zonePosTop +6) {
                clearInterval(bulletIntervalId);
                bullet.remove();
            }
        }else if(target && !bullet) {
            let targetIntervalId = this.targetIntervals[target.attr(`data-intervalId`)],
                targetHeight = target.height(),
                targetWidth  = target.width(),
                targetPos = target.position(),
                targetPosTop = targetPos.top,
                targetPosLeft = Math.round(targetPos.left);

                if ((targetPosTop +targetHeight) === zoneHeight) {
                    clearInterval(targetIntervalId);
                    target.remove();
                }else if((zoneHeight - (tankHeight + targetHeight) <= targetPosTop) && ((tankPosLeft <= (targetPosLeft + targetWidth)) && ((targetPosLeft + targetWidth) < (tankPosLeft + tankWidth)))) {
                    clearInterval(targetIntervalId);
                    this.gameOver();
                }else if (bullets && target) {
                    for (let i = 0; i < bullets.length; i++) {
                        let bulletWidth = bullets.eq(i).width(),
                            bulletHeight = bullets.eq(i).height(),
                            bulletPos = bullets.eq(i).position(),
                            bulletPosTop = bulletPos.top,
                            bulletPosLeft = bulletPos.left;
                        // console.log((targetPosLeft < bulletPosLeft && bulletPosLeft < (targetPosLeft + targetWidth)));
                        console.log(zoneHeight-targetPosTop,zoneHeight-bulletPosTop);
                    }
                }
        }
    }

    gameOver () {

    }
}

let game = new Game();

$(`.play`).click((event) =>{
    game.play(game.options.level_1);
    $(event.target).remove();
});

$(document).on(`keydown`, (e) => {
    let key = e.which;
    if (key === 32) game.shoot();
    else if ((key === 37) || (key === 39)) game.move(key);
});

class Game
{
    constructor () {
        this.options = {
            level_1 : {
                id : 1,
                bullets : 13,
                level_time : 6000,
                speed    : 5,
                bulletsSpeed : 6,
                targetSpeed : 60,
                score : 24
            },
            level_2 : {
                id : 1,
                bullets : 30,
                level_time : 6000,
                speed    : 15,
                bulletsSpeed : 15,
                targetSpeed : 30,
                score : 60
            },
        };
        this.localScore = 0;
        this.addTarget = null;
        this.targetIntervals = {};
        this.bulletIntervals = {};
        this.interval = 0;
        this.position = 0;
    }

    play (option) {
        this.tankPark();
        this.targets(option.targetSpeed,option.score);
        this.getTank(option);
    }

    tankPark () {
        let block =  $(`.tank`);
        for (let i = 0; i < block.length; i++) {
            block.eq(i).attr(`data-id`,(i+1));
        }
        $(`.gameZone`).before(`<div class="scoreBlock text-center font-weight-bold"><p class="text-muted">Score</p><p class="score">${this.localScore}</p></div>`);
    }

    moveTarget(elem,score) {
        let top = elem.position().top;
        this.meetingModels({target: elem, score: score});
        elem.css('top',(top+1)+'px');
    }

    targets (speed,score) {
        let intervalId = 0,
            gameZone = $(`.gameZone`),
            time = Math.ceil(Math.random() * 6000);

        this.addTarget = setInterval(()=> {
            let imgTarget = $(`<img src="images/targets/${Math.ceil(Math.random() * 5)}.png" alt="Target" class="_target" data-intervalId="${intervalId}">`);
            gameZone.prepend(imgTarget);
            imgTarget.css(`left`,`${Math.round(Math.random() * 95)}%`);
            this.targetIntervals['interval-' + intervalId] = setInterval(() => {
                this.moveTarget(imgTarget,score);
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
        activeBullet.attr(`data-img`,`${this.interval}`);
        let positionBullet = 0;

        if (bullet && bullet.length) {
            this.bulletIntervals['interval-' + this.interval] = setInterval(() => {
                let top = activeBullet.position().top;
                activeBullet.css(`top`, `${top - 1}px`);
                this.meetingModels({bullet : activeBullet});
            },5);
        }else if(bullet.length ===0) {
            this.gameOver();
        }
        console.log(this.bulletIntervals);
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
        let {bullet,target, score} = params;
        let bullets = $(`.activeBull`);
            // GAME ZONE PARAMS
        let zone = $(`.gameZone`),
            zoneWidth = zone.outerWidth(),
            zoneHeight = zone.height(),
            zonePosTop = zone.offset().top,
            zonePosLeft = zone.offset().left;

        // TANK PARAMETRS
        let tank = $(`.active`),
            tankWidth = tank.width(),
            tankHeight = tank.height(),
            tankPos = tank.position(),
            tankPosLeft = Math.round(tankPos.left),
            tankPosTop = tankPos.top;


        if (bullet && !target) {
            let bulletIntervalId = bullet.attr(`data-img`),
                bulletHeight = bullet.height(),
                bulletPos = bullet.position(),
                bulletPosTop = bulletPos.top;

            if (bulletPosTop===(zonePosTop - (tankHeight + bulletHeight))) {
                clearInterval(this.bulletIntervals['interval-' + bulletIntervalId]);
                bullet.remove();
            }
        }else if(target && !bullet) {
            let targetIntervalId = this.targetIntervals[target.attr(`data-intervalId`)],
                targetHeight = target.height(),
                targetWidth  = target.outerWidth(),
                targetPos = target.position(),
                targetPosTop = targetPos.top,
                targetPosLeft = Math.round(targetPos.left);

                if ((targetPosTop +targetHeight) === zoneHeight) {
                    clearInterval(this.targetIntervals['interval-' + targetIntervalId]);
                    target.remove();
                }else if((zoneHeight - (tankHeight + targetHeight) <= targetPosTop) && ((tankPosLeft <= (targetPosLeft + targetWidth) )  && (targetPosLeft < (tankPosLeft + tankWidth)))) {
                   clearInterval(this.targetIntervals['interval-' + targetIntervalId]);
                    this.gameOver();
                }else if (bullets && target) {
                    for (let i = 0; i < bullets.length; i++) {
                        let _bullet = bullets.eq(i),
                            _bulletIntervalId = bullets.eq(i).attr(`data-img`),
                            bulletWidth = bullets.eq(i).width(),
                            bulletHeight = bullets.eq(i).height(),
                            bulletPos = bullets.eq(i).position(),
                            bulletPosTop = bulletPos.top,
                            bulletPosLeft = bulletPos.left;
                        if ((targetPosLeft < (bulletPosLeft + bulletWidth) && bulletPosLeft < (targetPosLeft + targetWidth)) && (targetPosTop + targetWidth) >= bulletPosTop) {
                            clearInterval(this.targetIntervals['interval-' + targetIntervalId]);
                            clearInterval(this.bulletIntervals['interval-'+_bulletIntervalId]);
                            console.log(this.bulletIntervals['interval-'+_bulletIntervalId]);
                            target.remove();
                            _bullet.remove();
                            score = $(`.score`).text(this.localScore +=2);
                        }
                    }
                }
        }
        console.log(score);
        if (this.localScore === score) {
            let content = $(`#content`),
                vicBlock = `<div class="gameOver text-center pb-5">
                                <h3>VICTORY LEVEL 1</h3>
                                <p class="text-muted">YOUR SCORE: ${this.localScore}</p>
                                <button type="submit" class=" btn btn-danger nextLevel">level 2</button>
                            </div>`;
            content.append(vicBlock);
            content.addClass(`victory`);
            for (let i = 0; i < this.targetIntervals.length;i++) {
                clearInterval(this.targetIntervals[i]);
            }
            this.emptyData();
        }
    }

    gameOver () {
        let content = $(`#content`),
            gameOverBlock = `<div class="gameOver text-center pb-5">
                                <p class="text-muted">YOUR SCORE: ${this.localScore}</p>
                                <button type="submit" class=" btn btn-danger playAgain">Play Again</button>
                            </div>`;
            content.addClass(`end`);
            content.append(gameOverBlock);
            this.emptyData();
    }

    emptyData () {
        $.each(this.targetIntervals, (key,value) => {
            clearInterval(value);
        });

        $.each(this.bulletIntervals , (key,value) => {
            clearInterval(value);
        });
        this.score = 0;
        this.localScore = 0;
        this.addTarget = null;
        this.targetIntervals = {};
        this.bulletIntervals = {};
        this.position = 0;
        $(`.arsenal`).empty();
        $(`._target`).remove();
        $(`.scoreBlock`).remove();
        $(`.active`).css(`transform`,`translateY(0)`)
    }
}

let game = new Game();

$(`.play`).click((event) =>{
    $(`#content`).removeClass(`start`);
    game.play(game.options.level_1);
    $(event.target).remove();
});

$(document).on(`keydown`, (e) => {
    let key = e.which;
    if (key === 32) {
        game.shoot();
        game.interval++;
    }
    else if ((key === 37) || (key === 39)) game.move(key);
});

$(document).on(`click`,`.playAgain`, () => {
    $(`#content`).removeClass(`end`);
    $(`.gameOver`).remove();
    game.play(game.options.level_1);
});

$(document).on(`click`,`.nextLevel`, () => {
    $(`#content`).removeClass(`victory`);
    $(`.gameOver`).remove();
    game.play(game.options.level_2);
    $(event.target).remove();
});

class Game
{
    constructor () {
        this.options = {
            level_1 : {
                id : 0,
                bullets : 20,
                level_time : 6000,
                speed    : 5,
                bulletsSpeed : 6,
                targetSpeed : 60,
                point : 2,
                victoryScore : 30
            },
            level_2 : {
                id : 1,
                bullets : 26,
                level_time : 6000,
                speed    : 15,
                bulletsSpeed : 4,
                targetSpeed : 20,
                point : 3,
                victoryScore : 72
            },
            level_3 : {
                id : 0,
                bullets : 22,
                level_time : 6000,
                speed    : 5,
                bulletsSpeed : 4,
                targetSpeed : 18,
                point : 5,
                victoryScore : 100
            },
            level_4 : {
                id : 1,
                bullets : 32,
                level_time : 6000,
                speed    : 5,
                bulletsSpeed : 4,
                targetSpeed : 15,
                point : 7,
                victoryScore : 214
            },
        };
        this.levelId = 1;
        this.localScore = 0;
        this.bulletCount = null;
        this.addTarget = null;
        this.targetIntervals = {};
        this.bulletIntervals = {};
        this.interval = 0;
        this.position = 0;
        this.activeTankId = null;
    }

    play (option) {
        this.bulletCount = option.bullets;
        this.targets(option.targetSpeed,option.victoryScore,option.point);
        this.tankPark();
        Game.getTank(option);
    }

    tankPark () {
        let block =  $(`.tank`);
        for (let i = 0; i < block.length; i++) {
            block.eq(i).attr(`data-id`,(i)).attr(`draggable`,`false`);
        }
        $(`.gameZone`).before(`<div class="scoreBlock text-center font-weight-bold">
                                    <p class="text-muted">Score</p> 
                                    <p class="score infoBlock">${this.localScore}</p>
                                    <p class="text-muted">Count Bullets</p>
                                    <p class="countBull infoBlock">${this.bulletCount}</p> 
                               </div>`);
    }

    moveTarget(elem,score,point) {
        let top = elem.position().top;
        this.meetingModels({target: elem, score: score,point : point});
        elem.css('top',(top+1)+'px');
    }

    targets (speed,score,point) {
        let intervalId = 0,
            gameZone = $(`.gameZone`),
            time = 3000;

        this.addTarget = setInterval(()=> {
            let imgTarget = $(`<img src="images/targets/${Math.ceil(Math.random() * 5)}.png" alt="Target" class="_target" data-intervalId="${intervalId}">`);
            gameZone.prepend(imgTarget);
            imgTarget.css(`left`,`${Math.round(Math.random() * 95)}%`);
            this.targetIntervals['interval-' + intervalId] = setInterval(() => {
                this.moveTarget(imgTarget,score,point);
            },speed);
            intervalId++;
            time = Math.ceil(Math.random() * 2500);
        },time);
    }

    static getTank (option) {
        let tankId = option.id,
            block = $(`.tank[data-id='${tankId}']`),
            activeTank = block.clone();
        this.activeTankId = tankId;
        $(`.gameZone`).append(activeTank);
        activeTank.addClass(`active`);
        block.remove();
        let bullets = option.bullets;

        for (let i = 0; i < bullets; i++) {
            let bullet = `<img src="images/bullets/bullet.png" class="bullet" alt="bullet" data-img="${i}">`;
            $(`.arsenal`).append(bullet);
        }
    }

    shoot (e) {
        if(this.bulletCount === 0) {
            e.preventDefault();
            this.gameOver();
        }
        $(`.countBull`).text(this.bulletCount-=1);
        let bullet = $(`.bullet`);
        let tank   = $(`.active`);
        let tankPos = tank.position().left;
        let lastBullet = bullet.eq(bullet.length - 1);
        let activeBullet = lastBullet.clone();
        activeBullet.attr(`src`,`images/bullets/activeBullet.png`);
        $(`.gameZone`).append(activeBullet);
        lastBullet.remove();
        activeBullet.css(`left`,`${tankPos + 27}px`);
        activeBullet.addClass(`activeBull`).removeClass(`bullet`);
        activeBullet.attr(`data-img`,`${this.interval}`);

        if (bullet && bullet.length) {
            this.bulletIntervals['interval-' + this.interval] = setInterval(() => {
                let top = activeBullet.position().top;
                activeBullet.css(`top`, `${top - 1}px`);
                this.meetingModels({bullet : activeBullet});
            },5);
        }
    }

    move (params) {
        let {keyCode,mousePos} = params,
            zone = $(`.gameZone`),
            zoneWidth = zone.width(),
            zonePosLeft = Math.round(zone.offset().left),
            activeTank  = $(`.active`),
            tankWidth = activeTank.width(),
            tankPos = activeTank.offset(),
            tankPosLeft = Math.round(tankPos.left),
            speed  = this.options[`level_${this.levelId}`].speed;
        // KEY EVENT
        if (keyCode) {
            if(keyCode === 37) {
                if (tankPosLeft >= zonePosLeft) {
                    this.position  -= speed;
                    activeTank.css(`left`,`${this.position}px`);
                }
            }else if(keyCode === 39) {
                if ((tankPosLeft + tankWidth) < (zonePosLeft + zoneWidth)) {
                    this.position  += speed;
                    activeTank.css(`left`,`${this.position}px`);
                }
            }
        }
        // MOUSE EVENT
        else if(mousePos) {
            if ((mousePos > (zonePosLeft + 12)) && (mousePos+(tankWidth/2)) < (zonePosLeft + (zoneWidth - 10))) {
                this.position = mousePos - ((zoneWidth/2) + (tankWidth/2));
                activeTank.css(`left`, `${this.position}px`);
            }
        }
    }

    meetingModels (params) {
        let {bullet,target, score,point} = params;
        let bullets = $(`.activeBull`);
            // GAME ZONE PARAMS
        let zone = $(`.gameZone`),
            zoneHeight = zone.height(),
            zonePosTop = zone.offset().top;

        // TANK PARAMETERS
        let tank = $(`.active`),
            tankWidth = tank.width(),
            tankHeight = tank.height(),
            tankPos = tank.position(),
            tankPosLeft = Math.round(tankPos.left);


        if (bullet && !target) {
            let bulletIntervalId = bullet.attr(`data-img`),
                bulletHeight = bullet.height(),
                bulletPos = bullet.position(),
                bulletPosTop = bulletPos.top;

            if (bulletPosTop===(zonePosTop - (tankHeight + bulletHeight))) {
                this._clearInterval({bulletTimer : this.bulletIntervals['interval-' + bulletIntervalId]});
                bullet.remove();
            }
        }else if(target && !bullet) {
            let targetIntervalId = this.targetIntervals[target.attr(`data-intervalId`)],
                targetHeight = target.height(),
                targetWidth  = target.outerWidth(),
                targetPos = target.position(),
                targetPosTop = targetPos.top,
                targetPosLeft = Math.round(targetPos.left);

                if ((targetPosTop + targetHeight) === zoneHeight) {
                    this._clearInterval({targetTimer : this.targetIntervals['interval-' + targetIntervalId]});
                    target.remove();
                    this.gameOver();
                }else if((zoneHeight - (tankHeight + targetHeight) <= targetPosTop) && ((tankPosLeft <= (targetPosLeft + targetWidth) )  && (targetPosLeft < (tankPosLeft + tankWidth)))) {
                    this._clearInterval({targetTimer : this.targetIntervals['interval-' + targetIntervalId]});
                    this.gameOver();
                }else if (bullets && target) {
                    for (let i = 0; i < bullets.length; i++) {
                        let _bullet = bullets.eq(i),
                            _bulletIntervalId = bullets.eq(i).attr(`data-img`),
                            bulletWidth = bullets.eq(i).width(),
                            // bulletHeight = bullets.eq(i).height(),
                            bulletPos = bullets.eq(i).position(),
                            bulletPosTop = bulletPos.top,
                            bulletPosLeft = bulletPos.left;
                        if ((targetPosLeft < (bulletPosLeft + bulletWidth) && bulletPosLeft < (targetPosLeft + targetWidth)) && (targetPosTop + targetWidth) >= bulletPosTop) {
                            this._clearInterval({targetTimer : this.targetIntervals['interval-' + targetIntervalId]});
                            this._clearInterval({bulletTimer : this.bulletIntervals['interval-'+_bulletIntervalId]});
                            target.remove();
                            _bullet.remove();
                            $(`.score`).text(this.localScore += point);
                        }
                    }

                    if (score === this.localScore) {
                        let content = $(`#content`),
                            vicBlock = `<div class="gameInfo text-center pb-5">
                                            <h2>VICTORY LEVEL ${game.levelId++}</h2>
                                            <p class="">YOUR SCORE ${this.localScore}</p>
                                            <button type="submit" class="play nextLevel">level ${game.levelId}</button>
                                        </div>`;
                        content.prepend(vicBlock);
                        content.addClass(`victory`);
                        this.emptyData();
                    }
                }
        }
    }

    gameOver () {
        let content = $(`#content`),
            gameOverBlock = `<div class="gameInfo text-center pb-5">
                                <p class="text-muted">YOUR SCORE ${this.localScore}</p>
                                <button type="submit" class="play playAgain">Play Again</button>
                            </div>`;
            content.addClass(`end`);
            content.prepend(gameOverBlock);
        this.emptyData();
    }

    emptyData () {
        this._clearInterval({allTimer : true});
        this.victoryScore = 0;
        this.localScore = 0;
        this.addTarget = null;
        this.targetIntervals = {};
        this.bulletIntervals = {};
        this.position = 0;
        $(`.arsenal`).empty();
        $(`._target`).remove();
        $(`.activeBull`).remove();
        $(`.scoreBlock`).remove();
    }

    _clearInterval (params) {
        let {bulletTimer,targetTimer,allTimer} = params;

        if(bulletTimer) {
            clearInterval(bulletTimer)
        }else if (targetTimer) {
            clearInterval(targetTimer)
        }else if(allTimer) {
            clearInterval(this.addTarget);
            $.each(this.targetIntervals, (key,value) => {
                clearInterval(value);
            });
            $.each(this.bulletIntervals,(key,value) => {
               clearInterval(value);
            });
        }
    }
}
// EXAMPLE CLASS
let game = new Game();
let gameZone = $(`.gameZone`);
// PLAY EVENT
$(`.play`).click((event) =>{
    $(`#content`).removeClass(`start`);
    game.play(game.options[`level_${game.levelId}`]);
    $(event.target).remove();
});
// SHOOT EVENT
$(document).on(`keydown`, (e) => {
    let key = e.which;
    if (key === 32) {
        game.shoot(e);
        game.interval++;
    }
    else if ((key === 37) || (key === 39)) game.move({keyCode : key});
});

// SHOOT CLICK MOUSE
gameZone.on(`click`, (e) => {
    let key = e.which;
    if (key === 1) {
        game.shoot(e);
        game.interval++;
    }
});
//MOVE EVENT MOUSE
gameZone.on(`mousemove`, (e) => {
    game.move({mousePos : e.pageX});
});
// EVENT PLAY AGAIN
$(document).on(`click`,`.playAgain`, () => {
    $(`#content`).removeClass(`end`);
    $(`.gameInfo`).remove();
    $(`.gameOver`).remove();
    game.emptyData();
    game.play(game.options.level_1);
});
// EVENT NEXT LEVEL
$(document).on(`click`,`.nextLevel`, () => {
    $(`#content`).removeClass(`victory`);
    $(`.gameInfo`).remove();
    $(`.gameOver`).remove();
    game.emptyData();
    game.play(game.options[`level_${game.levelId}`]);
});
// CLEAR ALL INTERVALS
window.addEventListener('beforeunload', function () {
    game.emptyData();
});

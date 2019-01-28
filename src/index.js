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
                targetSpeed : 10
            },
            level_2 : {
                id : [2,3],
                bullets : 30,
                level_time : 4000,
                speed    : 30,
                bulletsTime  : 500
            },
        };
        this.targetIntervals = {};
        this.position = 0;
    }

    play (option) {
        this.tankPark();
        this.targets(option.targetSpeed);
        this.getTank(option);
    }


    tankPark () {
        let block =  $(`.tank`);
        for (let i = 0; i < block.length; i++) {
            block.eq(i).attr(`data-id`,(i+1));
        }
    }

    moveTarget(elem) {
        let top = elem.position().top;
        elem.css('top',(top+0.3)+'px');
    }



    targets (speed) {
        let intervalId = 0,
            gameZone = $(`.gameZone`),
            time = Math.ceil(Math.random() * 6500);
        console.log(time);

        setInterval(()=> {
            let imgTarget = $(`<img src="images/targets/${Math.ceil(Math.random() * 10)}.png" alt="Target" class="_target" data-intervalId="${intervalId}">`);
            gameZone.prepend(imgTarget);
            imgTarget.css(`left`,`${Math.ceil(Math.random() * 90)}%`);
            this.targetIntervals['interval-'+intervalId] = setInterval(() => {
                this.moveTarget(imgTarget)
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

        for (let i = 0; i < bullets; i++) {
            let bullet = `<img src="images/bullets/bullet.png" class="bullet" alt="bullet" data-img="${i + 1}">`;
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
            let activeBullPos = bullet.position().top;
            let interval = setInterval(() => {
                if(activeBullPos !== -1) {
                    $(`.activeBull[data-img='${activeBulletId}']`).css(`transform`,`translateY(${-(positionBullet += 10)}px)`);
                }else $(`.activeBull[data-img='${activeBulletId}']`).remove();
            },50);
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

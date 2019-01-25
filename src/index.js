class Game
{
    constructor () {
        this.options = {
            level_1 : {
                id : 1,
                bullets : 30,
                level_time : 6000,
                speed    : 15,
                bulletsTime  : 500
            },
            level_2 : {
                id : [2,3],
                bullets : 30,
                level_time : 4000,
                speed    : `30px`,
                bulletsTime  : 500
            },
        };
        this.position = 0;
        this.tankPark();
    }


    tankPark () {
        let block =  $(`.tank`);
        for (let i = 0; i < block.length; i++) {
            block.eq(i).attr(`data-id`,(i+1));
        }
        this.getTank();
    }

    getTank () {
        let option = this.options.level_1;
        let tankId = option.id;
        let block = $(`.tank[data-id='${tankId}']`);
        let activeTank = block.clone();
        $(`.gameZone`).append(activeTank);
        activeTank.addClass(`active`);
        block.remove();
        let bullets = option.bullets;

        for (let i = 0; i < bullets; i++) {
            let bullet = `<img src="images/bullets/bullet.jpg" class="d- bullet" alt="bullet" data-img="${i + 1}">`;
            $(`.arsenal`).append(bullet);
        }
    }

    shoot () {


    }

    move (keyCode) {
        let activeTank  = $(`.active`);
        let parent = activeTank.parent();
        let widthPar = parent.outerWidth();
        let speed = this.options.level_1.speed;
        console.log(/*activeTank.position().left >= parent.offset().left ||*/ activeTank.offset().left  , (parent.offset().left + widthPar));
        if (/*activeTank.position().left >= parent.offset().left ||*/ activeTank.offset().left <= (parent.offset().left + widthPar)) {
            if(keyCode === 37) {
                this.position  -= speed;
                activeTank.css(`transform`,`translateX(${this.position}px`);
            }
            else if(keyCode === 39) {
                this.position  += speed;
                activeTank.css(`transform`,`translateX(${this.position}px`);
            }
        }
    }
}

let game = new Game();

$(document).on(`keydown`, (e) => {
    let key = e.which;
    if (key === 32) game.shoot();
    else if ((key === 37) || (key === 39)) game.move(key);
});

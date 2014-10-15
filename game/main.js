/**
 * Created with WebStorm.
 * User: stan229
 * Date: 10/14/14
 * Time: 2:28 PM
 */
var Backgammon = {
    init : function () {
        var game = this.game = new Phaser.Game(1280, 720, Phaser.AUTO, 'backgammon');

        game.state.add('Game', this.Game, false);
        game.state.start('Game');
    }
};

Backgammon.Game = {
    buckets       : undefined,
    diceGroup     : undefined,
    diceRollGroup : undefined,
    preload       : function () {
        var load = this.game.load;

        load.image('board-bg', 'resources/sprites/board-bg.jpg');
        load.image('black-checker', 'resources/sprites/black-checker.png');
        load.image('white-checker', 'resources/sprites/white-checker.png');
        load.image('rollDiceButton', 'resources/sprites/rollDiceButton.png');

        load.spritesheet('diceRoll', 'resources/sprites/diceRoll.png', 96, 96);
        load.spritesheet('dice', 'resources/sprites/dice.png', 96, 96);
    },
    create      : function () {
        var game = this.game,
            buckets = [],
            bucket,
            diceGroup,
            diceRollGroup,
            leftDiceRoll,
            rightDiceRoll,
            rollAnim,
            i;

        game.add.sprite(0, 0, 'board-bg');

        for (i = 0; i < 24; i++) {
            bucket = Object.create(Backgammon.Bucket);
            bucket.init(game, i);
            buckets.push(bucket);
        }

        this.buckets = buckets;

        this.addCheckers(buckets[0], 'black', 5);
        this.addCheckers(buckets[4], 'white', 3);
        this.addCheckers(buckets[6], 'white', 5);
        this.addCheckers(buckets[11], 'black', 2);
        this.addCheckers(buckets[12], 'white', 2);
        this.addCheckers(buckets[17], 'black', 5);
        this.addCheckers(buckets[19], 'black', 3);
        this.addCheckers(buckets[23], 'white', 5);


        diceGroup = this.diceGroup = game.add.group();
        diceGroup.createMultiple(2, 'dice', 0, false);


        diceRollGroup = this.diceRollGroup = game.add.group();

        leftDiceRoll = diceRollGroup.create(game.world.width / 2 - 90, game.world.height / 2 - 90, 'diceRoll', 0);
        rightDiceRoll = diceRollGroup.create(game.world.width / 2, game.world.height / 2 - 90, 'diceRoll', 0);

        rollAnim = leftDiceRoll.animations.add('roll', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], 30, true);
        rollAnim.onLoop.add(this.onRollAnimationLoop.bind(this));

        rollAnim = rightDiceRoll.animations.add('roll', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], 30, true);
        rollAnim.onLoop.add(this.onRollAnimationLoop.bind(this));
        rollAnim.onComplete.add(this.onRollAnimationComplete.bind(this));

        diceRollGroup.callAll('kill');

        game.add.button(game.world.width / 2 - 48, 100, 'rollDiceButton', this.onRollDiceButtonClick, this);




    },
    addCheckers : function (bucket, color, count) {
        var checker,
            i;

        for (i = 0; i < count; i++) {
            checker = Object.create(Backgammon.Checker);
            checker.init(this.game, color, bucket);
            checker.create();
        }

    },
    update      : function () {

    },
    getDiceRoll : function () {
        var firstNum = this.game.rnd.integerInRange(1,6),
            secondNum = this.game.rnd.integerInRange(1,6);

        return [firstNum, secondNum];
    },
    showDice : function () {
        var roll = this.getDiceRoll(),
            game = this.game,
            dice;

        console.log(roll);
        dice = this.diceGroup.getAt(0);
        dice.reset(game.world.width / 2 - 96, game.world.height / 2 - 90);
        dice.frame = roll[0] - 1;

        dice = this.diceGroup.getAt(1);
        dice.reset(game.world.width / 2, game.world.height / 2 - 90);
        dice.frame = roll[1] - 1;
    },
    onRollDiceButtonClick  : function () {
        if(!this.diceRollGroup.isAnimating) {
            this.diceRollGroup.isAnimating = true;
            this.diceRollGroup.callAll('revive');

            this.diceRollGroup.callAll('play',null,'roll', null, true, true);
        }
    },
    onRollAnimationLoop : function (sprite, animation) {
        if(animation.loopCount = 4) {
            animation.loop = false;
        }
    },
    onRollAnimationComplete : function (sprite) {
        this.showDice();
    }

};

// 87x285
Backgammon.Bucket = {
    game              : undefined,
    index             : undefined,
    checkers          : undefined,
    count             : undefined,
    color             : undefined,
    x                 : undefined,
    y                 : undefined,
    width             : undefined,
    height            : undefined,
    init              : function (game, index) {
        var position;

        this.game = game;
        this.checkers = [];
        this.count = 0;
        this.index = index;

        this.width = 87;
        this.height = 285;

        position = this.getBucketPosition(index);

        this.x = position.x;
        this.y = position.y;

    },
    addChecker        : function (checker) {
        this.checkers.push(checker);
        this.count = this.checkers.length;
    },
    removeChecker     : function () {
        this.checkers.pop();
        this.count = this.checkers.length;
    },
    getBucketPosition : function (index) {
        var game = this.game,
            width = this.width,
            height = this.height,
            x,
            y;

        if (index <= 5) {
            // bottom 48wx36h
            x = 48 + (index * width);
            y = game.world.height - 100 - height;

        } else if (index <= 11) {
            x = 705 + ((index - 6) * width);
            y = game.world.height - 100 - height;
        } else if (index <= 17) {
            x = 705 - 88 + ((18 - index) * width);
            y = 4;
        } else if (index <= 23) {
            x = 48 + ((23 - index) * width);
            y = 4;
        }

        return {
            x : x,
            y : y
        }
    },
    getCreatePosition : function () {
        if (this.index <= 11) {
            return {
                x : this.x + 10,
                y : (this.y + this.height) - (this.count * 64)
            };
        } else if (this.index <= 23) {
            return {
                x : this.x + 10,
                y : (this.y) + 32 + (this.count * 64)
            };
        }

    }

};

Backgammon.Checker = {
    game   : undefined,
    color  : undefined,
    bucket : undefined,
    init   : function (game, color, bucket) {
        var me = this;
        me.game = game;
        me.color = color;
        me.bucket = bucket;
    },
    create : function () {
        var bucket = this.bucket,
            createPosition = bucket.getCreatePosition();

        this.game.add.sprite(createPosition.x, createPosition.y, this.color + '-checker');
        bucket.addChecker(this);
    },
    update : function () {

    }
};

Backgammon.init();
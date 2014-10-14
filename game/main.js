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
    buckets : undefined,
    preload : function () {
        var load = this.game.load;

        load.image('board-bg', 'resources/sprites/board-bg.jpg');
        load.image('black-checker', 'resources/sprites/black-checker.png');
        load.image('white-checker', 'resources/sprites/white-checker.png');
    },
    create  : function () {
        var game = this.game,
            buckets = [],
            bucket,
            i;

        game.add.sprite(0, 0, 'board-bg');

        for(i = 0; i < 24; i++) {
            bucket = Object.create(Backgammon.Bucket);
            bucket.init(game, i);
            buckets.push(bucket);
        }

        this.addCheckers(buckets[0], 'black', 5);
        this.addCheckers(buckets[4], 'white', 3);
        this.addCheckers(buckets[6], 'white', 5);
        this.addCheckers(buckets[11], 'black', 2);
        this.addCheckers(buckets[12], 'white', 2);
        this.addCheckers(buckets[17], 'black', 5);
        this.addCheckers(buckets[19], 'black', 3);
        this.addCheckers(buckets[23], 'white', 5);

    },
    addCheckers : function (bucket, color, count) {
        var checker,
            i;

        for(i = 0; i < count; i++) {
            checker = Object.create(Backgammon.Checker);
            checker.init(this.game, color, bucket);
            checker.create();
        }

    },
    update  : function () {

    }

};

// 87x285
Backgammon.Bucket = {
    game     : undefined,
    index    : undefined,
    checkers : undefined,
    count    : undefined,
    color    : undefined,
    x        : undefined,
    y        : undefined,
    width    : undefined,
    height   : undefined,
    init     : function (game, index) {
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
    addChecker : function (checker) {
        this.checkers.push(checker);
        this.count = this.checkers.length;
    },
    removeChecker : function () {
        this.checkers.pop();
        this.count = this.checkers.length;
    },
    getBucketPosition : function (index) {
        var game = this.game,
            width = this.width,
            height = this.height,
            x,
            y;

        if(index <= 5) {
            // bottom 48wx36h
            x = 48 + (index * width);
            y = game.world.height - 100 - height;

        } else if(index <= 11) {
            x = 705 + ((index - 6) * width);
            y = game.world.height - 100 - height;
        } else if(index <= 17) {
            x = 705 - 88 + ((18-index) * width);
            y = 4;
        } else if(index <= 23) {
            x = 48 + ((23 - index)* width);
            y = 4;
        }

        return {
            x : x,
            y : y
        }
    },
    getCreatePosition : function () {
        if(this.index <= 11) {
            return {
                x : this.x + 10,
                y : (this.y + this.height) - (this.count * 64)
            };
        } else if(this.index <=23) {
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

        this.game.add.sprite(createPosition.x, createPosition.y, this.color+'-checker');
        bucket.addChecker(this);
    },
    update : function () {

    }
};

Backgammon.init();
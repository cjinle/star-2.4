cc.Class({
    extends: cc.Component,

    properties: {
        starPrefab: {
            default: null,
            type: cc.Prefab
        },

        maxStarDuration: 0,
        minStarDuration: 0,

        ground: {
            default: null,
            type: cc.Node
        },

        player: {
            default: null,
            type: cc.Node
        },

        scoreDisplay: {
            default: null,
            type: cc.Label
        },

        scoreAudio: {
            default: null,
            type: cc.AudioClip
        },

        _groundY: 0,
        _timer: 0,
        _score: 0,
        _starDuration: 0,
    },

    spawnNewStar() {
        const newStar = cc.instantiate(this.starPrefab);
        this.node.addChild(newStar);
        newStar.setPosition(this.getNewStarPosition());
        newStar.getComponent('Star').game = this;
        this._starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this._timer = 0;
    },

    getNewStarPosition() {
        const randY = this._groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;
        const maxX = this.node.width / 2;
        const randX = (Math.random() - 0.5) * 2 * maxX;
        return cc.v2(randX, randY);
    },

    gainScore() {
        this._score += 1;
        this.scoreDisplay.string = `Score: ${this._score}`;
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    gameOver() {
        this.player.stopAllActions();
        cc.director.loadScene('game');
    },

    onLoad () {
        this._groundY = this.ground.y + this.ground.height / 2;
        this.spawnNewStar();    
    },

    update (dt) {
        if (this._timer > this._starDuration) {
            this.gameOver();
            this.enabled = false;
            return;
        }
        this._timer += dt;
    },
});

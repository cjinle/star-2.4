cc.Class({
    extends: cc.Component,

    properties: {
        jumpHeight: 0,
        jumpDuration: 0,
        maxMoveSpeed: 0,
        accel: 0,

        jumpAudio: {
            default: null,
            type: cc.AudioClip
        },

        _accLeft: false,
        _accRight: false,
        _xSpeed: 0,
        _maxX: 0,
    },

    runJumpAction() {
        const jumpUp = cc.tween().by(this.jumpDuration, { y: this.jumpHeight }, { easing: 'sineOut' });
        const jumpDown = cc.tween().by(this.jumpDuration, { y: -this.jumpHeight }, { easing: 'sineIn' });
        const tween = cc.tween().sequence(jumpUp, jumpDown).call(this.playJumpSound, this);
        return cc.tween().repeatForever(tween);
    },

    playJumpSound() {
        cc.audioEngine.playEffect(this.jumpAudio, false);
    },

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this._accLeft = true;
                break;
            case cc.macro.KEY.d:
                this._accRight = true;
                break;
        }
        // cc.log('key down', event.keyCode);
    },

    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this._accLeft = false;
                break;
            case cc.macro.KEY.d:
                this._accRight = false;
                break;
        }
        // cc.log('key up', event.keyCode);
    },

    onLoad() {
        const jumpAction = this.runJumpAction();
        cc.tween(this.node).then(jumpAction).start();

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        const viewSize = cc.view.getVisibleSize();
        this._maxX = viewSize.width / 2;
        // cc.log(viewSize);
    },

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    update(dt) {
        if (this._accLeft) {
            this._xSpeed -= this.accel * dt;
        } else if (this._accRight) {
            this._xSpeed += this.accel * dt;
        }

        if (Math.abs(this._xSpeed) > this.maxMoveSpeed) {
            this._xSpeed = this.maxMoveSpeed * this._xSpeed / Math.abs(this._xSpeed);
        }

        this.node.x += this._xSpeed * dt;
        const offset = Math.abs(this.node.x) - this._maxX;
        if (offset > 0) {
            if (this.node.x > 0) {
                this.node.x = -this._maxX + offset;
            } else {
                this.node.x = this._maxX - offset;
            }
        }
    },
});

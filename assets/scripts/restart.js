cc.Class({
  extends: cc.Component,

  properties: {
    menuAudio: {
      default: null,
      type: cc.AudioClip
    },
  },

  update() {
    this.node.on('touchend', this.on_touch_ended, this);
  },

  on_touch_ended() {
    // 播放音效
    cc.audioEngine.playEffect(this.menuAudio, false);
    cc.tween(this.node).
    to(.2, {
      scale: 1.2
    }, {
      easing: 'quadIn'
    }).
    to(.2, {
      scale: 1
    }, {
      easing: 'quadIn'
    }).
    call(() => {
      cc.director.loadScene("game");
    }).start()

  },
});

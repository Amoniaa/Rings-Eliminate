cc.Class({
  extends: cc.Component,

  properties: {
    menuAudio: {
      default: null,
      type: cc.AudioClip
    }
  },

  onLoad() {
    this.node.on('touchend', this.on_touch_ended, this);
  },

  on_touch_ended() {
    // 播放音效
    cc.audioEngine.playEffect(this.menuAudio, false);
    
    // console.log(this.node)
    cc.tween(this.node).
    to(.2, {
      scale: 1.4
    }, {
      easing: 'quadIn'
    }).
    to(.2, {
      scale: 1.2
    }, {
      easing: 'quadIn'
    }).
    call(() => {
      cc.director.loadScene("game");
    }).start()

  },
});

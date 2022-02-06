// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const INSIDERADIES = 120;
const BESIDERADIES = 260;
const OUTSIDERADIES = 405;

var global = require('global');

cc.Class({
  extends: cc.Component,

  properties: {
    scoreAudio: {
      default: null,
      type: cc.AudioClip
    },
    rotateAudio: {
      default: null,
      type: cc.AudioClip
    },
    placeAudio: {
      default: null,
      type: cc.AudioClip
    },
    mask: {
      default: null,
      type: cc.Node
    },
    gameover: {
      default: null,
      type: cc.Node
    },
    blocks: {
      default: null,
      type: cc.Node
    },
    outside: {
      default: null,
      type: cc.Node
    },
    beside: {
      default: null,
      type: cc.Node
    },
    inside: {
      default: null,
      type: cc.Node
    },
    scoreDisplay: {
      default: null,
      type: cc.Label
    },
    rotateGridsS: {
      default: null,
      type: cc.Label
    },
    rotateGridsM: {
      default: null,
      type: cc.Label
    },
    rotateGridsL: {
      default: null,
      type: cc.Label
    },
    smallBlockPre: {
      default: null,
      type: cc.Prefab
    },
    middleBlockPre: {
      default: null,
      type: cc.Prefab
    },
    largeBlockPre: {
      default: null,
      type: cc.Prefab
    },
    highest: {
      default: null,
      type: cc.Label
    },
  },

  onLoad: function () {
    global.count = 0
    global.score = 0

    global.outsidepoints = []
    global.besidepoints = []
    global.insidepoints = []

    // 用于记录圆环中已经存在的块的位置
    global.outsideblocks = []
    global.besideblocks = []
    global.insideblocks = []

    this.outside.angle = 0
    this.beside.angle = 0
    this.inside.angle = 0
    console.log(this.inside)

    // 生成三个颜色块
    this.spawnBlock();
    // 生成三个圆环
    for (let i = 0; i < 8; i++) {
      this.spawnSmallBlockRing(i * 45);
      this.spawnMiddleBlockRing(i * 45);
      this.spawnLargeBlockRing(i * 45);
    }
    // 全局变量初始化
    console.log(global.count)

    // cc.sys.localStorage.removeItem("rank")
    let rank = cc.sys.localStorage.getItem("rank")
    if (rank != null && rank != '') {
      this.highest.string = rank;
      global.highscore = parseInt(rank);
    } else {
      this.highest.string = '0';
    }
  },

  spawnBlock() {
    this.spawnSmallBlock();
    this.spawnMiddleBlock();
    this.spawnLargeBlock();
  },

  deleteBlock() {
    // let _this = this
    // outsideblocks数组元素
    let outblock = 0
    // besideblocks数组元素
    let beblock = 0
    // insideblocks数组元素
    let inblock = 0

    // 将被删除的数组元素
    let tobedeleteout = []
    let tobedeletebe = []
    let tobedeletein = []

    // this.showInfo()
    // 将被删除的节点
    let tobedeletenode = []
    // a,b,c为块数组中真实位置
    for (let a = 0; a < global.outsideblocks.length; a++) {
      let outblock = global.outsideblocks[a]
      for (let b = 0; b < global.besideblocks.length; b++) {
        let beblock = global.besideblocks[b]
        for (let c = 0; c < global.insideblocks.length; c++) {
          let inblock = global.insideblocks[c]

          if (outblock.index == beblock.index && beblock.index == inblock.index
            && outblock.color == beblock.color && beblock.color == inblock.color) {
            //记录将被删除的节点
            tobedeletenode[tobedeletenode.length] = outblock.blockitem;
            tobedeletenode[tobedeletenode.length] = beblock.blockitem;
            tobedeletenode[tobedeletenode.length] = inblock.blockitem;
            //记录将被删除的数组元素
            tobedeleteout[tobedeleteout.length] = outblock
            tobedeletebe[tobedeletebe.length] = beblock
            tobedeletein[tobedeletein.length] = inblock
            //得分
            global.score += 10
            this.scoreDisplay.string = global.score
            console.log(global.score)
            console.log(global.highscore)
            if (global.score > global.highscore) {
              console.log('rank' + global.score)
              this.highest.string = global.score
              cc.sys.localStorage.setItem("rank", global.score)
              global.highscore = global.score
            }
            // console.log(this.scoreDisplay)
            // this.myTween4(this.scoreDisplay)
          }
        }
      }
    }
    // console.log('len' + tobedeletenode.length)
    if (tobedeletenode.length != 0) {
      // 删除在outsideblocks,besideblocks,insideblocks三个数组中的索引
      tobedeleteout.forEach((outblock) => {
        global.outsideblocks.splice(global.outsideblocks.indexOf(outblock), 1);
      })
      tobedeletebe.forEach((beblock) => {
        global.besideblocks.splice(global.besideblocks.indexOf(beblock), 1);
      })
      tobedeletein.forEach((inblock) => {
        global.insideblocks.splice(global.insideblocks.indexOf(inblock), 1);
      })
      // this.showInfo()
      // 删除数组中块的索引
      let index = 0
      for (let i = 0; i < tobedeletenode.length; i++) {
        //console.log(tobedeletenode[i].node)
        //console.log(i + 'array')
        //块删除
        cc.tween(tobedeletenode[i].node).
          to(.1, {
            scale: 1.2
          }, {
            easing: 'quadIn'
          }).
          to(.2, {
            scale: 0
          }, {
            easing: 'quadIn'
          }).
          call(() => {
            console.log(index + 'tobedetete')
            tobedeletenode[index++].node.destroy()
          }).start()
      }
      // 播放音效
      cc.audioEngine.playEffect(this.scoreAudio, false);
    }
    else {
      if (global.outsideblocks.length == 8 && global.besideblocks.length == 8 && global.insideblocks.length == 8) {
        // this.scoreDisplay.string = 'GAME OVER(' + global.score + ')'
        this.myTween5(this.mask)
        this.myTween3(this.gameover)
      }
    }
  },

  // 打印数组
  showInfo() {
    // let str1, str2, str3;
    // str1 = 'delete out: '
    // str2 = 'delete be: '
    // str3 = 'delete in: '
    // tobedeleteout.forEach((a1) => {
    //   str1 += a1 + ' '
    // })
    // console.log(str1)
    // tobedeletebe.forEach((b1) => {
    //   str2 += b1 + ' '
    // })
    // console.log(str2)
    // tobedeletein.forEach((c1) => {
    //   str3 += c1 + ' '
    // })
    // console.log(str3)
    // console.log(typeof global.besideblocks[0])
    // console.log(global.besideblocks[0])
    let str1, str2, str3;
    str1 = 'out: '
    str2 = 'be: '
    str3 = 'in: '
    global.outsideblocks.forEach((outblock, index) => {
      str1 += outblock.index + ' '
    })
    console.log(str1)
    global.besideblocks.forEach((beblock, index) => {
      str2 += beblock.index + ' '
    })
    console.log(str2)
    global.insideblocks.forEach((inblock, index) => {
      str3 += inblock.index + ' '
    })
    console.log(str3)
  },

  //生成圆盘
  spawnSmallBlockRing: function (angle) {
    let arcangle = angle * Math.PI / 180
    var newSmallBlock = cc.instantiate(this.smallBlockPre);
    newSmallBlock.rotation = -angle
    arcangle += 22.5 * Math.PI / 180

    let x = newSmallBlock.x = INSIDERADIES * Math.sin(arcangle);
    let y = newSmallBlock.y = -INSIDERADIES * Math.cos(arcangle);
    newSmallBlock.x = x
    newSmallBlock.y = y
    let point = {
      x: x,
      y: y,
      a: angle
    }
    global.insidepoints.push(point)

    newSmallBlock.color = cc.color(0, 0, 0);
    newSmallBlock.opacity = 128
    newSmallBlock.blocktype = 'inside';
    this.inside.addChild(newSmallBlock);
    this.myTween2(newSmallBlock)
  },

  spawnMiddleBlockRing: function (angle) {
    let arcangle = angle * Math.PI / 180
    var newMiddleBlock = cc.instantiate(this.middleBlockPre);
    newMiddleBlock.rotation = -angle
    arcangle += 22.5 * Math.PI / 180
    let x = newMiddleBlock.x = BESIDERADIES * Math.sin(arcangle);
    let y = newMiddleBlock.y = -BESIDERADIES * Math.cos(arcangle);

    newMiddleBlock.x = x
    newMiddleBlock.y = y
    let point = {
      x: x,
      y: y,
      a: angle
    }
    global.besidepoints.push(point)

    newMiddleBlock.color = cc.color(0, 0, 0);
    newMiddleBlock.opacity = 128
    newMiddleBlock.blocktype = 'beside';
    this.beside.addChild(newMiddleBlock);
    this.myTween2(newMiddleBlock)
  },

  spawnLargeBlockRing: function (angle) {
    let arcangle = angle * Math.PI / 180
    var newLargeBlock = cc.instantiate(this.largeBlockPre);
    newLargeBlock.rotation = -angle
    arcangle += 22.5 * Math.PI / 180

    let x = OUTSIDERADIES * Math.sin(arcangle);
    let y = -OUTSIDERADIES * Math.cos(arcangle);
    newLargeBlock.x = x
    newLargeBlock.y = y
    let point = {
      x: x,
      y: y,
      a: angle
    }
    global.outsidepoints.push(point)

    newLargeBlock.color = cc.color(0, 0, 0);
    newLargeBlock.opacity = 128
    newLargeBlock.blocktype = 'outside';
    this.outside.addChild(newLargeBlock);
    this.myTween2(newLargeBlock)
  },

  //随机生成三个块
  spawnSmallBlock() {
    var newSmallBlock = cc.instantiate(this.smallBlockPre);
    this.blocks.addChild(newSmallBlock);
    newSmallBlock.setPosition(370, -735);
    newSmallBlock.color = this.getRandomColor();
    newSmallBlock.blocktype = 'small'
    this.rotateGridsS.string = this.getRandomRotatingGrids();
    newSmallBlock.getComponent('smallBlock').game = this;
    this.myTween(newSmallBlock)
  },
  spawnMiddleBlock() {
    var newMiddleBlock = cc.instantiate(this.middleBlockPre);
    this.blocks.addChild(newMiddleBlock);
    newMiddleBlock.setPosition(85, -730);
    newMiddleBlock.color = this.getRandomColor();
    newMiddleBlock.blocktype = 'middle';
    this.rotateGridsM.string = this.getRandomRotatingGrids()
    newMiddleBlock.getComponent('middleBlock').game = this;
    this.myTween(newMiddleBlock)
  },
  spawnLargeBlock() {
    var newLargeBlock = cc.instantiate(this.largeBlockPre);
    this.blocks.addChild(newLargeBlock);
    newLargeBlock.setPosition(-270, -725);
    newLargeBlock.color = this.getRandomColor();
    newLargeBlock.blocktype = 'large';
    this.rotateGridsL.string = this.getRandomRotatingGrids()
    newLargeBlock.getComponent('largeBlock').game = this;
    this.myTween(newLargeBlock)
    console.log("this")
    console.log(this.rotateGrids)
  },
  // 随机生成颜色值
  getRandomColor: function () {
    var color = '';
    var colorNum = Math.floor(Math.random() * 30 % 3);
    if (colorNum == 0) {
      color = cc.color(255, 0, 255);
    } else if (colorNum == 1) {
      color = cc.color(255, 240, 0);
    } else if (colorNum == 2) {
      color = cc.color(0, 220, 255);
    }
    // color = cc.color(0, 220, 255);
    return color;
  },
  // 随机生成旋转的格数
  getRandomRotatingGrids() {
    var rotatingGrids = 0;
    while (rotatingGrids == 0)
      rotatingGrids = Math.floor(Math.random() * 70 % 7) - 3;
    // rotatingGrids = 2;
    return rotatingGrids;
  },
  start() {

  },

  onDestroy() {
    global.Lchangeposition = 0
    global.Lchangeangle = 0
    global.Mchangeposition = 0
    global.Mchangeangle = 0
    global.Schangeposition = 0
    global.Schangeangle = 0
  },
  
  myTween: function(node) {
    cc.tween(node).
    // to(.1, {
    //   scale: 0
    // }, {
    //   easing: 'quadIn'
    // }).
    to(.2, {
      scale: 1.15
    }, {
      easing: 'quadIn'
    }).
    to(.2, {
      scale: 1
    }, {
      easing: 'quadIn'
    }).
    call(() => {
    }).start()
  },
  
  myTween2: function(node) {
    cc.tween(node).
    to(.2, {
      scale: .9
    }, {
      easing: 'quadIn'
    }).
    to(.2, {
      scale: 1
    }, {
      easing: 'quadIn'
    }).
    call(() => {
    }).start()
  },
  
  myTween3: function(node) {
    cc.tween(node).
    to(.2, {
      scale: 0
    }, {
      easing: 'quadIn'
    }).
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
    }).start()
  },
  
  myTween4: function(node) {
    cc.tween(node).
    to(.2, {
      scale: 1
    }, {
      easing: 'quadIn'
    }).
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
    }).start()
  },
  
  myTween5: function(node) {
    cc.tween(node).
    to(.2, {
      opacity: 0
    }, {
      easing: 'quadIn'
    }).
    to(.2, {
      opacity: 127
    }, {
      easing: 'quadIn'
    }).
    call(() => {
    }).start()
  }
});

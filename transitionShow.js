/*
  该类是使用复原的想法对元素进行过渡处理
  使用者可以自己对元素设置初始样式，该类会在直接将元素将相反动作处理
  然后使用过渡动画回到使用者最初设置的元素
*/
export default class TransitionAction {
  // ele              操控的元素
  // moveAction      过渡动作
  // transitionData  过渡时间，速率，延时
  // recovery        是否需要反复出现过渡动画
  constructor(option =　{}) {
    this.paramsCheck(option)
    // 保存元素transform的初始样式
    let {
      transform,
      opacity
    } = getComputedStyle(this.ele, null)
    this.originalTransform = {
      transform,
      opacity
    }
    
    // 设置过渡时间
    this.setTransition(this.transitionData)
    // 设置过渡动画
    this.setTransform(this.moveAction)
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.setTransition(this.transitionData, true)
          this.setTransform(this.originalTransform, true)
        } else {
          if (this.recovery) {
            this.setTransition(this.transitionData)
            this.setTransform(this.moveAction)
          }
        }
      });
    });
    this.observer.observe(this.ele);
  }
  leftMove(distance) {
    this.transformStr += `translateX(${distance}px)`
  }
  rightMove(distance) {
    this.transformStr += `translateX(${-distance}px)`
  }
  topMove(distance) {
    this.transformStr += `translateY(${-distance}px)`
  }
  bottomMove(distance) {
    this.transformStr += `translateY(${distance}px)`
  }
  rotateChange(distance) {
    this.transformStr += `rotate(${distance}deg)`
  }
  scaleChange(distance) {
    this.transformStr += `scale(${distance})`
  }
  opacityChange(opacityNum) {
    this.ele.style.opacity = opacityNum
  }
  setTransform(moveAction, flag) {
    if (flag) {
      Object.keys(moveAction).forEach(item => {
        this.ele.style[item] = moveAction[item]
      })
    } else {
      this.transformStr = ''
      Object.keys(moveAction).forEach(item => {
        this[item] &&　this[item](moveAction[item])
      })
      this.ele.style.transform = this.transformStr
    }
    // 手动回流
    this.ele.offsetTop
  }
  // 设置过渡 flag为true表示元素出现在页面上，false则表示在页面消失
  setTransition(transitionData, flag) {
    if (flag) {
      let {duration, timingFunction, delay} = transitionData
      this.ele.style.transition = `all ${duration} ${timingFunction} ${delay}`
    } else {
      this.ele.style.transition = `none`
    }
  }
  paramsCheck(params) {
    console.log(params, 'params');
    if (!params || Object.prototype.toString.call(params) !== '[object Object]') {
      throw new Error('请传入配置对象！')
    }
    const maps = [{
        attr: 'ele',
        attrType: 'String',
        hasParams: false,
        hasDefault: false
      },
      {
        attr: 'moveAction',
        attrType: 'Object',
        defaultVal: {},
        hasParams: false,
        hasDefault: true
      },
      {
        attr: 'transitionData',
        attrType: 'Object',
        defaultVal: {duration: '1s', timingFunction: 'linear', delay: '.2s'},
        hasParams: false,
        hasDefault: true
      },
      {
        attr: 'recovery',
        attrType: 'Boolean',
        defaultVal: false,
        hasParams: false,
        hasDefault: true
      },
    ]
    maps.forEach((item) => {
      let paramsKeyArr = Object.keys(params)
      if (!paramsKeyArr.includes(item.attr)) {
        if (!item.hasDefault) {
          throw new Error(`配置对象缺少${item.attr}值`)
        }else {
          this[item.attr] = item.defaultVal
        }
      } else {
        let value = params[item.attr]
        if (Object.prototype.toString.call(value) !== `[object ${item.attrType}]`) {
          throw new Error(`${item.attr}值类型应为${item.attrType}，现在为${Object.prototype.toString.call(value)}`)
        }else {
          if(item.attr === 'ele') {
            this[item.attr] = document.querySelector(params[item.attr])
          }else {
            this[item.attr] = params[item.attr]
          }
        }
      }
    })
  }

}
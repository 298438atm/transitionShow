import TransitionAction from './transitionShow.js'
new TransitionAction({
  ele: '.demo',
  //过渡动画，(可组合使用)
  //leftMove  左平移
  //rightMove  右平移
  //topMove  上平移
  //bottomMove  下平移
  //rotateChange  旋转
  //scaleChange  缩放
  //opacityChange  透明度
  moveAction: {leftMove: 1000, opacityChange: .3},
  // 过渡时间设置
  // duration  时长
  // timingFunction 速率
  // delay  延时时间
	transitionData: {duration: '2s', timingFunction: 'ease', delay: '.5s'},
  // 是否页面回滚的时候保留动画，默认动画只执行一次
	// recovery: true
})
let { config } = require('../config.js')(runtime, global)
let singletonRequire = require('../lib/SingletonRequirer.js')(runtime, global)
let FloatyInstance = singletonRequire('FloatyUtil')
let widgetUtils = singletonRequire('WidgetUtils')
let automator = singletonRequire('Automator')
let commonFunctions = singletonRequire('CommonFunction')

function MainExecutor () {

  this.exec = function () {
    // 执行主要业务逻辑
    // 演示功能，主流程自行封装
    this.openDingDong()
    this.goToShoppingCart()
  }

  /**
   * 等待跳过按钮并点击
   */
  this.awaitAndSkip = function (checkingList) {
    checkingList = checkingList || ['\\s*允许\\s*', '\\s*跳过\\s*', '\\s*下次再说\\s*']
    checkingList.forEach(checkContent => {
      FloatyInstance.setFloatyText('准备查找是否存在' + checkContent)
      let skip = WidgetUtils.widgetGetOne(checkContent, 2000)
      if (skip !== null) {
        automator.clickCenter(skip)
        sleep(1000)
      }
    })
  }

  /**
   * 打开叮咚并校验是否存在广告等弹窗
   */
  this.openDingDong = function () {
    launch('com.yaya.zone')
    this.awaitAndSkip(['\\s*允许\\s*', '\\s*跳过\\s*', '\\s*下次再说\\s*', '\\s*取消\\s*'])
    FloatyInstance.setFloatyText('准备查找 是否存在弹窗广告')
    let closeButton = widgetUtils.widgetGetById('com.yaya.zone:id/iv_(close|cancel)', 2000)
    while (!!closeButton) {
      FloatyInstance.setFloatyInfo({
        x: closeButton.bounds().centerX(),
        y: closeButton.bounds().centerY()
      }, '找到了关闭按钮')
      sleep(500)
      FloatyInstance.setFloatyText('点击关闭')
      automator.clickCenter(closeButton)
      sleep(500)
      closeButton = widgetUtils.widgetGetById('com.yaya.zone:id/iv_(close|cancel)', 1000)
    }
  }
  /**
   * 进入购物车并结算
   * @returns 
   */
  this.goToShoppingCart = function () {
    FloatyInstance.setFloatyText('查找购物车按钮')
    let shoppingCart = widgetUtils.widgetGetById('com.yaya.zone:id/tv_tab_car', 2000)
    if (!shoppingCart) {
      shoppingCart = widgetUtils.widgetGetOne('购物车', 2000)
    }
    if (!shoppingCart) {
      FloatyInstance.setFloatyText('未找到购物车按钮')
      sleep(2000)
      errorInfo('未找到购物车按钮', true)
      return
    } else {
      FloatyInstance.setFloatyInfo({
        x: shoppingCart.bounds().centerX(),
        y: shoppingCart.bounds().centerY()
      }, '找到了购物车按钮')
      sleep(500)
      automator.clickCenter(shoppingCart)
    }
    sleep(1000)
    let submitButton = widgetUtils.widgetGetById('com.yaya.zone:id/btn_submit')
    if (submitButton) {
      FloatyInstance.setFloatyInfo({
        x: submitButton.bounds().centerX(),
        y: submitButton.bounds().centerY()
      }, '找到了结算按钮')
      sleep(500)
      automator.clickCenter(submitButton)
      sleep(1000)
      FloatyInstance.setFloatyInfo({
        x: submitButton.bounds().centerX(),
        y: submitButton.bounds().centerY()
      }, '等待立即支付按钮')
      let paymentSubmit = widgetUtils.widgetGetById('com.yaya.zone:id/tv_submit')
      if (paymentSubmit) {
        FloatyInstance.setFloatyInfo({
          x: paymentSubmit.bounds().centerX(),
          y: paymentSubmit.bounds().centerY()
        }, '找到了立即支付按钮')
        sleep(500)
        automator.clickCenter(paymentSubmit)
        FloatyInstance.setFloatyText('请手动支付')
      } else {
        FloatyInstance.setFloatyText('未找到立即支付按钮')
        sleep(2000)
      }
    } else {
      FloatyInstance.setFloatyText('未找到结算按钮')
      sleep(2000)
    }
  }
}
module.exports = new MainExecutor()
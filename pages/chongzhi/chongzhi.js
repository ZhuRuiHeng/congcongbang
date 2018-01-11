//index.js
var common = require('../../common.js');
var sign = wx.getStorageSync('sign');
var app = getApp();
var Zan = require('../../dist/index');
Page(Object.assign({}, Zan.Toast, {
  data: {
    zindex:false //弹窗
  },
  onShow: function () {
    var sign = wx.getStorageSync('sign');
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    wx.request({
      url: app.data.apiUrl2 + "/bargain/my-wallet?sign=" + sign,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        let status = res.data.status;
        if (status == 1) {
          console.log("余额", res.data.data);
          that.setData({
            allMoney: res.data.data
          })
        } else {
          tips.alert(res.data.msg);
        }
        wx.hideLoading()
      }
    })
  },
  zindex(){
    this.setData({
      zindex:true
    })
  },
  //充值
  recharge(e){
    console.log(e);
    let form_id = e.detail.formId;
    let that = this;
    if (!that.data.money || that.data.money =='money:undefined'){
      that.showZanToast('请输入充值金额');
      return
    }
    wx.request({
      url: app.data.apiUrl2 + "/bargain/recharge?sign=" + wx.getStorageSync('sign'),
      data:{
        money: that.data.money
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        let status = res.data.status;
        console.log(res);
        console.log(status);
        if (status==1){
          // 调用支付
          wx.requestPayment({
            timeStamp: res.data.data.data.timeStamp,
            nonceStr: res.data.data.data.nonceStr,
            package: res.data.data.data.package,
            signType: res.data.data.data.signType,
            paySign: res.data.data.data.paySign,
            success: function (res) {
              console.log('充值成功：',res);
              wx.showLoading({
                title: '加载中',
              })
              wx.request({
                url: app.data.apiUrl2 + "/bargain/my-wallet?sign=" + wx.getStorageSync('sign'),
                header: {
                  'content-type': 'application/json'
                },
                method: "GET",
                success: function (res) {
                  let status = res.data.status;
                  if (status == 1) {
                    that.setData({
                      allMoney: res.data.data
                    })
                    // 保存formid
                    wx.request({
                      url: app.data.apiUrl + "/api/save-form?sign=" + wx.getStorageSync('sign'),
                      data: {
                        form_id: form_id
                      },
                      header: {
                        'content-type': 'application/json'
                      },
                      method: "GET",
                      success: function (res) {
                        console.log('保存formid成功');
                      }
                    })
                    that.showZanToast('充值成功！');
                  } else {
                    that.showZanToast(res.data.msg);
                  }
                  wx.hideLoading()
                }
              })
            },
            fail: function (res) {
              that.showZanToast('充值失败！');
            }
          })
          that.setData({
            zindex: false
          })
        }else{
          that.showZanToast(res.data.msg);
        }
        wx.hideLoading()
      }
    })
  },
  // 关闭
  close(){
    this.setData({
      zindex:false
    })
  },
  //金额
  bindKeyInput: function (e) {
    this.setData({
      money: e.detail.value
    })
  },
}))
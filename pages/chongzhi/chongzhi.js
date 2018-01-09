//index.js
var common = require('../../common.js');
var sign = wx.getStorageSync('sign');
var app = getApp();
var Zan = require('../../dist/index');
Page(Object.assign({}, Zan.Toast, {
  data: {
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
            money: res.data.data
          })
        } else {
          tips.alert(res.data.msg);
        }
        wx.hideLoading()
      }
    })
  },
  //充值
  recharge(){
    let that = this;
    wx.request({
      url: app.data.apiUrl2 + "/bargain/recharge?sign=" + wx.getStorageSync('sign'),
      data:{
        money:10
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        let status = res.data.status;
        if (status==1){
          that.showZanToast('');
        }else{
          that.showZanToast(res.data.msg);
        }
        wx.hideLoading()
      }
    })
  },
  //提现cash
  cash(){
    let that = this;
    that.showZanToast('暂未开通！');
  }
}))
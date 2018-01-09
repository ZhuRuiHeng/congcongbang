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
  }
}))
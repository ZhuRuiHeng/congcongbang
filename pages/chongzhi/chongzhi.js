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
    console.log('app.data.kid', app.data.kid);
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    wx.hideLoading()
  }
}))
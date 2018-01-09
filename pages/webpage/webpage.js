var common = require('../../common.js');
var app = getApp();
Page({
  data: {
  
  },
  onLoad: function (options) {
    console.log(options);
      this.setData({
        url: options.url
      })
  },
  onShow: function () {
  
  }
})
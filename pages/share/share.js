// pages/share/share.js
var common = require('../../common.js');
var app = getApp();
var sign = wx.getStorageSync('sign');
var Zan = require('../../dist/index');
Page(Object.assign({}, Zan.Toast, {


  /**
   * 页面的初始数据
   */
  data: {
    gid :''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var gid = options.gid;//列表页传来的id
    console.log("gidqqqqq", gid);
    that.setData({
      gid: gid,
    });
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      
  },
  //海报
  haibao: function () {
    console.log(11)
    var that = this;
    wx.navigateTo({
      url: "../poster/poster?gid=" + that.data.gid
    })
  },
  zhuangfa:function(){
    var that = this;
    that.showZanToast('请返回商品页进行转发!');
  }

 

}))
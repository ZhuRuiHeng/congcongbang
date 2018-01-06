// pages/mingxi/mingxi.js
var sign = wx.getStorageSync('sign');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    var sign = wx.getStorageSync('sign');
     var that = this;
      wx.request({
        url: app.data.apiUrl+"/api/commission-list?sign=" + sign,
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log('res:',res)
          var commissionList = res.data.data.commissionList;
          that.setData({
            commissionList: commissionList,
            avatarurl : res.data.data.commissionList.avatarurl,
                 name : res.data.data.commissionList.wx_name
          })
          wx.hideLoading()
        }
      })
  }

})
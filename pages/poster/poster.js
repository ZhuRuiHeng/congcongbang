// pages/sharePoster/sharePoster.js
var common = require('../../common.js');
var app = getApp();
var sign = wx.getStorageSync('sign');
Page({

  // 页面的初始数据
  data: {
    url: ''
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;
    var gid = options.gid;//列表页传来的id
    console.log("gidqqqqq", gid);
    that.setData({
      gid: gid,
    });
  },


  // 预览海报
  prewImg: function () {
    var that = this;
    wx.previewImage({
      current: ''+that.data.url+'', // 当前显示图片的http链接
      urls: [''+that.data.url+''] // 需要预览的图片http链接列表
    })
  },

  // 海报下载
  downLoad: function () {
    var that = this;
    console.log(that.data.url);
    wx.downloadFile({
      url: ''+that.data.url+'', //仅为示例，并非真实的资源
      success: function (res) {
        console.log(res);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            //console.log(res);
            wx.showToast({
              title: '海报下载成功，请去相册查看',
              icon: 'success',
              duration: 800
            })
          }
        })
      },
      fail:function(err){
          console.log(err)             
      }
    })
  },
  

  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {

  },

  // 生命周期函数--监听页面显示
  onShow: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
      wx.request({
        url: app.data.apiUrl + "/api/create-poster?sign=" + wx.getStorageSync('sign') ,
        data: {
          gid: that.data.gid
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          // 此处清空全局的数据
          console.log("筛选2", res);
          var url = res.data.data.url;
          that.setData({
            url: url
          })
          wx.hideLoading()
        }
      })
  },

  // 返回首页
  backHome: function () {
    common.backHome();
  },

  // 分享海报
  toShare: function () {
    common.toShare();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var mid = wx.getStorageSync('mid');
    return {
      title: "海报",
      path: '/pages/poster/poster?mid=' + mid + '&gid=' + that.data.gid,
      success: function (res) {
        console.log(res);
        // 转发成功
      },
      fail: function (res) {
        console.log(res);
        // 转发失败
      }
    }
  }
})

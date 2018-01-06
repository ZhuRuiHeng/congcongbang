// pages/coupon/coupon.js
var app = getApp();
var sign = wx.getStorageSync('sign');
Page({
  data: {
  
  },
  onLoad: function (options) {
  
  },
  onShow: function () {
    var that = this;
    var sign = wx.getStorageSync("sign");
    wx.request({
      url: app.data.apiUrl+'/api/my-coupons?sign=' + sign,
      success:function(res){
        console.log("优惠券", res.data.data.myCoupons);
        if(res.data.status){
          var myCoupons = res.data.data.myCoupons;
          that.setData({
            myCoupons: myCoupons
          })
        }
      }
    })
  }
 
})
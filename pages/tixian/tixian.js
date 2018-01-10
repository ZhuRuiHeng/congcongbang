// pages/workList/workList.js
var app = getApp();
import tips from '../../utils/tips.js'
Page({
  data: {
    workList1: [
      {
        time: '2017-7-7',
        timeadd: '5%',
        status: '审核通过'
      },
      {
        time: '2017-8-7',
        timeadd: '8%',
        status: '审核中'
      },
      {
        time: '2017-9-7',
        timeadd: '12%',
        status: '审核中'
      },
    ]
  },
  onLoad: function (options) {

  },
  onShow: function () {
    let that = this;
    wx.request({
      url: app.data.apiUrl + '/bargain/pet-list?sign=' + wx.getStorageSync('sign') ,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("宠物任务金额列表", res);
        let status = res.data.status;
        if (status == 1) {
          that.setData({
            workList: res.data.data,
          })
        } else {
          tips.alert(res.data.msg);
          that.setData({
            workList: false
          })
        }

        wx.hideLoading()
      }
    });
  },
  goPay(e){
    wx.navigateTo({
      url: '../money/money?pet_id=' + e.currentTarget.dataset.pet_id
    })
  },
  itemTap(e){
    wx.navigateTo({
      url: '../chongzhi/chongzhi?pet_id=' + e.currentTarget.dataset.pet_id
    })
  }
})
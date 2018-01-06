// pages/workList/workList.js
var app = getApp();
import tips from '../../utils/tips.js'
Page({
  data: {
  },
  onLoad: function (options) {
  
  },
  onShow: function () {
    let that = this;
    wx.request({
      url: app.data.apiUrl + '/bargain/task-log?sign=' + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("任务提交记录", res);
        let status = res.data.status;
        if (status==1){
          //时间戳转化
          function toDate(number) {
            var n = number * 1000;
            var date = new Date(n);
            console.log("date", date)
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            h = h < 10 ? ('0' + h) : h;
            var minute = date.getMinutes();
            var second = date.getSeconds();
            minute = minute < 10 ? ('0' + minute) : minute;
            second = second < 10 ? ('0' + second) : second;
            return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
          }
          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i].add_time = toDate(res.data.data[i].add_time)
          }
          that.setData({
            workList: res.data.data,
          })
        }else{
          tips.alert(res.data.msg);
          that.setData({
            workList: false
          })
        }
        
        wx.hideLoading()
      }
    });
  },
})
// pages/pintuanxiangqing/pintuanxiangqing.js
var common = require('../../common.js');
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
    var sign = wx.getStorageSync('sign');
    console.log(options);
     console.log(options.mid);
     console.log(options.mid);
     var sharer_id = options.mid;
     wx.setStorageSync("sharer_id", sharer_id);
     console.log("sharer_id:", sharer_id);
    var that = this;
    var gbid = options.gbid;
    that.setData({
        _gbid: gbid,
        oid: options.gid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var nowTime = Date.parse(new Date());
    console.log('nowTime:', nowTime / 1000);
    this.setData({
      nowTime: nowTime / 1000
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    app.getAuth(function () {
        var midNew = wx.getStorageSync("mid");
        that.setData({
          midNew: midNew
        });
        console.log("midNew:", midNew);
        wx.request({
          url: app.data.apiUrl + "/api/group-detail?sign=" + wx.getStorageSync("sign") ,
          data: {
            gbid: that.data._gbid
          },
          header: {
            'content-type': 'application/json'
          },
          method: "GET",
          success: function (res) {
            console.log("拼团详情数据", res);
            // 此处清空全局的数据
            var groupDetail = "";
            var need_number = res.data.data.groupDetail.need_number;
            var arr = [];
            for(var i = 0;i<need_number;i++){
              arr.push("https://qncdn.playonwechat.com/shangcheng/bg.png") 
            };
            console.log("111111111111111", arr);

            that.setData({
              arr: arr,
              res: res,
              groupDetail: res.data.data.groupDetail,
              mid: res.data.data.groupDetail.mid
            })
            //倒计时
            var nowTime = (new Date()).getTime();
            var begin_time = res.data.data.groupDetail.group_expire;
            console.log(nowTime + 'sssssssss' + begin_time);
            var ge_nowTime = common.time(nowTime / 1000, 1);
            var be_gainTime = common.time(begin_time, 1);
            var Countdown = begin_time * 1000 - nowTime; //倒计时
            if (Countdown > 0) {
              function dateformat(micro_second) {
                // 秒数
                var second = Math.floor(micro_second / 1000);
                // 小时位
                var day = Math.floor(second / 86400);

                if (day < 10) {
                  day = '0' + day;
                }

                var hr = Math.floor((second - day * 86400) / 3600);
                // 分钟位
                if (hr < 10) {
                  hr = '0' + hr;
                }

                var min = Math.floor((second - hr * 3600 - day * 86400) / 60);
                if (min < 10) {
                  min = '0' + min;
                }
                // 秒位
                var sec = (second - hr * 3600 - min * 60 - day * 86400); // equal to => var sec = second % 60;
                // 毫秒位，保留2位
                if (sec < 10) {
                  sec = '0' + sec;
                }
                var micro_sec = Math.floor((micro_second % 1000) / 10);

                return day + ":" + hr + ":" + min + ":" + sec;
              }

              setInterval(function () {
                Countdown -= 1000;
                var time = dateformat(Countdown);
                var splitArr = time.split(":");
                // console.log(splitArr);
                var _Countdown = [{
                  day: splitArr[0],
                  hr: splitArr[1],
                  min: splitArr[2],
                  sec: splitArr[3],
                }];
                // console.log(_Countdown);
                that.setData({
                  countDown_tatic: true,
                  Countdown: _Countdown
                })
              }, 1000)

            } else {
              countDown_tatic: false
            }

            begin_time = common.time(begin_time, 1);
            console.log(begin_time);
            console.log(that.data.Countdown);


            wx.hideLoading()
          }
        })
    })
  },
  guize: function (e) {
    console.log(e);
    var url = getCurrentPages();
    console.log(url);
    wx.navigateTo({
      url: '../guize/guize'
    })
  },
   // url: '../shangpinInform/shangpinInform?oid='+order_id+'&status1='+status+'&gbid='+gbid
  chakan: function () {
    var that = this;
    var url = getCurrentPages();
    console.log(url);
    wx.navigateTo({
      url: '../shangpinInform/shangpinInform?oid='+that.data.oid
    })
  },
  //分享用户购买
  buy:function(){
    var that = this;
    wx.setStorageSync('groupDetail',that.data.groupDetail);
    wx.navigateTo({
      url: '../TdingdanInform/TdingdanInform?groupDetail=' + that.data.groupDetail + '&type=1'
    })
  },
  // 返回首页
  backHome: function () {
    common.backHome();
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
  onShareAppMessage: function () {
    var that = this;
    var mid = wx.getStorageSync("mid");
    return {
      title: '拼团详情',
      path: '/pages/pintuanxiangqing/pintuanxiangqing?mid=' + mid + '&gid=' + that.data.gid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }

})
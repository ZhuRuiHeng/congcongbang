var common = require('../../common.js');
var sign = wx.getStorageSync('sign');
var app = getApp();
///////////////
var Zan = require('../../dist/index');
Page(Object.assign({}, Zan.Toast, {
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    bargainList1:[
      {
        gid:"173",
        good_name:"精品宠物级蓝猫，蠢萌可爱性价比超高活动价，手慢无",
        is_alive:"1",
        on_shelf:"1",
        picture:"https://pet.zealcdn.cn/assets/images/goods/picture/271420171231125803.png",
        price:"2688.00",
        type:"6"
      }, {
        gid: "173",
        good_name: "精品宠物级蓝猫，蠢萌可爱性价比超高活动价，手慢无",
        is_alive: "1",
        on_shelf: "1",
        picture: "https://pet.zealcdn.cn/assets/images/goods/picture/271420171231125803.png",
        price: "2688.00",
        type: "6"
      }, {
        gid: "173",
        good_name: "精品宠物级蓝猫，蠢萌可爱性价比超高活动价，手慢无",
        is_alive: "1",
        on_shelf: "1",
        picture: "https://pet.zealcdn.cn/assets/images/goods/picture/271420171231125803.png",
        price: "2688.00",
        type: "6"
      }, {
        gid: "173",
        good_name: "精品宠物级蓝猫，蠢萌可爱性价比超高活动价，手慢无",
        is_alive: "1",
        on_shelf: "1",
        picture: "https://pet.zealcdn.cn/assets/images/goods/picture/271420171231125803.png",
        price: "2688.00",
        type: "6"
      }, {
        gid: "173",
        good_name: "精品宠物级蓝猫，蠢萌可爱性价比超高活动价，手慢无",
        is_alive: "1",
        on_shelf: "1",
        picture: "https://pet.zealcdn.cn/assets/images/goods/picture/271420171231125803.png",
        price: "2688.00",
        type: "6"
      }, {
        gid: "173",
        good_name: "精品宠物级蓝猫，蠢萌可爱性价比超高活动价，手慢无",
        is_alive: "1",
        on_shelf: "1",
        picture: "https://pet.zealcdn.cn/assets/images/goods/picture/271420171231125803.png",
        price: "2688.00",
        type: "6"
      }
    ]
  },
  onLoad: function (options) {
  
  },
  onShow: function () {
    let that = this;
    let sign = wx.getStorageSync('sign');
    wx.showLoading({
      title: '加载中',
    });
    // 团秒
    wx.request({
      url: app.data.apiUrl + '/api/carousel-goods?sign=' + sign,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("团秒", res);
        //倒计时
        var nowTime = (new Date()).getTime();
        var begin_time = res.data.data.nextSeckillTime;
        if (res.data.data.nextSeckillTime) {

        }
        // console.log(nowTime + 'sssssssss' + begin_time);
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
            //console.log(splitArr);
            var _Countdown = [{
              day: splitArr[0],
              hr: splitArr[1],
              min: splitArr[2],
              sec: splitArr[3],
            }];
            //console.log(_Countdown);
            that.setData({
              countDown_tatic: true,
              Countdown: _Countdown
            })
          }, 1000)
        } else {
          countDown_tatic: false
        }
        begin_time = common.time(begin_time, 1);
        var lunbo = [];
        // 获取用户名称及发表时间
        that.setData({
          lunbo: res.data.data.carouselGoods,
          fightGroups: res.data.data.fightGroups,
          seckills: res.data.data.seckills,
          currentSeckillTime: res.data.data.currentSeckillTime,
          nextSeckillTime: that.data.Countdown
        })
        wx.hideLoading()
      }
    });
    // 砍价
    wx.request({
      url: app.data.apiUrl + '/bargain/bargain-list?sign=' + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("砍价列表", res)
        // 获取用户名称及发表时间
        var goodsList = res.data.data.goodsList;
        that.setData({
          bargainList: goodsList
        })
        wx.hideLoading()
      }
    });
    // banner
    wx.request({
      url: app.data.apiUrl1 + "bargain/banner?sign=" + sign,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("砍价获取轮播图", res);
        let status = res.data.status;
        if (status == 1) {
          that.setData({
            banner: res.data.data
          })
        } else {
          console.log(res.data.msg);
        }
      }
    })
  },
  //轮播图点击跳转
  swipclick: function (e) {
    console.log(e);
    var url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: '../webpage/webpage?url=' + url
    })
  },
  //砍价
  receive(){
    wx.navigateTo({
      url: '../bargainList/bargainList'
    })
  },
  //砍价已结束
  receive1(){
    this.showZanToast('砍价已结束');
  }
}))
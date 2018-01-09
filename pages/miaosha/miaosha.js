// pages/pintuan/pintuan.js
var list = [], that, data, listadd, limit = 1;
var common = require('../../common.js');
var app = getApp();
var main_content = [];
var sign = wx.getStorageSync('sign');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search_word: [],
    limit: 1,
    results:[],
    nextSeckillTime:''
 },
  onLoad: function (options) {
    var sign = wx.getStorageSync('sign');
    console.log(options);
    this.setData({
      cate_id: options.gid
    })
  },
  onReady: function () {

  },
  onShow: function () {
    var sign = wx.getStorageSync('sign');
    var inter = '';
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    var that = this;
    // 列表
    wx.request({
      url: app.data.apiUrl+'/api/second-kill-list?sign=' + sign ,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("秒杀列表", res);
        var seckills = res.data.data.seckills;
        console.log('len:',seckills.length);
        var results = [];
        for (var i = 0; i < seckills.length;i++){
          results.push(Math.round(parseInt(seckills[i].sales_volume) / parseInt(seckills[i].stock) * 10000) / 100.00 + "%"); //小数点后两位百分比
        }
        console.log('results:',results);
        that.setData({
          main_content: res.data.data.seckills,
          description: res.data.data.description,
          nextSeckillTime: res.data.data.nextSeckillTime,
          results : results
        })
        //倒计时
        var nowTime = (new Date()).getTime();
        var begin_time = res.data.data.nextSeckillTime;
        console.log(nowTime + 'sssssssss' + begin_time);
        var ge_nowTime = common.time(nowTime / 1000, 1);
        var be_gainTime = common.time(begin_time, 1);
        var Countdown = begin_time * 1000 - nowTime; //倒计时
        console.log("Countdown:", Countdown);
        if (Countdown > 0) {
          function dateformat(micro_second) {
            //console.log('time');
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

      inter =  setInterval(function () {
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
              Countdown: _Countdown,
              inter: inter
            })
          }, 1000)

        } else {
          countDown_tatic: false
        }

        begin_time = common.time(begin_time, 1);
        console.log('Countdown:', that.data.Countdown);
        ////////////////////////////////////////////////
        wx.hideLoading()
      }
    });

  


    //导航https://shop.playonwechat.com/api/second-kill-times
    wx.request({
      url: app.data.apiUrl+'/api/second-kill-times?sign=' + sign ,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("导航列表", res);
        var search_word = res.data.data.time_intervals;
        var search_word1 = [];
        var search_word2 = [];
        var today = search_word.today;
        var tomorrow = search_word.tomorrow;
        var yesterday = search_word.yesterday;
        console.log("导航列表", search_word);
        var len = today.length + tomorrow.length + yesterday.length+2;
        var width = 130 * len;
        console.log("width", width);
        search_word1.push(search_word2);
        that.setData({
          time_intervals: res.data.data.time_intervals,
          search_word: search_word,
          w_width: width,
          len: len,
          today: today,
          tomorrow: tomorrow,
          yesterday: yesterday
        })
        wx.hideLoading()
      }
    });
},
// 点击切换
  tapKeyWorld: function (e) {
    var inter = this.data.inter;
    clearInterval(inter);
    var sign = wx.getStorageSync('sign');
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var star = e.currentTarget.dataset.star;
    var sta = e.currentTarget.dataset.sta;
    var today = that.data.today;
    var tomorrow = that.data.tomorrow;
    var yesterday = that.data.yesterday;
    var begin = e.currentTarget.dataset.begin;

    console.log("begin:", begin)
    that.setData({
      activity_begin: star,
      sta: sta,
      begin: begin
    })
    for (var i = 0; i < that.data.today.length;i++){
      that.data.today[i].active = false;
      if (star == that.data.today[i].activity_begin){
        that.data.today[i].active = true;
        // console.log("iiiiiiiiii:",i)
      }
    }
    for (var i = 0; i < that.data.tomorrow.length; i++) {
      that.data.tomorrow[i].active = false;
      if (star == that.data.tomorrow[i].activity_begin) {
        that.data.tomorrow[i].active = true;
        //console.log("iiiiiiiiii:", i)
      }
    }
    for (var i = 0; i < that.data.yesterday.length; i++) {
      that.data.yesterday[i].active = false;
      if (star == that.data.yesterday[i].activity_begin) {
        that.data.yesterday[i].active = true;
       // console.log("iiiiiiiiii:", i)
      }
    }
    // console.log(star);
    that.setData({
      today: today,
      tomorrow: tomorrow,
      yesterday: yesterday
    })
    // setTimeout(function () {
     wx.request({
        url: app.data.apiUrl+"/api/second-kill-list?sign=" + sign ,
        data: {
          activity_begin: that.data.activity_begin
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("切换", res);
          // 此处清空全局的数据
          var main_content = ""
          var begin_time = '';
          var nowTime ='';
          var seckills = res.data.data.seckills;
          console.log('len:', seckills.length);
          var results = [];
          for (var i = 0; i < seckills.length; i++) {
            results.push(Math.round(parseInt(seckills[i].sales_volume) / parseInt(seckills[i].stock) * 10000) / 100.00 + "%"); //小数点后两位百分比
          }
          that.setData({
            main_content: res.data.data.seckills,
            description: res.data.data.description,
            results: results,
          })
          //倒计时
          var nowTime = (new Date()).getTime();
          var begin_time = begin;
          console.log(nowTime + 'sssssssss' + begin_time);
          console.log(begin_time);
          var Countdown = begin_time * 1000 - nowTime; //倒计时
          var nextSeckillTime = that.data.nextSeckillTime;
          console.log("nextSeckillTime:",nextSeckillTime);
          if (Countdown<0){
            Countdown =  nextSeckillTime * 1000 - nowTime;
            //console.log(nextSeckillTime * 1000 - nowTime);
          }
          console.log("Countdown:", Countdown);
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

            inter = setInterval(function () {
              //console.log(inter);
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
              //console.log('_Countdown:',_Countdown);
              that.setData({
                countDown_tatic: true,
                Countdown: _Countdown,
                inter: inter
              })
            }, 1000)

          } else {
            countDown_tatic: false
          }

          // begin_time = common.time(begin_time, 1);
         // console.log('Countdown:', that.data.Countdown);
          wx.hideLoading()
        }
      })
    // }, 300)

  },
 
})
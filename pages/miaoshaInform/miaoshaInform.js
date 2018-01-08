// pages/inform/inform.js
var common = require('../../common.js');
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp();
var sign = wx.getStorageSync('sign');
var Zan = require('../../dist/index');
Page(Object.assign({}, Zan.Toast, {
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    addCar: false,//打开购物车
    addbuy: false,
    closeCar: false,//关闭购物车
    price: 1,//购物车数量
    minusStatus: 'disabled',//数量为1禁用
    sum: '',//购物车id
    _num: 1, //类型
    arr: [],
    attrLen: '',
    values: [], //型号
    shuxing: '',
    all: [],
    bar: false,
    daohang1: false,
    daohang: true,
    scrollTop: 0,
    floorstatus: false,
    is_membership: false
  },
  onLoad: function (options) {
    var sign = wx.getStorageSync('sign');
    console.log(options.mid);
    var sharer_id = options.mid;
    wx.setStorageSync("sharer_id", sharer_id);
    console.log("sharer_id:", sharer_id);
    var that = this;
    var gid = options.gid;//列表页传来的id
    console.log("options：", options);
    this.setData({
      gid: gid,
      sta: options.sta
    });
  },
  onShow: function (options) {

    var sign = wx.getStorageSync('sign');
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
    var that = this;
    app.getAuth(function () {
      var sign = wx.getStorageSync('sign');
      var gid = that.data.gid;//列表页传来的id
      wx.request({
        url: app.data.apiUrl+"/api/goods-detail?sign=" + sign ,
        data: {
          gid: gid
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("详情", res);
          var list = [];
          // 获取用户名称及发表时间
          var inform = res.data.data.goodsDetail;
          var picture = inform.picture;
          var informImg = inform.content;
          var is_membership = res.data.data.is_membership;
          that.setData({
            inform: inform,
            figure: inform.picture[0],
            high_group_price: inform.high_group_price,
            low_group_price: inform.low_group_price,
            informImg: informImg.toString(),
            imgUrls: picture,
            shuxing: inform.attribute,
            is_membership: is_membership,
            expenses: inform.expenses
          })
          if (that.data.informImg) {
            WxParse.wxParse('informImg', 'html', that.data.informImg, that, 5)
          }
          var shuxing = that.data.shuxing;
          var all = '';
          console.log('shuxing', that.data.shuxing);
          //倒计时
          var nowTime = (new Date()).getTime();
          var begin_time = res.data.data.goodsDetail.activity_expire;
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
              that.setData({
                countDown_tatic: true,
                Countdown: _Countdown
              })
            }, 1000)

          } else {
            countDown_tatic: false
          }

          begin_time = common.time(begin_time, 1);
          for (var i = 0; i < that.data.shuxing.length; i++) {
            var news = [];
            var all = that.data.all;
            news += shuxing[i].attribute_name + ' ';
            all.push(news); //将多个both对象pushgouwu数组
          }
          that.setData({
            all: all,
            activity_expire: that.data.Countdown
          })
          wx.hideLoading()
        }
      })
    })
  },
  // 导航
  daohang: function () {
    var that = this;
    that.setData({
      daohang1: true,
      daohang: false,
      bar: true
    })
    console.log('daohang');
  },
  guanbi: function () {
    var that = this;
    that.setData({
      daohang1: false,
      daohang: true,
      bar: false
    })
    console.log('guanbi');
  },
  backtop: function () {
    var that = this;
    console.log('backtop');
    that.setData({
      scrollTop: 0
    })
  },
  scroll: function (e) {
    // console.log(e.detail.scrollTop);
    if (e.detail.scrollTop > 500) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  //跳转购物车
  gouwuche: function () {
    wx.switchTab({
      url: '../car/car'
    })
  },
  //轮播图预览
  imgPreview: function () { //图片预览
    const imgs = this.data.imgUrls;
    console.log("const");
    wx.previewImage({
      current: imgs[this.data.currentIndex], // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
    })
  },
  //购物车
  addCar: function (e) {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
    var that = this;
    var gid = e.currentTarget.dataset.gid
    console.log("gid", gid);
    that.setData({
      gid: gid
    })
    wx.request({
      url: app.data.apiUrl + "/api/goods-detail?sign=" + wx.getStorageSync('sign') ,
      data: {
        gid: that.data.gid
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("详情", res);
        var list = [];
        // 获取用户名称及发表时间
        var inform = res.data.data.goodsDetail;
        //infoem.attribute
        that.setData({
          addCar: true,
          inform: inform
        })
        wx.hideLoading()
        console.log("inform详情", inform);
      }
    })
  },
  //购买
  addbuy: function (e) {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
    var that = this;
    var gid = e.currentTarget.dataset.gid
    console.log("gid", gid);
    that.setData({
      gid: gid
    })
    wx.request({
      url: app.data.apiUrl + "/api/goods-detail?sign=" + wx.getStorageSync('sign') ,
      data: {
        gid: that.data.gid
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("详情", res);
        var list = [];
        // 获取用户名称及发表时间
        var inform = res.data.data.goodsDetail;
        //infoem.attribute
        that.setData({
          addbuy: true,
          inform: inform,
          is_alive: inform.is_alive
        })
        wx.hideLoading()
      }
    })
  },
  tianjia: function () {
    wx.switchTab({
      url: '../car/car'
    })
  },
  leibieall: function (e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    console.log("e", e)
    var anids = e.currentTarget.dataset.anid;
    this.setData({
      anids: anids,
      index: index
    });
    console.log("this.index", this.data.anids);
  },

  //选择型号
  xuanze: function (e) {
    // console.log(e.currentTarget.dataset.index);
    var that = this;
    var arr = that.data.arr;
    var values = that.data.values;;
    var attribute = [];
    setTimeout(function () {
      var anids = that.data.anids;//
      var index = that.data.index;
      //console.log("index",index);
      var active2 = e.currentTarget.dataset.active; //状态
      var avid = e.target.dataset.avid;//值
      var value = e.target.dataset.value;//value
      //console.log("值", value);
      var _attribute = that.data.inform.attribute;
      var _inform = that.data.inform;
      // //////////////
      var attribute_value = _attribute[index].attribute_value;
      // console.log("attribute_value", attribute_value);
      //console.log(attribute_value.length);
      for (var j = 0; j < attribute_value.length; j++) {
        attribute_value[j].active = false;
        if (avid == attribute_value[j].avid) {
          attribute_value[j].active = true;
          //console.log(attribute_value[j].active);
          var avid1 = attribute_value[j].avid;
          var figure = attribute_value[j].figure;
          if (figure != '') {
            figure = attribute_value[j].figure;
          } else {
            figure = that.data.figure;
          }


          //console.log('figure:', attribute_value[j].figure);
          //setTimeout(function () {
          if (index == 0) {
            arr[0] = anids + ':' + avid;
            values[0] = value;
          } else if (index == 1) {
            arr[1] = anids + ':' + avid;
            values[1] = value;
          } else if (index == 2) {
            arr[2] = anids + ':' + avid;
            values[2] = value;
          }
          // }, 100)
        }
      }

      //console.log('qqqqqqqqqqqq', arr);
      /////////////////
      //console.log("参数", anids, avid, value);
      //////////////////////////////////////////////
      var attribute = "";
      for (var i = 0; i < arr.length; i++) {
        if (arr[i]) {
          attribute += arr[i] + ',';
        }
      }

      attribute = attribute.substr(0, attribute.length - 1);
      //console.log("111111111111111", attribute);
      var carid = wx.getStorageSync("carid");
      var attrLen = that.data.inform.attribute.length;//获取attribute长度
      var arrlen = that.data.arr.length; //数组长度
      var priceGroup = that.data.inform.priceGroup;
      var s = 'attr' + attribute;
      console.log('sssss:', s);
      for (var i = 0; i < priceGroup.length; i++) {
        // console.log('|||||||||||', priceGroup[i].key);
        // console.log('\\\\\\\\\\',s);
        if (priceGroup[i].key == s) {
          console.log("iiiiii", i);
          var i = i;
          that.setData({
            i: i
          });
          var nowPrice = that.data.inform.priceGroup[that.data.i].group_price;
          console.log('nowPrice:', nowPrice);
          that.setData({
            inform: _inform,
            figure: figure,
            low_group_price: nowPrice,
            high_group_price: nowPrice
          })
        }
      }
      console.log(that.data.low_group_price + '低;高' + that.data.high_group_price)
      ///////////////////////////////////////////////


      that.setData({
        inform: _inform,
        figure: figure
      })
      ///////////////
      console.log("attribute111:", attribute);
      that.setData({
        _num: e.target.dataset.avid,
        attribute: attribute
      })
    })
  },
  closeCar: function (obj) {
    console.log('closeCar');
    var id = obj.target.id;
    console.log(id);
    var that = this;
    that.setData({
      addCar: false,
      addbuy: false,
      values: []
    })
  },
  /* 点击减号 */
  bindMinus: function () {
    //console.log('-');
    var price = this.data.price;
    // 如果大于1时，才可以减 
    if (price > 1) {
      price--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态 
    var minusStatus = price <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回 
    this.setData({
      price: price,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function () {
    //console.log('+');
    var price = this.data.price;
    // 不作过多考虑自增1 
    price++;
    // 只有大于一件的时候，才能normal状态，否则disable状态 
    var minusStatus = price < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回 
    this.setData({
      price: price,
      minusStatus: minusStatus
    });
  },
  //加入购物车
  addCars: function (e) {
    var that = this;
    var gid = that.data.gid;
    var attribute = "";
    var types = "";
    var arr = that.data.arr;
    var values = that.data.values;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]) {
        attribute += arr[i] + ',';
        types += values[i];
      }
    }
    attribute = attribute.substr(0, attribute.length - 1);
    console.log("aaaaaa", attribute);

    console.log("attribute", typeof attribute[0]);
    console.log("gid", gid);
    var num = that.data.price;
    console.log('gid', gid + 'num', num + 'attribute', attribute);
    wx.request({
      url: app.data.apiUrl + "/api/add-carts?sign=" + wx.getStorageSync('sign') ,
      method: "POST",
      data: {
        gid: that.data.gid,
        num: that.data.price,
        attribute: attribute
      },
      success: function (res) {
        console.log("post", res);
        var status = res.data.status;
        if (status == 1) {
          // wx.showToast({
          //   title: '加入购物车成功',
          //   image: '../images/success.png'
          // });
          that.showZanToast('加入购物车成功');

        } else {
          // wx.showToast({
          //   title: '加入购物车失败',
          //   image: '../images/false.png'
          // });
          that.showZanToast('加入购物车失败');
        }
        that.setData({
          arr: [],
          addCar: false,
          addbuy: false,
          price: 1,
          num: 1
        })

      }
    })
  },
  //下一步
  buy: function (e) {
    var that = this;
    var attribute = "";
    var types = "";
    var arr = that.data.arr;
    var values = that.data.values;
    let is_alive = that.data.is_alive;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]) {
        attribute += arr[i] + ',';
        types += values[i] + ' ';
      }
    }
    attribute = attribute.substr(0, attribute.length - 1);
    //var carid = wx.getStorageSync("carid");
    var attrLen = that.data.inform.attribute.length;//获取attribute长度
    var arrlen = that.data.arr.length; //数组长度
    if (is_alive == 1) { //活体
      if (attrLen > 0) {
        if (arrlen == attrLen) {
          wx.navigateTo({
            url: '../aliveInform/aliveInform?gid=' + that.data.gid + '&price=' + that.data.price + '&attr=' + attribute + '&low_price=' + that.data.low_price + '&type=2' + '&expenses=' + that.data.expenses
          })
          console.log(attribute);
        } else {
          that.showZanToast('请选择属性');
        }
      } else {
        wx.navigateTo({
          url: '../aliveInform/aliveInform?gid=' + that.data.gid + '&' + 'price=' + that.data.price + '&low_price=' + that.data.low_price + '&type=2' + '&expenses=' + that.data.expenses
        })
      }
    }else { //非活体
      if (attrLen > 0) {
        if (arrlen == attrLen) {
          console.log("low_group_price11:", that.data.low_group_price);
          wx.navigateTo({
            url: '../dingdanInform/dingdanInform?gid=' + that.data.gid + '&price=' + that.data.price + '&attr=' + attribute + '&low_price=' + that.data.low_group_price + '&type=2'+'&expenses='+that.data.expenses
          })
          console.log(attribute);
        } else {
          // wx.showToast({
          //   title: '请选择属性',
          //   image: '../images/false.png'
          // }); 
          that.showZanToast('请选择属性');
        }
      } else {
        console.log("low_group_price222:", that.data.low_group_price);
        wx.navigateTo({
          url: '../dingdanInform/dingdanInform?gid=' + that.data.gid + '&price=' + that.data.price + '&low_price=' + that.data.low_group_price + '&type=2' + '&expenses=' + that.data.expenses
        })
      }
    }
    
    that.setData({
      arr: [],
      values: [],
      addbuy: false,
      price: 1
    })
  },
  // 返回首页
  backHome: function () {
    common.backHome();
  },

  /**
   * 生命周期函数--监听页面加载
   */


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var mid = wx.getStorageSync('mid');
    return {
      title: "秒杀",
      path: '/pages/miaoshaInform/miaoshaInform?mid=' + mid + '&gid=' + that.data.gid,
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
}))
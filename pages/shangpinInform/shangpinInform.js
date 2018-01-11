// pages/dingdanInform/dingdanInform.js
var common = require('../../common.js');
var sign = wx.getStorageSync('sign');
const paymentUrl = require('../../config').paymentUrl;
var app = getApp();
var Zan = require('../../dist/index');
Page(Object.assign({}, Zan.Toast, {
  data: {
    oid: "",
    list:'',
    goods_list:'',
    status1:'',
    countDown_tatic: false,
    twoStage:false, //是否是定金
    Countdown: [{
      day: "",
      hr: "",
      min: "",
      sec: ""
    }]
  },
  onLoad: function (options) {
    var sign = wx.getStorageSync('sign');
    console.log('options:', options);
    var that = this;
    that.setData({
      oid: options.oid,
      status1: options.status1,
      Allprice: options.price,
      express_no: options.express_no,
      company: options.company,
    })
  },
  onShow: function () {
    var sign = wx.getStorageSync('sign');
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    // 详情
    wx.request({
      url: app.data.apiUrl2+"/api/order-detail?sign=" + sign,
      data: {
        oid: that.data.oid
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log('res:',res);
        var list = res.data.data.orderDetail;
        console.log("list", list);
        // 获取用户名称及发表时间
        var goods_list = list.goods_list;
        var begin_time = list.order_time;
        that.setData({
          list: list,
          goods_list: list.goods_list,
          expenses: list.expenses
        })
        console.log(list);
        console.log(that.data.Allprice);
        console.log(list.goods_list[0].price)
        console.log(that.data.Allprice == list.goods_list[0].price)
        if (that.data.Allprice != list.goods_list[0].price) {
          console.log(1111)
          that.setData({
            twoStage: true
          })
        }
        //倒计时
        var xiaTime = list.order_time_unix;//下单时间
        var begin_time = parseInt(xiaTime) + 1800; //超时时间
        var nowTime = Date.parse(new Date()); //现在时间
        var ge_nowTime = common.time(nowTime / 1000, 1); // 下单时间
        var be_gainTime = common.time(begin_time, 1);  //超时时间
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
          var inter = setInterval(function () {
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
            that.setData({
              countDown_tatic: true,
              Countdown: _Countdown
            })
            if(Countdown <= 0){
              clearInterval(inter);
            }
          }, 1000)

        } else {
          countDown_tatic: false
        }
        begin_time = common.time(begin_time, 1);
        wx.hideLoading()
      }
    })
  },
  // copy
  copy(e){
    let that = this;
    let number1 = e.currentTarget.dataset.number;
    wx.setClipboardData({
      data: number1,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
            that.showZanToast('复制成功！');
          }
        })
      }
    })
  },
  //提交订单
  formSubmit: function (e) {
    console.log(e.detail.formId);
    var that = this;
    let formId = e.detail.formId;
    console.log("oid", that.data.oid)
    wx.request({
      url: app.data.apiUrl2 + '/api/order-payment?sign=' + wx.getStorageSync('sign') ,
      data: {
        oid: that.data.oid,
        form_id: formId
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        // success
        console.log(res);
        var status = res.data.status;
        if (status == 1) {
          // 调用支付
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: res.data.data.signType,
            paySign: res.data.data.paySign,
            success: function (res) {
              let status = res.data.data.status;
              if (status == 1) {
                that.showZanToast('支付成功！');
                // 保存formid
                wx.request({
                  url: app.data.apiUrl + "/api/save-form?sign=" + wx.getStorageSync('sign'),
                  data: {
                    form_id: formId
                  },
                  header: {
                    'content-type': 'application/json'
                  },
                  method: "GET",
                  success: function (res) {
                    console.log('保存formid成功');
                  }
                })
                setTimeout(function () {
                  // 支付成功跳转
                  wx.navigateTo({
                    url: '../dingdan/dingdan?status='
                  })
                }, 10)
              } else {
                console.log(res.data.data.msg)
                that.showZanToast('支付失败！');
              }
            },
          })
          // 重置属性
          that.setData({
            gid: "",
            attr: "",//属性
            types: "", //类型
            userMes: '',//留言信息
            num: '', //数量
            detail: '',
            oid : ''
          })
        } else {
          that.showZanToast(res.data.msg);
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  }
 
}))
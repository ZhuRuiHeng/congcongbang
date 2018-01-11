//index.js
const app = getApp()
let sign = wx.getStorageSync('sign');
var WxParse = require('../../wxParse/wxParse.js');
import tips from '../../utils/tips.js'
Page({
  data: {
    index: 2, //tab切换
    finish:false,
    goPaya:false
  },
  //事件处理函数
  onLoad: function (option) {
    console.log("option:inform", option);
    this.setData({
      bargain_id: option.bargain_id,
      gid: option.gid
      //detail: options.gid + '-' + attr + '-' + options.bargain_price,
    })
  },
  onShow: function () {
    console.log(app.data.apiUrl + "/bargain/bargain-detail?sign=" + sign + '&operator_id=' + app.data.kid)
      let that = this;
      let userInfo = wx.getStorageSync('userInfo');
      let sign = wx.getStorageSync('sign');
      let rules = wx.getStorageSync('rules').split("\n");
      that.setData({
        goods_desc: wx.getStorageSync('goods_desc'),
        userInfo:userInfo,
        rules: rules,
        goPaya:false
      })
      // 商品详情
      // console.log(that.data.gid);
      // console.log(app.data.apiUrl + "/api/goods-detail?sign=" + sign + '&operator_id=' + app.data.kid);
      wx.request({
        url: app.data.apiUrl + "/api/goods-detail?sign=" + sign + '&operator_id=' + app.data.kid,
        data: {
          gid: that.data.gid
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("商品详情", res.data.data);
          let num1 = res.data.data.goods_price - res.data.data.bargain_price;
          that.setData({
            spInformAll: res.data.data,
            content: res.data.data.goodsDetail.content.toString(),
            expenses: res.data.data.expenses
          })
          if (that.data.content) {
            WxParse.wxParse('content', 'html', that.data.content, that, 5)
          }
          wx.hideLoading()
        }
      })
      // 砍价详情
      wx.request({
        url: app.data.apiUrl + "/bargain/bargain-detail?sign=" + sign + '&operator_id=' + app.data.kid,
        data:{
          bargain_id: that.data.bargain_id
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("砍价详情", res.data.data);
          let num1 = res.data.data.goods_price - res.data.data.bargain_price;
          that.setData({
            informAll: res.data.data,
            lunbo: res.data.data.goods_thumb,
            width: (num1 / res.data.data.goods_price).toFixed(2)*100,
            bargain_price: res.data.data.bargain_price,
            bargain_count: res.data.data.bargain_count //好友数量
          })
          if (res.data.data.goods_thumb.length > 1) { //如果封面图length>1出现轮播点
            that.setData({
              indicatorDots: true,
              autoplay: true,
              interval: 3000,
              duration: 1000,
            })
          }
          wx.hideLoading()
        }
      })
      //砍价最低价
      wx.request({
        url: app.data.apiUrl2 + "/bargain/bargain?sign=" + sign + '&operator_id=' + app.data.kid,
        data: {
          bargain_id: that.data.bargain_id
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("获取砍到的价格", res);
          let status = res.data.status;
          if (status == 1) {
            that.setData({
              minPrice: res.data.data
            })
          }else{
            //tips.alert(res.data.msg);
          }
        }
      })
      // 领取码
      wx.request({
        url: app.data.apiUrl + "/bargain/get-code?sign=" + sign + '&operator_id=' + app.data.kid,
        data:{
          bargain_id: that.data.bargain_id
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("获取领取码", res);
          let status = res.data.status;
          if (status == 1) {
            that.setData({
              ReceiveCode: res.data.data
            })
          } else {
            //tips.alert(res.data.msg);
            that.setData({
              ReceiveCode: false
            })
          }
        }
      })
      // 客服号
      wx.request({
        url: app.data.apiUrl1 + "/bargain/kf?sign=" + sign + '&operator_id=' + app.data.kid,
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("客服号", res);
          let status = res.data.status;
          if (status==1){
              that.setData({
                kf:res.data.data
              })
          }else{
            tips.alert(res.data.msg);
          }
          wx.hideLoading()
        }
      })
   
  },
  // 切换
  checkTap(e) {
    this.setData({
      index: e.currentTarget.dataset.index
    })
  },
  // 分享
  friends() {
    this.setData({
      share: true,
      goPaya:false
    })
  },
  goPayaClose(){
    this.setData({
      goPaya: false
    })
  },
  // 砍价记录
  keep(){
    wx.navigateTo({
      url: '../keep/keep'
    })
  },
  // 取消
  cancel() {
    this.setData({
      share: false
    })
  },
  // 领取
  receive(e) {
    // 获取客服号码
    let that = this;
    let sign = wx.getStorageSync('sign');
    // 领取码
    wx.request({
      url: app.data.apiUrl + "/bargain/get-code?sign=" + sign + '&operator_id=' + app.data.kid,
      data:{
        bargain_id: that.data.bargain_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("获取领取码", res);
        let status = res.data.status;
        if (status == 1) {
          that.setData({
            ReceiveCode: res.data.data
          })
          if (that.data.ReceiveCode != false) {
            that.setData({
              ReceiveCode: that.data.ReceiveCode,
              finish: true
            })
          } else {
            that.setData({
              goPaya: true
            })
          }
        } else {
          //tips.alert(res.data.msg);
          that.setData({
            ReceiveCode: false,
            goPaya: true
          })
        }
      }
    })
    
  },
  // 去支付
  goPaya(e){
    console.log(e);
    this.setData({
      goPaya:false
    })
    wx.navigateTo({
      url: '../bargainPay/bargainPay?gid=' + this.data.gid + '&bargain_id=' + this.data.bargain_id + '&bargain_price=' + this.data.bargain_price + '&expenses=' + this.data.expenses,
    })
  },
  finishClose(){
    this.setData({
      finish:false
    })
  },
  shareClose(){
    this.setData({
      share:false
    })
  },
  // 复制二维码
  mine() {
    let that = this;
    wx.setClipboardData({
      data: '领取码为:' + that.data.ReceiveCode,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
            tips.success('复制成功，快去添加微信好友领取！')
            that.setData({
              finish:false
            })
          }
        })
      }
    })
  },
  //轮播图
  swipclick: function () { //图片预览
    const imgs = this.data.lunbo;
    console.log("const");
    wx.previewImage({
      current: imgs[this.data.currentIndex], // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
    })
  },
  //商品图
  imggoods: function () { //图片预览
    const goods_desc = this.data.goods_desc;
    console.log("const");
    wx.previewImage({
      current: goods_desc[this.data.currentIndex], // 当前显示图片的http链接
      urls: goods_desc // 需要预览的图片http链接列表
    })
  },
  seeEwm(){
    let kf = this.data.kf;
    let kf1 = this.data.kf.split();
    wx.previewImage({
      current: kf, // 当前显示图片的http链接
      urls: kf1 // 需要预览的图片http链接列表
    })
  },
  // 海报
  poster() {
    console.log('poster');
    let that = this;
    let sign = wx.getStorageSync('sign');
    wx.showLoading({
      title: '海报生成中',
    });
    console.log(app.data.apiUrl1 + "/bargain/share?sign=" + sign )
    wx.request({
      url: app.data.apiUrl1 + "/bargain/share?sign=" + sign ,
      data: {
        bargain_id: that.data.bargain_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("shar:",res);
        console.log("海报", res.data.data);
        that.setData({
          imgUrl: res.data.data,
        })
        console.log("prewImg:", that.data.imgUrl);
        wx.previewImage({
          current: that.data.imgUrl, // 当前显示图片的http链接
          urls: [that.data.imgUrl] // 需要预览的图片http链接列表
        })
        wx.hideLoading();
        that.setData({
          share: false
        })
        wx.hideLoading()
      }
    })
  },
  onShareAppMessage: function (e) {
    console.log(e);
    var that = this;
    return {
      title: '宠宠邦',
      path: '/pages/bargainShare/bargainShare?bargain_id=' + that.data.bargain_id,
      success: function (res) {
        console.log(res);
        that.setData({
          share: false
        })
        // 转发成功
      },
      fail: function (res) {
        console.log(res);
        // 转发失败
      }
    }
  }







})

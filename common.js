//返回首页
function backHome() {
  wx.switchTab({
    url: '../index/index'
  })
};
//仅适用于购物车支付方法封装   模式1 模式2 模式3 模式1+2 模式1+3
function allPayment(pay_type){
  wx.request({
    url: 'https://pet.zealcdn.cn/index.php/v2/api/create-order?sign=' + wx.getStorageSync('sign'),
    data: {
      form_id: formId,
      receiver: that.data.dizhi.userName,
      message: that.data.userMes,//留言
      receiver_address: that.data.dizhi.provinceName + that.data.dizhi.cityName + that.data.dizhi.countyName + that.data.dizhi.detailInfo,
      receiver_phone: that.data.dizhi.telNumber, //'18749830459'
      detail: that.data.detailall, //detail:"gid -   attribute   - number"
      sharer_id: sharer_id,
      pay_type: pay_type //1wallet钱包 2pet_money返现账户支付 3point积分账户 多种支付使用, 分隔 缺少时单独使用移动支付 
    },
    method: 'POST',
    success: function (res) { 
      console.log(res);
      var status = res.data.status;
      if (status == 1) {
        wx.requestPayment({
          timeStamp: res.data.data.timeStamp,
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.package,
          signType: res.data.data.signType,
          paySign: res.data.data.paySign,
          'success': function (res) {
            setTimeout(function () {
              that.setData({
                gouwu: []
              })
              console.log('gouwulast', that.data.gouwu);
              // 支付成功跳转
              wx.navigateTo({
                url: '../dingdan/dingdan?status='
              })
            }, 300)
          },
          'fail': function (res) {
            that.showZanToast(res.data.msg);
            that.setData({
              gouwu: []
            })
            console.log('gouwulast', that.data.gouwu);
            setTimeout(function () {
              // 支付成功跳转
              wx.navigateTo({
                url: '../dingdan/dingdan?status='
              })
            }, 300)
          }
        })
        // 重置属性
        that.setData({
          attr: "",//属性
          types: "", //类型
          userMes: '',//留言信息
          num: '', //数量
          detail: ''
        })
      } else {
        that.showZanToast(res.data.msg);
      }
      that.setData({
        // gouwu: []
      })
    },
    fail: function (res) {
      console.log(res)
    },
  })
}
//时间
function time(unixtime, withTime) {
      if (!unixtime) {
          unixtime = (new Date()).getTime();
      } else {
          unixtime *= 1000;
      }
      var nd = new Date(unixtime), year = nd.getFullYear(), month = nd.getMonth() + 1, day = nd.getDate();
      if (month < 10) {
          month = '0' + month;
      }
      if (day < 10) {
          day = '0' + day;
      }
      if (!withTime) {
          return year + '-' + month + '-' + day;
      }
      var hour = nd.getHours(), minute = nd.getMinutes(),second = nd.getSeconds();
      if (hour < 10) {
          hour = '0' + hour;
      }
      if (minute < 10) {
          minute = '0' + minute;
      }
      if (second < 10) {
         second = '0' + second;
      }

      return year + '-' + month + '-' + day + ' ' + hour + ':' + minute +':'+ second;
      // return month + '/' + day + ' ' + hour + ':' + minute +':'+ second;
  };
//通过module.exports暴露给其他问件引用
module.exports = {
  time,
  backHome,
  allPayment
}

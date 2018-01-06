
//app.js
App({
  data: {
    loginData: null,
    sign: "",
    mobile: "", 
    wx_name: "",
    mid: "",
    sharecode: "",
    authStatic: false,
    loginStatic: false,
    authSuccess: false,
    apiUrl: 'https://pet.zealcdn.cn/index.php/v1',
    apiUrl2: 'https://pet.zealcdn.cn/index.php/v2',
    apiUrl1: 'https://pet.zealcdn.cn/index.php'
  },
  onLaunch: function () {
    var that =this;
    wx.showShareMenu({
      withShareTicket: true
    })
    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
    that.data.kid = extConfig.kid ? extConfig.kid : '123';
    wx.setStorageSync('kid', that.data.kid); //that.data.kid
    this.getAuth()
  },
  getAuth(cb) {
    let that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          var data = {};
          var sharer_id = wx.getStorageSync("sharer_id");
          console.log("sharer_id:", sharer_id);
          var gid = wx.getStorageSync("gid");
          if (sharer_id && gid) {
            data = {
              code: res.code,
              mid: sharer_id,
              gid: gid
            }
          } else {
            data = {
              code: res.code
            }
          }
          //console.log("code:",res.code);
          //发起网络请求
          wx.request({
            url: that.data.apiUrl2 + '/api/auth?code=${res.code}',
            data: data,
            success: function (res) {

              console.log(res);
              that.data.sign = res.data.data.sign;
              // that.data.mobile = res.data.data.mobile;
              that.data.loginData = res.data.data.sign;
              that.data.sharecode = res.data.data.sharecode;

              try {
                // wx.setStorageSync('mobile', res.data.data.mobile);
                wx.setStorageSync('mid', res.data.data.mid);
                wx.setStorageSync('sharecode', res.data.data.sharecode);
                wx.setStorageSync('sign', res.data.data.sign);
                // that.data.mobile = res.data.data.mobile;
                that.data.mid = res.data.data.mid;
                wx.getUserInfo({
                  success: function (res) {
                    //console.log(res);
                    var userData = {};
                    var userInfo = res.userInfo
                    var nickName = userInfo.nickName
                    var avatarUrl = userInfo.avatarUrl
                    var gender = userInfo.gender //性别 0：未知、1：男、2：女
                    var province = userInfo.province
                    var city = userInfo.city
                    var country = userInfo.country
                    wx.setStorageSync('avatarUrl', avatarUrl);
                    wx.setStorageSync('nickName', nickName);
                    that.data.username = nickName;
                    that.data.avatarUrl = avatarUrl;
                    userData = {
                      nickName: nickName,
                      avatarUrl: avatarUrl,
                      gender: gender,
                      province: province,
                      city: city,
                      country: country
                    };
                    wx.request({
                      url: that.data.apiUrl1 + '/api/save-user-info?sign=' + that.data.sign,
                      method: 'POST',
                      data: {
                        info: userData
                      },
                      success: function (res) {
                        console.log(res);
                        typeof cb == "function" && cb();
                        that.data.authSuccess = true
                        setTimeout(function () {
                          wx.hideLoading()
                        }, 500)
                      }
                    })
                  },
                  fail: function () {
                    console.log("用户拒绝授权");
                    wx.showModal({
                      title: '警告',
                      content: '您点击了拒绝授权，将无法正常使用体验。请10分钟后再次点击授权，或者删除小程序重新进入。',
                      success: function (res) {
                        if (res.confirm) {
                          console.log('用户点击确定');
                        }
                      }
                    })
                    wx.openSetting({
                      success: (res) => {
                        console.log(res);
                      }
                    })
                  },
                })
              } catch (e) {
                console.log("回话异常：" + e);

              }

            },
          })

        } else {
          console.log('获取用户登录态失败！' + res.errMsg);
        }
      }
    });
  },

  globalData: {
    userInfo: null,
    sign: ""
  }
 
})

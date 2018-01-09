var app = getApp();
import tips from '../../utils/tips.js'
Page({
  data: {
      state: 0,
      monethList:[
        {
          moneth:'一月',
          eng:'January '
        }, {
          moneth: '二月',
          eng: 'February '
        }, {
          moneth: '三月',
          eng: 'March '
        }, {
          moneth: '四月',
          eng: 'April '
        }, {
          moneth: '五月',
          eng: 'May '
        }, {
          moneth: '六月',
          eng: 'June '
        }, {
          moneth: '七月',
          eng: 'July '
        }, {
          moneth: '八月',
          eng: 'August '
        }, {
          moneth: '九月',
          eng: 'September '
        }, {
          moneth: '十月',
          eng: 'October '
        }, {
          moneth: '十一月',
          eng: 'November '
        }, {
          moneth: '十二月',
          eng: 'December '
        }
      ],
      joinUsre:[
        {
          icon: 'https://pet.zealcdn.cn/assets/images/icons/category/363620171231130639.jpg',
        }, {
          icon: 'https://pet.zealcdn.cn/assets/images/icons/category/363620171231130639.jpg',
        }, {
          icon: 'https://pet.zealcdn.cn/assets/images/icons/category/363620171231130639.jpg',
        }, {
          icon: 'https://pet.zealcdn.cn/assets/images/icons/category/363620171231130639.jpg',
        }, {
          icon: 'https://pet.zealcdn.cn/assets/images/icons/category/363620171231130639.jpg',
        }, {
          icon: 'https://pet.zealcdn.cn/assets/images/icons/category/363620171231130639.jpg',
        }, {
          icon: 'https://pet.zealcdn.cn/assets/images/icons/category/363620171231130639.jpg',
        }, {
          icon: 'https://pet.zealcdn.cn/assets/images/icons/category/363620171231130639.jpg',
        }, {
          icon: 'https://pet.zealcdn.cn/assets/images/icons/category/363620171231130639.jpg',
        }
      ],
      width: '0',
      index:0,
      winHeight: "",//窗口高度
      currentTab: '', //预设当前项的值
      scrollLeft: 0, //tab标题的滚动条位置
      dowork:false,
      listNum:[],
      upIndex:0,
      array: ['图片','视频'],
      imageList:[],
      videoList: [],
      upfinish:false,
      indicatorDots: true,
      autoplay: true,
      interval: 3000,
      duration: 1000

  },
  onLoad: function (options) {
  
  },
  onShow: function () {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    var date = new Date();
    var nowMonth = date.getMonth() + 1;
    let month = date.getMonth() + 1;
    if (nowMonth==1){
      nowMonth = '一月'
    } else if (nowMonth == 2){
      nowMonth = '二月'
    } else if (nowMonth == 3) {
      nowMonth = '三月'
    } else if (nowMonth == 4) {
      nowMonth = '四月'
    } else if (nowMonth == 5) {
      nowMonth = '五月'
    } else if (nowMonth == 6) {
      nowMonth = '六月'
    } else if (nowMonth == 7) {
      nowMonth = '七月'
    } else if (nowMonth == 8) {
      nowMonth = '八月'
    } else if (nowMonth == 9) {
      nowMonth = '九月'
    } else if (nowMonth == 10) {
      nowMonth = '十月'
    } else if (nowMonth == 11) {
      nowMonth = '十一月'
    } else if (nowMonth == 12) {
      nowMonth = '十二月'
    }
    var strDate = date.getDate();
    var seperator = "-";
    // 对天数进行处理，1-9号在前面添加一个“0”
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var nowDate = date.getFullYear() + seperator + nowMonth + seperator + strDate;
    wx.setStorageSync('nowDate', nowDate);
    wx.setStorageSync('getFullYear', date.getFullYear);
    wx.setStorageSync('nowMonth', nowMonth);
    wx.setStorageSync('strDate', strDate);
    that.setData({
      nowMonth: nowMonth,
      currentTab:month-1,
      upfinish:false,
      width: '0',
      lunbo: wx.getStorageSync('lunbo')
    })
    wx.request({
      url: app.data.apiUrl + "/bargain/get-month-task?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
      data: {
        month: month
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("获取某月份", res);
        let status = res.data.status;  
        if (status==1){
            let must = res.data.data.must;
            let point = res.data.data.point;
            let listNum = that.data.listNum;
            that.setData({
              must: res.data.data.must,
              point: res.data.data.point,
              total_count: res.data.data.total_count
            })
            // finish_count
            if (must.length>0){
              console.log("1111111")
              for (let i = 0; i < must.length; i++){
                console.log(must[i].finished);
                  if (must[i].finished==true){
                    console.log(111112222);
                    console.log(listNum);
                    listNum.push(i);}
                }
            }
            console.log("pointlength", point.length)
            if (point.length>0) {
              console.log(44444)
              for (let i = 0; i < point.length; i++) {
                if (point[i].finished == true) {
                  listNum.push(i);
                }
              }
            }
            console.log(listNum.length , that.data.total_count);
            console.log("width:", listNum.length/that.data.total_count);
            that.setData({
              listNum,
              width: (listNum.length / that.data.total_count).toFixed(2) * 100
            })
            wx.hideLoading()
        }else{
          tips.alert(res.data.msg)
        }
      }
    })
    // banner
    wx.request({
      url: app.data.apiUrl1 + "bargain/banner?sign=" + wx.getStorageSync('sign'),
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
    //})

  },
  //轮播图点击跳转
  swipclick: function (e) {
    console.log(e);
    var url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: '../webpage/webpage?url=' + url
    })
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    let that = this;
    var cur = e.currentTarget.dataset.current;
    var index = e.currentTarget.dataset.current;
    console.log(cur,index);
    if (this.data.currentTaB == cur) { 
      return false; 
      that.setData({
        dowork: false
      })
    }
    else {
      that.setData({
        currentTab: cur,
        index: index,
        dowork: false,
        listNum:'',
        total_count:'',
        width:0
      })
    }
    wx.request({
      url: app.data.apiUrl + "/bargain/get-month-task?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
      data: {
        month: cur+1
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log('res:', res);
        let status = res.data.status;
        if (status == 1) {
          let must = res.data.data.must;
          let point = res.data.data.point;
          let listNum = that.data.listNum;
          that.setData({
            must: res.data.data.must,
            point: res.data.data.point,
            total_count: res.data.data.total_count
          })
          // finish_count
          if (must.length) {
            console.log(22222)
            for (let i = 0; i < must.length; i++) {
              console.log(must[i].finished)
              if (must[i].finished == true) {
                console.log('33333')
                listNum.push(i);
                console.log(i);
                console.log(listNum);
              }
            }
            console.log("22222222222");
            console.log("width:", listNum.length / that.data.total_count);
            that.setData({
              listNum,
              width: (listNum.length / that.data.total_count).toFixed(2) * 100
            })
          }
          if (point.length) {
            for (let i = 0; i < point.length;i++) {
              if (point[i].finished == true) {
                listNum.push(i);
              }
            }
            console.log("width:", listNum.length / that.data.total_count);
            that.setData({
              listNum,
              width: (listNum.length / that.data.total_count).toFixed(2) * 100
            })
          }
          wx.hideLoading()
        } else {
            tips.alert(res.data.msg)
        }
        
      }
    })
  },
  // 关闭
  close(){
    let that = this;
    that.setData({
      dowork: false,
      imageList: [],
      videoList: []
    })
  },
  // 上传方式
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      upIndex: e.detail.value
    })
  },
  upVideo() {
    let that = this;
    let videoList = that.data.videoList;
    let sign = wx.getStorageSync('sign');
    console.log('upvideo');
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        console.log("视频:", res);
        var tempFilePath = res.tempFilePath; //视频
        var thumbTempFilePath = res.thumbTempFilePath;//图
        var size = (res.size / 1024) / 1024; //大小
        var duration = res.duration;
        if (duration < 3) {
          tips.alert('视频时长不能小于3s!');
          return false;
        }
        if (size > 25) {
          tips.alert('视频压缩不能大于25M!');
          return false;
        }
        that.setData({
          src: res.tempFilePath
        })
        tips.loading('上传中');
        console.log('tempFilePath:', tempFilePath);
        console.log(app.data.apiUrl + "/api/upload-video?sign=" + sign);
        wx.uploadFile({
          url: app.data.apiUrl + "/api/upload-video?sign=" + sign  ,
          filePath: tempFilePath,
          name: 'video',
          header: { 'content-type': 'multipart/form-data' },
          formData: null,
          success: function (res) {
            console.log("视频：", res)
            let data = JSON.parse(res.data);
            if (data.status == 1) {
              videoList.push(data.data)
              that.setData({
                videoList
              })
              tips.success('上传成功！')
            } else {
              tips.alert(res.data.msg)
            }
            tips.loaded(); //消失
          }
        })
      }
    })
  },
  upimages: function () {
    let that = this;
    let sign = wx.getStorageSync('sign');
    let imageList = that.data.imageList;
    wx.showLoading({
      title: '加载中',
    });
    // 上传 
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log("选择相册", res);
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        tips.loading('上传中');
        tips.loaded(); //消失
        console.log(app.data.apiUrl + "/api/upload-image?sign=" + sign );
        wx.uploadFile({
          url: app.data.apiUrl + "/api/upload-image?sign=" + sign,
          filePath: tempFilePaths[0],
          name: 'image',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            console.log('上传图片成功', res);
            let data = JSON.parse(res.data);
            if (data.status == 1) {
              imageList.push(data.data)
              that.setData({
                imageList
              })
            } else {
              tips.alert(res.data.msg)
            }
          }
        })
      }
    })
    wx.hideLoading()
  },
  // 点击
  taskTip(e){
      wx.showLoading({
        title: '加载中',
      })
      let that = this;
      console.log(e);
      let task_id = e.currentTarget.dataset.task_id;
      let pet_id = e.currentTarget.dataset.pet_id
      that.setData({
        task_id: e.currentTarget.dataset.task_id,
        pet_id: e.currentTarget.dataset.pet_id,
        dowork: true
      })
      console.log(app.data.apiUrl + "/bargain/task-info?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,'url')
    wx.request({
      url: app.data.apiUrl + "/bargain/task-info?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
      data: {
        pet_id: pet_id,
        task_id: task_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("任务详情", res);
        let status = res.data.status;
        console.log('status:', status);
        //console.log(JSON.parse(res.data.data),222); 
        // console.log(res.data.data.task_info.split(","), 111); 
        // console.log(res.data.data.type.split(), 222); 
        if (status == 1) {
          console.log(1)
          that.setData({
            type: res.data.data.type,
            task_info: res.data.data.task_info
          })
          if (res.data.data.type.split() =='image'){
            that.setData({
              upIndex: 0,
              imageList: res.data.data.task_info.split(",")
            })
          }else{
            that.setData({
              upIndex: 1,
              videoList: res.data.data.task_info.split(",")
            })
          }
         // upIndex 1  videoList
         // upIndex 0  imageList
        }else{
          console.log(0);
          //tips.alert(res.data.msg)
        }
        wx.hideLoading()
      }
    })
 },
  shenhe(){
    let that = this;
    let types ='';
    let content = '';
    if (that.data.upIndex==0){
      console.log('image');
      types = 'image'
      content = that.data.imageList.toString();
    } else if(that.data.upIndex == 1) {
      console.log('video');
      types = 'video'
      content = that.data.videoList.toString();
    }
    wx.request({
      url: app.data.apiUrl + "/bargain/up-task?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
      data: {
        task_id: that.data.task_id,
        pet_id: that.data.pet_id,
        type: types,
        content: content
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        console.log("提交审核", res);
        let status = res.data.status;
        if (status == 1) {
          tips.success('提交成功！')
          that.setData({
            dowork:false
          })
        } else {
            tips.alert(res.data.msg);
            if (res.data.msg=='已提交，请等待管理员审核'){
              that.setData({
                dowork: false
              })
            }
        }
      }
    })
  },
  // 切换
  tapKeyWorld: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var word = e.currentTarget.dataset.ontap;
    var cate = e.currentTarget.dataset.cate;
    var state = e.currentTarget.dataset.state;
    var sign = wx.getStorageSync('sign');
    this.setData({
      searchword: word,
      state: state
    })
    // 非真实
    // wx.request({
    //   url: app.data.apiUrl2 + '/api/get-category?sign=' + sign,
    //   data: {
    //     type: word
    //   },
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   method: "GET",
    //   success: function (res) {
    //     console.log("切换", res);
    //     that.setData({
    //       modules: res.data.categorys,
    //     })
    //     wx.hideLoading()
    //   }
    // })
  },
})    
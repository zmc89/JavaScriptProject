var app = getApp();
var cfg = {
  photo: {},
  template: {},
  scale: 1,
};
var SCALE = {
  MIN: 0.1,
  MAX: 2,
}

// pages/scene/scene.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    templates: [{
      cover: '../../img/bear.png',
    }, {
      cover: '../../img/logo.png',
    }, {
      cover: '../../img/seal.png',
    }, {
      cover: '../../img/bear-front.png',
    }, {
      cover: '../../img/giraffe.png',
    }, {
      cover: '../../img/penguin-student.png',
    }],
    currentNewScene: 0,
    canvasWidth: 0,
    canvasHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置画布的大小
    this.setCanvasSize();
  },

  setCanvasSize: function () {
    var uploadData = app.globalData.uploadData;
    var that = this;
    // var uploadData = {
    //   "errMsg": "chooseImage:ok",
    //   "tempFilePaths": ["http://tmp/wx73aed45a8f605151.o6zAJs4XaH7SngDvL9N2dHjV7wXg.vFwx9FeSwOw975d0f539dc6d08383aa2dd187f081db1.jpg"],
    //   "tempFiles": [{
    //     "path": "http://tmp/wx73aed45a8f605151.o6zAJs4XaH7SngDvL9N2dHjV7wXg.vFwx9FeSwOw975d0f539dc6d08383aa2dd187f081db1.jpg",
    //     "size": 81478
    //   }]
    // };

    // 先要知道容器的高度和宽度
    wx.createSelectorQuery().select('#scene-editor').boundingClientRect(function (canvasWrapper) {
      // console.log(canvasWrapper);
      cfg.canvasWrapper = canvasWrapper;

      // 要知道图片原始高度和宽度
      wx.getImageInfo({
        src: uploadData.tempFilePaths[0],
        success(res) {
          cfg.photo.path = res.path;
          var originalHeight = cfg.photo.originalHeight = res.height;
          var originalWidth = cfg.photo.originalWidth = res.width;

          // 画布的高度、宽度
          if (originalHeight / originalWidth > canvasWrapper.height / canvasWrapper.width) {
            cfg.canvasHeight = canvasWrapper.height;
            cfg.canvasWidth = originalWidth * cfg.canvasHeight / originalHeight;
          } else {
            cfg.canvasWidth = canvasWrapper.width;
            cfg.canvasHeight = originalHeight * cfg.canvasWidth / originalWidth;
          }

          that.setData({
            canvasWidth: cfg.canvasWidth,
            canvasHeight: cfg.canvasHeight
          });

          that.drawNewScene(that.data.currentNewScene);
        }
      })
    }).exec();
  },

  drawNewScene: function (index) {
    var uploadData = app.globalData.uploadData;

    // var uploadData = {
    //   "errMsg": "chooseImage:ok",
    //   "tempFilePaths": ["http://tmp/wx73aed45a8f605151.o6zAJs4XaH7SngDvL9N2dHjV7wXg.vFwx9FeSwOw975d0f539dc6d08383aa2dd187f081db1.jpg"],
    //   "tempFiles": [{
    //     "path": "http://tmp/wx73aed45a8f605151.o6zAJs4XaH7SngDvL9N2dHjV7wXg.vFwx9FeSwOw975d0f539dc6d08383aa2dd187f081db1.jpg",
    //     "size": 81478
    //   }]
    // };
    var templates = this.data.templates;
    var ctx = wx.createCanvasContext("scene");

    wx.getImageInfo({
      src: templates[index].cover,
      success(res) {
        var width = cfg.template.originalWidth = res.width;
        var height = cfg.template.originalHeight = res.height;
        cfg.template.x = 0;
        cfg.template.y = 0;
        cfg.template.cover = templates[index].cover;

        ctx.drawImage(uploadData.tempFilePaths[0], 0, 0, cfg.canvasWidth, cfg.canvasHeight);
        ctx.drawImage(templates[index].cover, 0, 0, 100, 100 * height / width);
        ctx.draw();
      }
    })

  },

  onTapScene: function (event) {
    var index = event.currentTarget.dataset.index;

    this.setData({
      currentNewScene: index
    });

    this.drawNewScene(index);
  },

  startMove: function (event) {
    var touchPoint = event.touches[0];
    var x = cfg.template.x;
    var y = cfg.template.y;

    cfg.offsetX = touchPoint.clientX - x;
    cfg.offsetY = touchPoint.clientY - y;
  },

  startZoom: function (event) {
    var xMove = event.touches[1].clientX - event.touches[0].clientX;
    var yMove = event.touches[1].clientY - event.touches[0].clientY;

    cfg.initialDistance = Math.sqrt(xMove * xMove + yMove * yMove);
  },

  onTouchStart: function (event) {
    console.log(event);

    if (event.touches.length > 1) {
      // 开始缩放
      this.startZoom(event);
    } else {
      // 开始移动
      this.startMove(event);
    }
  },

  zoom: function (event) {
    var xMove = event.touches[1].clientX - event.touches[0].clientX;
    var yMove = event.touches[1].clientY - event.touches[0].clientY

    cfg.curDistance = Math.sqrt(xMove * xMove + yMove * yMove);
    cfg.scale = Math.min(cfg.scale + 0.001 * (cfg.curDistance - cfg.initialDistance),
      SCALE.MAX);
    cfg.scale = Math.max(cfg.scale, SCALE.MIN);

    var uploadData = app.globalData.uploadData;
    // var uploadData = {
    //   "errMsg": "chooseImage:ok",
    //   "tempFilePaths": ["http://tmp/wx73aed45a8f605151.o6zAJs4XaH7SngDvL9N2dHjV7wXg.vFwx9FeSwOw975d0f539dc6d08383aa2dd187f081db1.jpg"],
    //   "tempFiles": [{
    //     "path": "http://tmp/wx73aed45a8f605151.o6zAJs4XaH7SngDvL9N2dHjV7wXg.vFwx9FeSwOw975d0f539dc6d08383aa2dd187f081db1.jpg",
    //     "size": 81478
    //   }]
    // };
    var ctx = wx.createCanvasContext('scene');
    var template = cfg.template;
    var newWidth = 100 * cfg.scale;
    var newHeight = newWidth * template.originalHeight / template.originalWidth;

    console.log(template.x, template.y, newWidth, newHeight);

    ctx.drawImage(uploadData.tempFilePaths[0], 0, 0, cfg.canvasWidth, cfg.canvasHeight);
    ctx.drawImage(template.cover, template.x, template.y, newWidth, newHeight);
    ctx.draw();
  },

  move: function (event) {
    var touchPoint = event.touches[0];

    var uploadData = app.globalData.uploadData;
    // var uploadData = {
    //   "errMsg": "chooseImage:ok",
    //   "tempFilePaths": ["http://tmp/wx73aed45a8f605151.o6zAJs4XaH7SngDvL9N2dHjV7wXg.vFwx9FeSwOw975d0f539dc6d08383aa2dd187f081db1.jpg"],
    //   "tempFiles": [{
    //     "path": "http://tmp/wx73aed45a8f605151.o6zAJs4XaH7SngDvL9N2dHjV7wXg.vFwx9FeSwOw975d0f539dc6d08383aa2dd187f081db1.jpg",
    //     "size": 81478
    //   }]
    // };
    // cfg.offsetX = touchPoint.clientX - ?
    var x = touchPoint.clientX - cfg.offsetX;
    var y = touchPoint.clientY - cfg.offsetY;
    var ctx = wx.createCanvasContext("scene");
    cfg.template.x = x;
    cfg.template.y = y;
    var newWidth = 100 * cfg.scale;
    var newHeight = newWidth * cfg.template.originalHeight / cfg.template.originalWidth;

    ctx.drawImage(uploadData.tempFilePaths[0], 0, 0, cfg.canvasWidth, cfg.canvasHeight);
    ctx.drawImage(cfg.template.cover, x, y, newWidth,  newHeight);
    ctx.draw();
  },

  onTouchMove: function (event) {
    if (event.touches.length > 1) {
      // 缩放中
      this.zoom(event);
    } else {
      // 离上次结束小于 600ms 不处理，解决缩放 bug
      if (new Date().getTime() - cfg.endTime < 600) {
        return;
      }

      // 移动中
      this.move(event);
    }
  },

  onTouchEnd: function () {
    const date = new Date();
    cfg.endTime = date.getTime();
  },

  downloadPic: function () {
    var canvasWidth = cfg.canvasWidth;
    var canvasHeight = cfg.canvasHeight;

    wx.canvasToTempFilePath({
      width: canvasWidth,
      height: canvasHeight,
      destWidth: canvasWidth * 2,
      destHeight: canvasHeight * 2,
      canvasId: 'scene',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            wx.showToast({
              title: '保存成功'
            });
          }
        });
      }
    })
  }
})
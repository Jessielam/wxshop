import { Home } from "home-model.js";
var home = new Home(); // 实例化对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
  
  },

  onLoad:function () {
    this._loadData();
  },

  _loadData:function () {
    var that = this;
    home.getBannerData((data)=>{
      that.setData({
        banners: data
      });
    });

    // 获取精选主题数据
    home.getThemeData((data) => {
      // console.log(data);
      that.setData({
        'themeData': data,
        loadingHidden: true
      });
    });

    /*获取单品信息*/
    home.getProductorData((data) => {
      // console.log(data);
      that.setData({
        productsArr: data
      });
    });
  },

  // 商品详情页
  onProductsItemTap: function(event) {
    var id = home.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id,
    });
  },

  onThemesItemTap: function(event) {
    var id = home.getDataSet(event, 'id');
    var name = home.getDataSet(event, 'name');
    wx.navigateTo({
      url: '../theme/theme?id=' + id + '&name=' + name
    });
  }
})
import { Theme } from "theme-module.js";
var theme = new Theme(); // 实例化对象
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  onReady:function() {
    wx.setNavigationBarTitle({
      title: this.data.titleName,
    })
  },

  onLoad: function (option) {
    this.setData({
      titleName: option.name,
      id: option.id
    });
    wx.setNavigationBarTitle({
      title: option.name
    });
    this._loadData();
  },

  _loadData:function(callback) {
    var that = this;
    theme.getProductData(this.data.id, (data)=>{
      // console.log(data);
      that.setData({
        themeInfo: data,
        loadingHidden: true
      });
      callback && callback();
    });
  },

  /*跳转到商品详情*/
  onProductsItemTap: function (event) {
    var id = theme.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id
    })
  },

  /*下拉刷新页面*/
  onPullDownRefresh: function () {
    this._loadData(() => {
      wx.stopPullDownRefresh()
    });
  },
})
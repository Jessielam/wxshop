import { Config } from "config.js";

class Base {
  constructor () {
    this.baseUrl = Config.baseUrl;
  }

  request (params) {
    var url = this.baseUrl + params.url;
    if (!params.method) {
      params.method = 'GET';
    }
    wx.request({
      url: url,
      header : {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      data: params.data,
      method: params.method,
      success: function (res) {
        params.sCallback && params.sCallback(res.data);
      },
      fail: function (err) {
        console.log(err)
      }
    })
  }

  /*获得元素上的绑定的值*/
  getDataSet(event, key) {
    return event.currentTarget.dataset[key];
  };

}

export { Base }
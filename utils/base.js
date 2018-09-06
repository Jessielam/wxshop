import { Config } from "config.js";
import { Token } from 'token.js';

class Base {
  constructor () {
    this.baseUrl = Config.baseUrl;
  }

  request (params, noRefetch) {
    var that = this;
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
        var code = res.statusCode.toString();
        var startChar = code.charAt(0);
        if (startChar =='2') {
          params.sCallback && params.sCallback(res.data);
        } else {
          if (code == "401") {
            if (!noRefetch) {
              that._request(params);
            }
            if (noRefetch) {
              params.eCallback && params.eCallback(res.data);
            }
          }
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  }

  _request(params) {
    var token = new Token();
    token.getTokenFromServer((token) => {
      this.request(params, true);
    });
  }

  /*获得元素上的绑定的值*/
  getDataSet(event, key) {
    return event.currentTarget.dataset[key];
  };

}

export { Base }
import { Base } from "../../utils/base.js";
class Home extends Base {
  constructor() {
    super(); // 调用基类的构造函数
  }

  // 获取首页banner数据
  getBannerData(callback) {
    var params = {
      url: 'banner/1',
      sCallback: function (res) {
        var data = res.items;
        // console.log(data);
        callback && callback(data);
      }
    }
    this.request(params);
  }

  getThemeData(callback) {
    var params = {
      url: 'theme?ids=1,2,3',
      sCallback: function (data) {
        callback && callback(data);
      }
    }

    this.request(params)
  }

  /*首页部分商品*/
  getProductorData(callback) {
    var param = {
      url: 'product/recent',
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(param);
  }
}

export { Home };
"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const tools = [
      {
        name: "BMI计算",
        icon: "🙎‍",
        path: "/pages/bmi/bmi"
      },
      // {
      // 	name: '单位转换',
      // 	path: '/pages/unit-converter/index'
      // },
      // {
      // 	name: '时间工具',
      // 	path: '/pages/time-utils/index'
      // },
      // {
      // 	name: '加密解密',
      // 	path: '/pages/encrypt-decrypt/index'
      // },
      {
        name: "Emoji大全",
        path: "/pages/emoji/emoji",
        icon: "🎨",
        desc: "超全emoji表情，可复制"
      },
      {
        name: "官方表情包",
        path: "/pages/biaoqingbao/biaoqingbao",
        icon: "😀",
        desc: "超全emoji表情，可复制"
      }
    ];
    const navigateToTool = (path) => {
      common_vendor.index.navigateTo({
        url: path
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(tools, (tool, index, i0) => {
          return {
            a: common_vendor.t(tool.icon),
            b: common_vendor.t(tool.name),
            c: index,
            d: common_vendor.o(($event) => navigateToTool(tool.path), index)
          };
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map

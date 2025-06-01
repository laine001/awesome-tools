"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  UvQrcode();
}
const UvQrcode = () => "../../uni_modules/uv-qrcode/components/uv-qrcode/uv-qrcode.js";
const _sfc_main = {
  __name: "qrcode",
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_vendor.sr("qrcode", "20a51e92-0"),
        b: common_vendor.p({
          size: "300px",
          value: "https://h5.uvui.cn"
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/qrcode/qrcode.js.map

/**
 * 超图iserver服务返回的json转为geojson工具类
 * 编译日期：2025-12-23 12:09
 * 版权所有：Copyright by 木遥
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.iserverGeojson = {}));
})(this, (function (exports) { 'use strict';

  /* eslint-disable no-extend-native */
  /* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
   * This program are made available under the terms of the Apache License, Version 2.0
   * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html. */

  /**
   * @name String
   * @namespace
   * @category BaseTypes Util
   * @description 字符串操作的一系列常用扩展函数。
   * @private
   */
  let StringExt = {
    /**
     * @function StringExt.startsWith
     * @description 判断目标字符串是否以指定的子字符串开头。
     * @param {string} str - 目标字符串。
     * @param {string} sub - 查找的子字符串。
     * @returns {boolean} 目标字符串以指定的子字符串开头，则返回 true；否则返回 false。
     */
    startsWith: function (str, sub) {
      return str.indexOf(sub) == 0
    },

    /**
     * @function StringExt.contains
     * @description 判断目标字符串是否包含指定的子字符串。
     * @param {string} str - 目标字符串。
     * @param {string} sub - 查找的子字符串。
     * @returns {boolean} 目标字符串中包含指定的子字符串，则返回 true；否则返回 false。
     */
    contains: function (str, sub) {
      return str.indexOf(sub) != -1
    },

    /**
     * @function StringExt.trim
     * @description 删除一个字符串的开头和结尾处的所有空白字符。
     * @param {string} str - （可能）存在空白字符填塞的字符串。
     * @returns {string} 删除开头和结尾处空白字符后的字符串。
     */
    trim: function (str) {
      return str.replace(/^\s\s*/, "").replace(/\s\s*$/, "")
    },

    /**
     * @function StringExt.camelize
     * @description 骆驼式("-")连字符的字符串处理。
     * 例如："chicken-head" becomes "chickenHead",
     *       "-chicken-head" becomes "ChickenHead"。
     * @param {string} str - 要处理的字符串，原始内容不应被修改。
     * @returns {string}
     */
    camelize: function (str) {
      const oStringList = str.split("-");
      let camelizedString = oStringList[0];
      for (let i = 1, len = oStringList.length; i < len; i++) {
        const s = oStringList[i];
        camelizedString += s.charAt(0).toUpperCase() + s.substring(1);
      }
      return camelizedString
    },

    /**
     * @function StringExt.format
     * @description 提供带 ${token} 标记的字符串, 返回 context 对象属性中指定标记的属性值。
     * @example
     * 示例：
     * (code)
     * 1、template = "${value,getValue}";
     *         context = {value: {getValue:function(){return Math.max.apply(null,argument);}}};
     *         args = [2,23,12,36,21];
     *       返回值:36
     * (end)
     * 示例:
     * (code)
     * 2、template = "$${{value,getValue}}";
     *         context = {value: {getValue:function(){return Math.max.apply(null,argument);}}};
     *         args = [2,23,12,36,21];
     *       返回值:"${36}"
     * (end)
     * 示例:
     * (code)
     * 3、template = "${a,b}";
     *         context = {a: {b:"format"}};
     *         args = null;
     *       返回值:"format"
     * (end)
     * 示例:
     * (code)
     * 3、template = "${a,b}";
     *         context = null;
     *         args = null;
     *       返回值:"${a.b}"
     * (end)
     * @param {string} template - 带标记的字符串将要被替换。参数 template 格式为"${token}"，此处的 token 标记会替换为 context["token"] 属性的值。
     * @param {Object} [context=window] - 带有属性的可选对象的属性用于匹配格式化字符串中的标记。如果该参数为空，将使用 window 对象。
     * @param {Array.<number>} [args] - 可选参数传递给在 context 对象上找到的函数。
     * @returns {string} 从 context 对象属性中替换字符串标记位的字符串。
     */
    format: function (template, context, args) {
      if (!context) {
        context = window;
      }

      // Example matching:
      // str   = ${foo.bar}
      // match = foo.bar
      const replacer = function (str, match) {
        let replacement;

        // Loop through all subs. Example: ${a.b.c}
        // 0 -> replacement = context[a];
        // 1 -> replacement = context[a][b];
        // 2 -> replacement = context[a][b][c];
        const subs = match.split(/\.+/);
        for (let i = 0; i < subs.length; i++) {
          if (i == 0) {
            replacement = context;
          }

          replacement = replacement[subs[i]];
        }

        if (typeof replacement === "function") {
          replacement = args ? replacement.apply(null, args) : replacement();
        }

        // If replacement is undefined, return the string 'undefined'.
        // This is a workaround for a bugs in browsers not properly
        // dealing with non-participating groups in regular expressions:
        // http://blog.stevenlevithan.com/archives/npcg-javascript
        if (typeof replacement === "undefined") {
          return "undefined"
        } else {
          return replacement
        }
      };

      return template.replace(StringExt.tokenRegEx, replacer)
    },

    /**
     * @member {RegExp} [StringExt.tokenRegEx]
     * @description 寻找带 token 的字符串，默认为 tokenRegEx=/\$\{([\w.]+?)\}/g。
     * @example
     * Examples: ${a}, ${a.b.c}, ${a-b}, ${5}
     */
    tokenRegEx: /\$\{([\w.]+?)\}/g,

    /**
     * @member {RegExp} [StringExt.numberRegEx]
     * @description 判断一个字符串是否只包含一个数值，默认为 numberRegEx=/^([+-]?)(?=\d|\.\d)\d*(\.\d*)?([Ee]([+-]?\d+))?$/。
     */
    numberRegEx: /^([+-]?)(?=\d|\.\d)\d*(\.\d*)?([Ee]([+-]?\d+))?$/,

    /**
     * @function StringExt.isNumeric
     * @description 判断一个字符串是否只包含一个数值。
     * @example
     * (code)
     * StringExt.isNumeric("6.02e23") // true
     * StringExt.isNumeric("12 dozen") // false
     * StringExt.isNumeric("4") // true
     * StringExt.isNumeric(" 4 ") // false
     * (end)
     * @returns {boolean} 字符串包含唯一的数值，返回 true；否则返回 false。
     */
    isNumeric: function (value) {
      return StringExt.numberRegEx.test(value)
    },

    /**
     * @function StringExt.numericIf
     * @description 把一个看似数值型的字符串转化为一个数值。
     * @returns {(number|string)} 如果能转换为数值则返回数值，否则返回字符串本身。
     */
    numericIf: function (value) {
      return StringExt.isNumeric(value) ? parseFloat(value) : value
    }
  };

  /**
   * @name Number
   * @namespace
   * @category BaseTypes Util
   * @description 数值操作的一系列常用扩展函数。
   * @private
   */
  let NumberExt = {
    /**
     * @member {string} [NumberExt.decimalSeparator='.']
     * @description 格式化数字时默认的小数点分隔符。
     * @constant
     */
    decimalSeparator: ".",

    /**
     * @member {string} [NumberExt.thousandsSeparator=',']
     * @description 格式化数字时默认的千位分隔符。
     * @constant
     */
    thousandsSeparator: ",",

    /**
     * @function NumberExt.limitSigDigs
     * @description 限制浮点数的有效数字位数。
     * @param {number} num - 浮点数。
     * @param {number} sig - 有效位数。
     * @returns {number} 将数字四舍五入到指定数量的有效位数。
     */
    limitSigDigs: function (num, sig) {
      let fig = 0;
      if (sig > 0) {
        fig = parseFloat(num.toPrecision(sig));
      }
      return fig
    },

    /**
     * @function NumberExt.format
     * @description 数字格式化输出。
     * @param {number} num - 数字。
     * @param {number} [dec=0]  - 数字的小数部分四舍五入到指定的位数。设置为 null 值时小数部分不变。
     * @param {string} [tsep=','] - 千位分隔符。
     * @param {string} [dsep='.'] - 小数点分隔符。
     * @returns {string} 数字格式化后的字符串。
     */
    format: function (num, dec, tsep, dsep) {
      dec = typeof dec !== "undefined" ? dec : 0;
      tsep = typeof tsep !== "undefined" ? tsep : NumberExt.thousandsSeparator;
      dsep = typeof dsep !== "undefined" ? dsep : NumberExt.decimalSeparator;

      if (dec != null) {
        num = parseFloat(num.toFixed(dec));
      }

      const parts = num.toString().split(".");
      if (parts.length === 1 && dec == null) {
        // integer where we do not want to touch the decimals
        dec = 0;
      }

      let integer = parts[0];
      if (tsep) {
        const thousands = /(-?[0-9]+)([0-9]{3})/;
        while (thousands.test(integer)) {
          integer = integer.replace(thousands, "$1" + tsep + "$2");
        }
      }

      let str;
      if (dec == 0) {
        str = integer;
      } else {
        let rem = parts.length > 1 ? parts[1] : "0";
        if (dec != null) {
          rem = rem + new Array(dec - rem.length + 1).join("0");
        }
        str = integer + dsep + rem;
      }
      return str
    }
  };

  if (!Number.prototype.limitSigDigs) {
    /**
     * APIMethod: Number.limitSigDigs
     * 限制浮点数的有效数字位数.
     * @param {number} sig -有效位数。
     * @returns {number} 将数字四舍五入到指定数量的有效位数。
     *           如果传入值 为 null、0、或者是负数, 返回值 0。
     */
    Number.prototype.limitSigDigs = function (sig) {
      return NumberExt.limitSigDigs(this, sig)
    };
  }

  /* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
   * This program are made available under the terms of the Apache License, Version 2.0
   * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html. */
  // import {WKT} from '../format/WKT';
  // import {Vector} from './Vector';

  /**
   * @class Geometry
   * @deprecatedclass SuperMap.Geometry
   * @category BaseTypes Geometry
   * @classdesc 几何对象类，描述地理对象的几何图形。
   * @usage
   */
  class Geometry {
    constructor() {
      this.CLASS_NAME = "SuperMap.Geometry";
      /**
       * @member {string} Geometry.prototype.id
       * @description  几何对象的唯一标示符。
       *
       */
      this.id = Util.createUniqueID(this.CLASS_NAME + "_");

      /**
       * @member {Geometry} Geometry.prototype.parent
       * @description 父类几何对象。
       */
      this.parent = null;

      /**
       * @member {Bounds} Geometry.prototype.bounds
       * @description 几何对象的范围。
       *
       */
      this.bounds = null;

      /**
       * @member {number} Geometry.prototype.SRID
       * @description 投影坐标参数。通过该参数，服务器判断 Geometry 对象的坐标参考系是否与数据集相同，如果不同，则在数据入库前进行投影变换。
       * @example
       * var geometry= new Geometry();
       * geometry. SRID=4326;
       *
       */
      this.SRID = null;
    }

    /**
     * @function Geometry.prototype.destroy
     * @description 解构 Geometry 类，释放资源。
     */
    destroy() {
      this.id = null;
      this.bounds = null;
      this.SRID = null;
    }

    /**
     * @function Geometry.prototype.clone
     * @description 克隆几何图形。克隆的几何图形不设置非标准的属性。
     * @returns {Geometry} 克隆的几何图形。
     */
    clone() {
      return new Geometry()
    }

    /**
     * @function Geometry.prototype.setBounds
     * @description 设置几何对象的 bounds。
     * @param {Bounds} bounds - 范围。
     */
    setBounds(bounds) {
      if (bounds) {
        this.bounds = bounds.clone();
      }
    }

    /**
     * @function Geometry.prototype.clearBounds
     * @description 清除几何对象的 bounds。
     * 如果该对象有父类，也会清除父类几何对象的 bounds。
     */
    clearBounds() {
      this.bounds = null;
      if (this.parent) {
        this.parent.clearBounds();
      }
    }

    /**
     * @function Geometry.prototype.extendBounds
     * @description 扩展现有边界以包含新边界。如果尚未设置几何边界，则设置新边界。
     * @param {Bounds} newBounds - 几何对象的 bounds。
     */
    extendBounds(newBounds) {
      const bounds = this.getBounds();
      if (!bounds) {
        this.setBounds(newBounds);
      } else {
        this.bounds.extend(newBounds);
      }
    }

    /**
     * @function Geometry.prototype.getBounds
     * @description 获得几何图形的边界。如果没有设置边界，可通过计算获得。
     * @returns {Bounds} 几何对象的边界。
     */
    getBounds() {
      if (this.bounds == null) {
        this.calculateBounds();
      }
      return this.bounds
    }

    /**
     * @function Geometry.prototype.calculateBounds
     * @description 重新计算几何图形的边界（需要在子类中实现此方法）。
     */
    calculateBounds() {
      //
      // This should be overridden by subclasses.
      //
    }

    /**
     * @function Geometry.prototype.getVertices
     * @description 返回几何图形的所有顶点的列表（需要在子类中实现此方法）。
     * @param {boolean} [nodes] - 如果是 true，线则只返回线的末端点，如果 false，仅仅返回顶点，如果没有设置，则返回顶点。
     * @returns {Array} 几何图形的顶点列表。
     */
    getVertices(nodes) {
      // eslint-disable-line no-unused-vars
    }

    /**
     * @function Geometry.prototype.getArea
     * @description 计算几何对象的面积 ，此方法需要在子类中定义。
     * @returns {number} 计算后的对象面积。
     */
    getArea() {
      // to be overridden by geometries that actually have an area
      //
      return 0.0
    }

    // /**
    //  * @function Geometry.prototype.toString
    //  * @description 返回geometry对象的字符串表述，需要引入{@link WKTFormat}。此方法只能在子类实现，在父类使用会报错。
    //  * @returns {string} geometry对象的字符串表述(Well-Known Text)
    //  */
    // toString() {
    // var string;
    // if (WKT) {
    //     var wkt = new WKT();
    //     string = wkt.write(new Vector(this));
    // } else {
    //     string = Object.prototype.toString.call(this);
    // }
    // return string;
    // }
  }

  /* eslint-disable no-loss-of-precision */
  /* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
   * This program are made available under the terms of the Apache License, Version 2.0
   * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html. */

  /**
   * @description 浏览器名称，依赖于 userAgent 属性，BROWSER_NAME 可以是空，或者以下浏览器：
   *     * "opera" -- Opera
   *     * "msie"  -- Internet Explorer
   *     * "safari" -- Safari
   *     * "firefox" -- Firefox
   *     * "mozilla" -- Mozilla
   * @category BaseTypes Constant
   * @constant {Object}
   * @usage
   * ```
   * // 浏览器
   * <script type="text/javascript" src="{cdn}"></script>
   * <script>
   *   const result = {namespace}.Browser.name;
   *
   * </script>
   * // ES6 Import
   * import { Browser } from '{npm}';
   *
   * const result = Browser.name;
   * ```
   */
  const Browser = (function () {
    let name = "";
    let version = "";
    let device = "pc";
    let uaMatch;
    // 以下进行测试
    const ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("msie") > -1 || (ua.indexOf("trident") > -1 && ua.indexOf("rv") > -1)) {
      name = "msie";
      uaMatch = ua.match(/msie ([\d.]+)/) || ua.match(/rv:([\d.]+)/);
    } else if (ua.indexOf("chrome") > -1) {
      name = "chrome";
      uaMatch = ua.match(/chrome\/([\d.]+)/);
    } else if (ua.indexOf("firefox") > -1) {
      name = "firefox";
      uaMatch = ua.match(/firefox\/([\d.]+)/);
    } else if (ua.indexOf("opera") > -1) {
      name = "opera";
      uaMatch = ua.match(/version\/([\d.]+)/);
    } else if (ua.indexOf("safari") > -1) {
      name = "safari";
      uaMatch = ua.match(/version\/([\d.]+)/);
    }
    version = uaMatch ? uaMatch[1] : "";

    if (ua.indexOf("ipad") > -1 || ua.indexOf("ipod") > -1 || ua.indexOf("iphone") > -1) {
      device = "apple";
    } else if (ua.indexOf("android") > -1) {
      uaMatch = ua.match(/version\/([\d.]+)/);
      version = uaMatch ? uaMatch[1] : "";
      device = "android";
    }
    return { name: name, version: version, device: device }
  })();

  const isSupportCanvas = (function () {
    let checkRes = true;
    const broz = Browser;
    if (document.createElement("canvas").getContext) {
      if (broz.name === "firefox" && parseFloat(broz.version) < 5) {
        checkRes = false;
      }
      if (broz.name === "safari" && parseFloat(broz.version) < 4) {
        checkRes = false;
      }
      if (broz.name === "opera" && parseFloat(broz.version) < 10) {
        checkRes = false;
      }
      if (broz.name === "msie" && parseFloat(broz.version) < 9) {
        checkRes = false;
      }
    } else {
      checkRes = false;
    }
    return checkRes
  })();

  /**
   * @description 如果 userAgent 捕获到浏览器使用的是 Gecko 引擎则返回 true。
   * @constant {number}
   * @private
   */
  ((function () {
    const ua = navigator.userAgent.toLowerCase();
    return ua.indexOf("webkit") === -1 && ua.indexOf("gecko") !== -1
  }))();

  /**
   * @constant {number}
   * @default
   * @description 分辨率与比例尺之间转换的常量。
   * @private
   */
  const DOTS_PER_INCH = 96;

  /**
   * @name CommonUtil
   * @namespace
   * @category BaseTypes Util
   * @description common 工具类。
   * @usage
   * ```
   * // 浏览器
   * <script type="text/javascript" src="{cdn}"></script>
   * <script>
   *   const result = {namespace}.CommonUtil.getElement();
   *
   *   // 弃用的写法
   *   const result = SuperMap.Util.getElement();
   *
   * </script>
   *
   * // ES6 Import
   * import { CommonUtil } from '{npm}';
   *
   * const result = CommonUtil.getElement();
   * ```
   */

  const Util = {
    /**
     * @memberOf CommonUtil
     * @description 复制源对象的所有属性到目标对象上，源对象上的没有定义的属性在目标对象上也不会被设置。
     * @example
     * 要复制 Size 对象的所有属性到自定义对象上，使用方法如下:
     *     let size = new Size(100, 100);
     *     let obj = {}；
     *     CommonUtil.extend(obj, size);
     * @param {Object} [destination] - 目标对象。
     * @param {Object} source - 源对象，其属性将被设置到目标对象上。
     * @returns {Object} 目标对象。
     */

    extend: function (destination, source) {
      destination = destination || {};
      if (source) {
        for (const property in source) {
          const value = source[property];
          if (value !== undefined) {
            destination[property] = value;
          }
        }

        /**
         * IE doesn't include the toString property when iterating over an object's
         * properties with the for(property in object) syntax.  Explicitly check if
         * the source has its own toString property.
         */

        /*
         * FF/Windows < 2.0.0.13 reports "Illegal operation on WrappedNative
         * prototype object" when calling hawOwnProperty if the source object
         * is an instance of window.Event.
         */

        const sourceIsEvt = typeof window.Event === "function" && source instanceof window.Event;

        if (!sourceIsEvt && source.hasOwnProperty && source.hasOwnProperty("toString")) {
          destination.toString = source.toString;
        }
      }
      return destination
    },
    /**
     * @memberOf CommonUtil
     * @description 对象拷贝。
     * @param {Object} [des] - 目标对象。
     * @param {Object} soc - 源对象。
     */
    copy: function (des, soc) {
      des = des || {};
      let v;
      if (soc) {
        for (const p in des) {
          v = soc[p];
          if (typeof v !== "undefined") {
            des[p] = v;
          }
        }
      }
    },
    /**
     * @memberOf CommonUtil
     * @description 销毁对象，将其属性置空。
     * @param {Object} [obj] - 目标对象。
     */
    reset: function (obj) {
      obj = obj || {};
      for (const p in obj) {
        if (obj.hasOwnProperty(p)) {
          if (typeof obj[p] === "object" && obj[p] instanceof Array) {
            for (const i in obj[p]) {
              if (obj[p][i].destroy) {
                obj[p][i].destroy();
              }
            }
            obj[p].length = 0;
          } else if (typeof obj[p] === "object" && obj[p] instanceof Object) {
            if (obj[p].destroy) {
              obj[p].destroy();
            }
          }
          obj[p] = null;
        }
      }
    },

    /**
     * @memberOf CommonUtil
     * @description 获取 HTML 元素数组。
     * @returns {Array.<HTMLElement>} HTML 元素数组。
     */
    getElement: function () {
      const elements = [];

      for (let i = 0, len = arguments.length; i < len; i++) {
        let element = arguments[i];
        if (typeof element === "string") {
          element = document.getElementById(element);
        }
        if (arguments.length === 1) {
          return element
        }
        elements.push(element);
      }
      return elements
    },

    /**
     * @memberOf CommonUtil
     * @description instance of 的跨浏览器实现。
     * @param {Object} o - 对象。
     * @returns {boolean} 是否是页面元素。
     */
    isElement: function (o) {
      return !!(o && o.nodeType === 1)
    },

    /**
     * @memberOf CommonUtil
     * @description 判断一个对象是否是数组。
     * @param {Object} a - 对象。
     * @returns {boolean} 是否是数组。
     */
    isArray: function (a) {
      return Object.prototype.toString.call(a) === "[object Array]"
    },

    /**
     * @memberOf CommonUtil
     * @description 从数组中删除某一项。
     * @param {Array} array - 数组。
     * @param {Object} item - 数组中要删除的一项。
     * @returns {Array} 执行删除操作后的数组。
     */
    removeItem: function (array, item) {
      for (let i = array.length - 1; i >= 0; i--) {
        if (array[i] === item) {
          array.splice(i, 1);
          // break;more than once??
        }
      }
      return array
    },

    /**
     * @memberOf CommonUtil
     * @description 获取某对象在数组中的索引值。
     * @param {Array.<Object>} array - 数组。
     * @param {Object} obj - 对象。
     * @returns {number} 某对象在数组中的索引值。
     */
    indexOf: function (array, obj) {
      if (array == null) {
        return -1
      } else {
        // use the build-in function if available.
        if (typeof array.indexOf === "function") {
          return array.indexOf(obj)
        } else {
          for (let i = 0, len = array.length; i < len; i++) {
            if (array[i] === obj) {
              return i
            }
          }
          return -1
        }
      }
    },

    /**
     * @memberOf CommonUtil
     * @description 修改某 DOM 元素的许多属性。
     * @param {HTMLElement} element - 待修改的 DOM 元素。
     * @param {string} [id] - DOM 元素的 ID。
     * @param {Pixel} [px] - DOM 元素的 style 属性的 left 和 top 属性。
     * @param {Size} [sz] - DOM 元素的 width 和 height 属性。
     * @param {string} [position] - DOM 元素的 position 属性。
     * @param {string} [border] - DOM 元素的 style 属性的 border 属性。
     * @param {string} [overflow] - DOM 元素的 style 属性的 overflow 属性。
     * @param {number} [opacity] - 不透明度值。取值范围为(0.0 - 1.0)。
     */
    modifyDOMElement: function (element, id, px, sz, position, border, overflow, opacity) {
      if (id) {
        element.id = id;
      }
      if (px) {
        element.style.left = px.x + "px";
        element.style.top = px.y + "px";
      }
      if (sz) {
        element.style.width = sz.w + "px";
        element.style.height = sz.h + "px";
      }
      if (position) {
        element.style.position = position;
      }
      if (border) {
        element.style.border = border;
      }
      if (overflow) {
        element.style.overflow = overflow;
      }
      if (parseFloat(opacity) >= 0.0 && parseFloat(opacity) < 1.0) {
        element.style.filter = "alpha(opacity=" + opacity * 100 + ")";
        element.style.opacity = opacity;
      } else if (parseFloat(opacity) === 1.0) {
        element.style.filter = "";
        element.style.opacity = "";
      }
    },

    /**
     * @memberOf CommonUtil
     * @description 比较两个对象并合并。
     * @param {Object} [to] - 目标对象。
     * @param {Object} from - 源对象。
     * @returns {Object} 返回合并后的对象。
     */
    applyDefaults: function (to, from) {
      to = to || {};
      /*
       * FF/Windows < 2.0.0.13 reports "Illegal operation on WrappedNative
       * prototype object" when calling hawOwnProperty if the source object is an
       * instance of window.Event.
       */
      const fromIsEvt = typeof window.Event === "function" && from instanceof window.Event;

      for (const key in from) {
        if (to[key] === undefined || (!fromIsEvt && from.hasOwnProperty && from.hasOwnProperty(key) && !to.hasOwnProperty(key))) {
          to[key] = from[key];
        }
      }
      /**
       * IE doesn't include the toString property when iterating over an object's
       * properties with the for(property in object) syntax.  Explicitly check if
       * the source has its own toString property.
       */
      if (!fromIsEvt && from && from.hasOwnProperty && from.hasOwnProperty("toString") && !to.hasOwnProperty("toString")) {
        to.toString = from.toString;
      }

      return to
    },

    /**
     * @memberOf CommonUtil
     * @description 将参数对象转换为 HTTP 的 GET 请求中的参数字符串。例如："key1=value1&key2=value2&key3=value3"。
     * @param {Object} params - 参数对象。
     * @returns {string} HTTP 的 GET 请求中的参数字符串。
     */
    getParameterString: function (params) {
      const paramsArray = [];

      for (const key in params) {
        const value = params[key];
        if (value != null && typeof value !== "function") {
          let encodedValue;
          if (Array.isArray(value) || value.toString() === "[object Object]") {
            encodedValue = encodeURIComponent(JSON.stringify(value));
          } else {
            /* value is a string; simply encode */
            encodedValue = encodeURIComponent(value);
          }
          paramsArray.push(encodeURIComponent(key) + "=" + encodedValue);
        }
      }

      return paramsArray.join("&")
    },

    /**
     * @memberOf CommonUtil
     * @description 给 URL 追加查询参数。
     * @param {string} url - 待追加参数的 URL 字符串。
     * @param {string} paramStr - 待追加的查询参数。
     * @returns {string} 新的 URL。
     */
    urlAppend: function (url, paramStr) {
      let newUrl = url;
      if (paramStr) {
        if (paramStr.indexOf("?") === 0) {
          paramStr = paramStr.substring(1);
        }
        const parts = (url + " ").split(/[?&]/);
        // eslint-disable-next-line no-nested-ternary
        newUrl += parts.pop() === " " ? paramStr : parts.length ? "&" + paramStr : "?" + paramStr;
      }
      return newUrl
    },

    /**
     * @memberOf CommonUtil
     * @description 给 URL 追加 path 参数。
     * @param {string} url - 待追加参数的 URL 字符串。
     * @param {string} paramStr - 待追加的path参数。
     * @returns {string} 新的 URL。
     */
    urlPathAppend: function (url, pathStr) {
      let newUrl = url;
      if (!pathStr) {
        return newUrl
      }
      if (pathStr.indexOf("/") === 0) {
        pathStr = pathStr.substring(1);
      }
      const parts = url.split("?");
      if (parts[0].indexOf("/", parts[0].length - 1) < 0) {
        parts[0] += "/";
      }
      newUrl = `${parts[0]}${pathStr}${parts.length > 1 ? `?${parts[1]}` : ""}`;
      return newUrl
    },

    /**
     * @memberOf CommonUtil
     * @description 为了避免浮点精度错误而保留的有效位数。
     * @type {number}
     * @default 14
     */
    DEFAULT_PRECISION: 14,

    /**
     * @memberOf CommonUtil
     * @description 将字符串以接近的精度转换为数字。
     * @param {string} number - 字符串。
     * @param {number} [precision=14] - 精度。
     * @returns {number} 转化后的数字。
     */
    toFloat: function (number, precision) {
      if (precision == null) {
        precision = Util.DEFAULT_PRECISION;
      }
      if (typeof number !== "number") {
        number = parseFloat(number);
      }
      return precision === 0 ? number : parseFloat(number.toPrecision(precision))
    },

    /**
     * @memberOf CommonUtil
     * @description 角度转弧度。
     * @param {number} x - 角度。
     * @returns {number} 转化后的弧度。
     */
    rad: function (x) {
      return (x * Math.PI) / 180
    },

    /**
     * @memberOf CommonUtil
     * @description 从 URL 字符串中解析出参数对象。
     * @param {string} url - URL。
     * @returns {Object} 解析出的参数对象。
     */
    getParameters: function (url) {
      // if no url specified, take it from the location bar
      url = url === null || url === undefined ? window.location.href : url;

      // parse out parameters portion of url string
      let paramsString = "";
      if (StringExt.contains(url, "?")) {
        const start = url.indexOf("?") + 1;
        const end = StringExt.contains(url, "#") ? url.indexOf("#") : url.length;
        paramsString = url.substring(start, end);
      }

      const parameters = {};
      const pairs = paramsString.split(/[&;]/);
      for (let i = 0, len = pairs.length; i < len; ++i) {
        const keyValue = pairs[i].split("=");
        if (keyValue[0]) {
          let key = keyValue[0];
          try {
            key = decodeURIComponent(key);
          } catch (err) {
            key = unescape(key);
          }

          // being liberal by replacing "+" with " "
          let value = (keyValue[1] || "").replace(/\+/g, " ");

          try {
            value = decodeURIComponent(value);
          } catch (err) {
            value = unescape(value);
          }

          // follow OGC convention of comma delimited values
          value = value.split(",");

          // if there's only one value, do not return as array
          if (value.length == 1) {
            value = value[0];
          }

          parameters[key] = value;
        }
      }
      return parameters
    },

    /**
     * @memberOf CommonUtil
     * @description 不断递增计数变量，用于生成唯一 ID。
     * @type {number}
     * @default 0
     */
    lastSeqID: 0,

    /**
     * @memberOf CommonUtil
     * @description 创建唯一 ID 值。
     * @param {string} [prefix] - 前缀。
     * @returns {string} 唯一的 ID 值。
     */
    createUniqueID: function (prefix) {
      if (prefix == null) {
        prefix = "id_";
      }
      Util.lastSeqID += 1;
      return prefix + Util.lastSeqID
    },

    /**
     * @memberOf CommonUtil
     * @description 判断并转化比例尺。
     * @param {number} scale - 比例尺。
     * @returns {number} 正常的 scale 值。
     */
    normalizeScale: function (scale) {
      const normScale = scale > 1.0 ? 1.0 / scale : scale;
      return normScale
    },

    /**
     * @memberOf CommonUtil
     * @description 比例尺转分辨率。
     * @param {number} scale - 比例尺。
     * @param {string} [units='degrees'] - 比例尺单位。
     * @returns {number} 转化后的分辨率。
     */
    getResolutionFromScale: function (scale, units) {
      let resolution;
      if (scale) {
        if (units == null) {
          units = "degrees";
        }
        const normScale = Util.normalizeScale(scale);
        resolution = 1 / (normScale * INCHES_PER_UNIT[units] * DOTS_PER_INCH);
      }
      return resolution
    },

    /**
     * @memberOf CommonUtil
     * @description 分辨率转比例尺。
     * @param {number} resolution - 分辨率。
     * @param {string} [units='degrees'] - 分辨率单位。
     * @returns {number} 转化后的比例尺。
     */
    getScaleFromResolution: function (resolution, units) {
      if (units == null) {
        units = "degrees";
      }

      const scale = resolution * INCHES_PER_UNIT[units] * DOTS_PER_INCH;
      return scale
    },

    /**
     * @memberOf CommonUtil
     * @description 获取浏览器相关信息。支持的浏览器包括：Opera，Internet Explorer，Safari，Firefox。
     * @returns {Object} 浏览器名称、版本、设备名称。对应的属性分别为 name, version, device。
     */
    getBrowser: function () {
      return Browser
    },

    /**
     * @memberOf CommonUtil
     * @description 浏览器是否支持 Canvas。
     * @returns {boolean} 当前浏览器是否支持 HTML5 Canvas。
     */
    isSupportCanvas,

    /**
     * @memberOf CommonUtil
     * @description 判断；浏览器是否支持 Canvas。
     * @returns {boolean} 当前浏览器是否支持 HTML5 Canvas 。
     */
    supportCanvas: function () {
      return Util.isSupportCanvas
    },

    /**
     * @memberOf CommonUtil
     * @description 判断一个 URL 请求是否在当前域中。
     * @param {string} url - URL 请求字符串。
     * @returns {boolean} URL 请求是否在当前域中。
     */
    isInTheSameDomain: function (url) {
      if (!url) {
        return true
      }
      let index = url.indexOf("//");
      const documentUrl = document.location.toString();
      let documentIndex = documentUrl.indexOf("//");
      if (index === -1) {
        return true
      } else {
        let protocol;
        let substring = (protocol = url.substring(0, index));
        const documentSubString = documentUrl.substring(documentIndex + 2);
        documentIndex = documentSubString.indexOf("/");
        const documentPortIndex = documentSubString.indexOf(":");
        let documentDomainWithPort = documentSubString.substring(0, documentIndex);
        // let documentPort;

        const documentprotocol = document.location.protocol;
        if (documentPortIndex !== -1) ; else {
          documentDomainWithPort += ":" + (documentprotocol.toLowerCase() === "http:" ? 80 : 443);
        }
        if (documentprotocol.toLowerCase() !== substring.toLowerCase()) {
          return false
        }
        substring = url.substring(index + 2);
        const portIndex = substring.indexOf(":");
        index = substring.indexOf("/");
        let domainWithPort = substring.substring(0, index);
        let domain;
        if (portIndex !== -1) {
          domain = substring.substring(0, portIndex);
        } else {
          domain = substring.substring(0, index);
          domainWithPort += ":" + (protocol.toLowerCase() === "http:" ? 80 : 443);
        }
        const documentDomain = document.domain;
        if (domain === documentDomain && domainWithPort === documentDomainWithPort) {
          return true
        }
      }
      return false
    },

    /**
     * @memberOf CommonUtil
     * @description 计算 iServer 服务的 REST 图层的显示分辨率，需要从 iServer 的 REST 图层表述中获取 viewBounds、viewer、scale、coordUnit、datumAxis 五个参数，来进行计算。
     * @param {Bounds} viewBounds - 地图的参照可视范围，即地图初始化时默认的地图显示范围。
     * @param {Size} viewer - 地图初始化时默认的地图图片的尺寸。
     * @param {number} scale - 地图初始化时默认的显示比例尺。
     * @param {string} [coordUnit='degrees'] - 投影坐标系统的地图单位。
     * @param {number} [datumAxis=6378137] - 地理坐标系统椭球体长半轴。用户自定义地图的 Options 时，若未指定该参数的值，则系统默认为 WGS84 参考系的椭球体长半轴 6378137。
     * @returns {number} 图层显示分辨率。
     */
    calculateDpi: function (viewBounds, viewer, scale, coordUnit, datumAxis) {
      // 10000 是 0.1毫米与米的转换。DPI的计算公式：Viewer / DPI *  0.0254 * 10000 = ViewBounds * scale ，公式中的10000是为了提高计算结果的精度，以下出现的ratio皆为如此。
      if (!viewBounds || !viewer || !scale) {
        return
      }
      const ratio = 10000;
      const rvbWidth = viewBounds.getWidth();
      const rvbHeight = viewBounds.getHeight();
      const rvWidth = viewer.w;
      const rvHeight = viewer.h;
      // 用户自定义地图的Options时，若未指定该参数的值，则系统默认为6378137米，即WGS84参考系的椭球体长半轴。
      datumAxis = datumAxis || 6378137;
      coordUnit = coordUnit || "degrees";
      let dpi;
      if (coordUnit.toLowerCase() === "degree" || coordUnit.toLowerCase() === "degrees" || coordUnit.toLowerCase() === "dd") {
        const num1 = rvbWidth / rvWidth;
        const num2 = rvbHeight / rvHeight;
        const resolution = num1 > num2 ? num1 : num2;
        dpi = (0.0254 * ratio) / resolution / scale / ((Math.PI * 2 * datumAxis) / 360) / ratio;
      } else {
        const resolution = rvbWidth / rvWidth;
        dpi = (0.0254 * ratio) / resolution / scale / ratio;
      }
      return dpi
    },

    /**
     * @memberOf CommonUtil
     * @description 将对象转换成 JSON 字符串。
     * @param {Object} obj - 要转换成 JSON 的 Object 对象。
     * @returns {string} 转换后的 JSON 对象。
     */
    toJSON: function (obj) {
      let objInn = obj;
      if (objInn == null) {
        return null
      }
      switch (objInn.constructor) {
        case String:
          // s = "'" + str.replace(/(["\\])/g, "\\$1") + "'";   string含有单引号出错
          objInn = '"' + objInn.replace(/(["\\])/g, "\\$1") + '"';
          objInn = objInn.replace(/\n/g, "\\n");
          objInn = objInn.replace(/\r/g, "\\r");
          objInn = objInn.replace("<", "&lt;");
          objInn = objInn.replace(">", "&gt;");
          objInn = objInn.replace(/%/g, "%25");
          objInn = objInn.replace(/&/g, "%26");
          return objInn
        case Array: {
          let arr = "";
          for (let i = 0, len = objInn.length; i < len; i++) {
            arr += Util.toJSON(objInn[i]);
            if (i !== objInn.length - 1) {
              arr += ",";
            }
          }
          return "[" + arr + "]"
        }
        case Number:
          return isFinite(objInn) ? String(objInn) : null
        case Boolean:
          return String(objInn)
        case Date: {
          let dateStr =
            "{" +
            "'__type':\"System.DateTime\"," +
            "'Year':" +
            objInn.getFullYear() +
            "," +
            "'Month':" +
            (objInn.getMonth() + 1) +
            "," +
            "'Day':" +
            objInn.getDate() +
            "," +
            "'Hour':" +
            objInn.getHours() +
            "," +
            "'Minute':" +
            objInn.getMinutes() +
            "," +
            "'Second':" +
            objInn.getSeconds() +
            "," +
            "'Millisecond':" +
            objInn.getMilliseconds() +
            "," +
            "'TimezoneOffset':" +
            objInn.getTimezoneOffset() +
            "}";
          return dateStr
        }

        default:
          if (objInn.toJSON != null && typeof objInn.toJSON === "function") {
            return objInn.toJSON()
          }
          if (typeof objInn === "object") {
            if (objInn.length) {
              const arr = [];
              for (let i = 0, len = objInn.length; i < len; i++) {
                arr.push(Util.toJSON(objInn[i]));
              }
              return "[" + arr.join(",") + "]"
            }
            const arr = [];
            for (const attr in objInn) {
              // 为解决Geometry类型头json时堆栈溢出的问题，attr == "parent"时不进行json转换
              if (typeof objInn[attr] !== "function" && attr !== "CLASS_NAME" && attr !== "parent") {
                arr.push("'" + attr + "':" + Util.toJSON(objInn[attr]));
              }
            }

            if (arr.length > 0) {
              return "{" + arr.join(",") + "}"
            } else {
              return "{}"
            }
          }
          return objInn.toString()
      }
    },

    /**
     * @memberOf CommonUtil
     * @description 根据比例尺和 dpi 计算屏幕分辨率。
     * @category BaseTypes Util
     * @param {number} scale - 比例尺。
     * @param {number} dpi - 图像分辨率，表示每英寸内的像素个数。
     * @param {string} [coordUnit] - 投影坐标系统的地图单位。
     * @param {number} [datumAxis=6378137] - 地理坐标系统椭球体长半轴。用户自定义地图的 Options 时，若未指定该参数的值，则 DPI 默认按照 WGS84 参考系的椭球体长半轴 6378137 来计算。
     * @returns {number} 当前比例尺下的屏幕分辨率。
     */
    getResolutionFromScaleDpi: function (scale, dpi, coordUnit, datumAxis) {
      let resolution = null;
      const ratio = 10000;
      // 用户自定义地图的Options时，若未指定该参数的值，则系统默认为6378137米，即WGS84参考系的椭球体长半轴。
      datumAxis = datumAxis || 6378137;
      coordUnit = coordUnit || "";
      if (scale > 0 && dpi > 0) {
        scale = Util.normalizeScale(scale);
        if (coordUnit.toLowerCase() === "degree" || coordUnit.toLowerCase() === "degrees" || coordUnit.toLowerCase() === "dd") {
          // scale = Util.normalizeScale(scale);
          resolution = (0.0254 * ratio) / dpi / scale / ((Math.PI * 2 * datumAxis) / 360) / ratio;
          return resolution
        } else {
          resolution = (0.0254 * ratio) / dpi / scale / ratio;
          return resolution
        }
      }
      return -1
    },

    /**
     * @memberOf CommonUtil
     * @description 根据 resolution、dpi、coordUnit 和 datumAxis 计算比例尺。
     * @param {number} resolution - 用于计算比例尺的地图分辨率。
     * @param {number} dpi - 图像分辨率，表示每英寸内的像素个数。
     * @param {string} [coordUnit] - 投影坐标系统的地图单位。
     * @param {number} [datumAxis=6378137] - 地理坐标系统椭球体长半轴。用户自定义地图的 Options 时，若未指定该参数的值，则 DPI 默认按照 WGS84 参考系的椭球体长半轴 6378137 来计算。
     * @returns {number} 当前屏幕分辨率下的比例尺。
     */
    getScaleFromResolutionDpi: function (resolution, dpi, coordUnit, datumAxis) {
      let scale = null;
      const ratio = 10000;
      // 用户自定义地图的Options时，若未指定该参数的值，则系统默认为6378137米，即WGS84参考系的椭球体长半轴。
      datumAxis = datumAxis || 6378137;
      coordUnit = coordUnit || "";
      if (resolution > 0 && dpi > 0) {
        if (coordUnit.toLowerCase() === "degree" || coordUnit.toLowerCase() === "degrees" || coordUnit.toLowerCase() === "dd") {
          scale = (0.0254 * ratio) / dpi / resolution / ((Math.PI * 2 * datumAxis) / 360) / ratio;
          return scale
        } else {
          scale = (0.0254 * ratio) / dpi / resolution / ratio;
          return scale
        }
      }
      return -1
    },

    /**
     * @memberOf CommonUtil
     * @description 转换查询结果。
     * @param {Object} result - 查询结果。
     * @returns {Object} 转换后的查询结果。
     */
    transformResult: function (result) {
      if (result.responseText && typeof result.responseText === "string") {
        result = JSON.parse(result.responseText);
      }
      return result
    },

    /**
     * @memberOf CommonUtil
     * @description 属性拷贝，不拷贝方法类名(CLASS_NAME)等。
     * @param {Object} [destination] - 拷贝目标。
     * @param {Object} source - 源对象。
     *
     */
    copyAttributes: function (destination, source) {
      destination = destination || {};
      if (source) {
        for (const property in source) {
          const value = source[property];
          if (value !== undefined && property !== "CLASS_NAME" && typeof value !== "function") {
            destination[property] = value;
          }
        }
      }
      return destination
    },

    /**
     * @memberOf CommonUtil
     * @description 将源对象上的属性拷贝到目标对象上。（不拷贝 CLASS_NAME 和方法）
     * @param {Object} [destination] - 目标对象。
     * @param {Object} source - 源对象。
     * @param {Array.<string>} clip - 源对象中禁止拷贝到目标对象的属性，目的是防止目标对象上不可修改的属性被篡改。
     *
     */
    copyAttributesWithClip: function (destination, source, clip) {
      destination = destination || {};
      if (source) {
        for (const property in source) {
          // 去掉禁止拷贝的属性
          let isInClip = false;
          if (clip && clip.length) {
            for (let i = 0, len = clip.length; i < len; i++) {
              if (property === clip[i]) {
                isInClip = true;
                break
              }
            }
          }
          if (isInClip === true) {
            continue
          }

          const value = source[property];
          if (value !== undefined && property !== "CLASS_NAME" && typeof value !== "function") {
            destination[property] = value;
          }
        }
      }
      return destination
    },

    /**
     * @memberOf CommonUtil
     * @description 克隆一个 Object 对象
     * @param {Object} obj - 需要克隆的对象。
     * @returns {Object} 对象的拷贝对象，注意是新的对象，不是指向。
     */
    cloneObject: function (obj) {
      // Handle the 3 simple types, and null or undefined
      if (obj === null || typeof obj !== "object") {
        return obj
      }

      // Handle Date
      if (obj instanceof Date) {
        const copy = new Date();
        copy.setTime(obj.getTime());
        return copy
      }

      // Handle Array
      if (obj instanceof Array) {
        const copy = obj.slice(0);
        return copy
      }

      // Handle Object
      if (obj instanceof Object) {
        const copy = {};
        for (const attr in obj) {
          if (obj.hasOwnProperty(attr)) {
            copy[attr] = Util.cloneObject(obj[attr]);
          }
        }
        return copy
      }

      throw new Error("Unable to copy obj! Its type isn't supported.")
    },

    /**
     * @memberOf CommonUtil
     * @description 判断两条线段是不是有交点。
     * @param {GeometryPoint} a1 - 第一条线段的起始节点。
     * @param {GeometryPoint} a2 - 第一条线段的结束节点。
     * @param {GeometryPoint} b1 - 第二条线段的起始节点。
     * @param {GeometryPoint} b2 - 第二条线段的结束节点。
     * @returns {Object} 如果相交返回交点，如果不相交返回两条线段的位置关系。
     */
    lineIntersection: function (a1, a2, b1, b2) {
      let intersectValue = null;
      let k1;
      let k2;
      const b = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
      const a = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
      const ab = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
      // ab==0代表两条线断的斜率一样
      if (ab != 0) {
        k1 = b / ab;
        k2 = a / ab;

        if (k1 >= 0 && k2 <= 1 && k1 <= 1 && k2 >= 0) {
          intersectValue = new Geometry.Point(a1.x + k1 * (a2.x - a1.x), a1.y + k1 * (a2.y - a1.y));
        } else {
          intersectValue = "No Intersection";
        }
      } else {
        if (b == 0 && a == 0) {
          const maxy = Math.max(a1.y, a2.y);
          const miny = Math.min(a1.y, a2.y);
          const maxx = Math.max(a1.x, a2.x);
          const minx = Math.min(a1.x, a2.x);
          if ((((b1.y >= miny && b1.y <= maxy) || (b2.y >= miny && b2.y <= maxy)) && b1.x >= minx && b1.x <= maxx) || (b2.x >= minx && b2.x <= maxx)) {
            intersectValue = "Coincident"; // 重合
          } else {
            intersectValue = "Parallel"; // 平行
          }
        } else {
          intersectValue = "Parallel"; // 平行
        }
      }
      return intersectValue
    },

    /**
     * @memberOf CommonUtil
     * @description 获取文本外接矩形宽度与高度。
     * @param {ThemeStyle} style - 文本样式。
     * @param {string} text - 文本内容。
     * @param {Object} element - DOM 元素。
     * @returns {Object} 裁剪后的宽度，高度信息。
     */
    getTextBounds: function (style, text, element) {
      document.body.appendChild(element);
      element.style.width = "auto";
      element.style.height = "auto";
      if (style.fontSize) {
        element.style.fontSize = style.fontSize;
      }
      if (style.fontFamily) {
        element.style.fontFamily = style.fontFamily;
      }
      if (style.fontWeight) {
        element.style.fontWeight = style.fontWeight;
      }
      element.style.position = "relative";
      element.style.visibility = "hidden";
      // fix 在某些情况下，element内的文本变成竖起排列，导致宽度计算不正确的bug
      element.style.display = "inline-block";
      element.innerHTML = text;
      const textWidth = element.clientWidth;
      const textHeight = element.clientHeight;
      document.body.removeChild(element);
      return {
        textWidth: textWidth,
        textHeight: textHeight
      }
    },
    /**
     * @memberOf CommonUtil
     * @description 获取转换后的path路径。
     * @param {string} path - 待转换的path, 包含`{param}`。
     * @param {Object} pathParams - path中待替换的参数。
     * @returns {string} 转换后的path路径
     */
    convertPath: function (path, pathParams) {
      if (!pathParams) {
        return path
      }
      return path.replace(/\{([\w-\.]+)\}/g, (fullMatch, key) => {
        let value;
        if (pathParams.hasOwnProperty(key)) {
          value = paramToString(pathParams[key]);
        } else {
          value = fullMatch;
        }
        return encodeURIComponent(value)
      })
    }
  };

  /**
   * @enum INCHES_PER_UNIT
   * @description 每单位的英尺数。
   * @type {number}
   * @private
   */
  const INCHES_PER_UNIT = {
    inches: 1.0,
    ft: 12.0,
    mi: 63360.0,
    m: 39.3701,
    km: 39370.1,
    dd: 4374754,
    yd: 36
  };
  INCHES_PER_UNIT.in = INCHES_PER_UNIT.inches;
  INCHES_PER_UNIT.degrees = INCHES_PER_UNIT.dd;
  INCHES_PER_UNIT.nmi = 1852 * INCHES_PER_UNIT.m;

  // Units from CS-Map
  const METERS_PER_INCH = 0.0254000508001016002;
  Util.extend(INCHES_PER_UNIT, {
    Inch: INCHES_PER_UNIT.inches,
    Meter: 1.0 / METERS_PER_INCH, // EPSG:9001
    Foot: 0.30480060960121920243 / METERS_PER_INCH, // EPSG:9003
    IFoot: 0.3048 / METERS_PER_INCH, // EPSG:9002
    ClarkeFoot: 0.3047972651151 / METERS_PER_INCH, // EPSG:9005
    SearsFoot: 0.30479947153867624624 / METERS_PER_INCH, // EPSG:9041
    GoldCoastFoot: 0.30479971018150881758 / METERS_PER_INCH, // EPSG:9094
    IInch: 0.0254 / METERS_PER_INCH,
    MicroInch: 0.0000254 / METERS_PER_INCH,
    Mil: 0.0000000254 / METERS_PER_INCH,
    Centimeter: 0.01 / METERS_PER_INCH,
    Kilometer: 1000.0 / METERS_PER_INCH, // EPSG:9036
    Yard: 0.91440182880365760731 / METERS_PER_INCH,
    SearsYard: 0.914398414616029 / METERS_PER_INCH, // EPSG:9040
    IndianYard: 0.91439853074444079983 / METERS_PER_INCH, // EPSG:9084
    IndianYd37: 0.91439523 / METERS_PER_INCH, // EPSG:9085
    IndianYd62: 0.9143988 / METERS_PER_INCH, // EPSG:9086
    IndianYd75: 0.9143985 / METERS_PER_INCH, // EPSG:9087
    IndianFoot: 0.30479951 / METERS_PER_INCH, // EPSG:9080
    IndianFt37: 0.30479841 / METERS_PER_INCH, // EPSG:9081
    IndianFt62: 0.3047996 / METERS_PER_INCH, // EPSG:9082
    IndianFt75: 0.3047995 / METERS_PER_INCH, // EPSG:9083
    Mile: 1609.34721869443738887477 / METERS_PER_INCH,
    IYard: 0.9144 / METERS_PER_INCH, // EPSG:9096
    IMile: 1609.344 / METERS_PER_INCH, // EPSG:9093
    NautM: 1852.0 / METERS_PER_INCH, // EPSG:9030
    "Lat-66": 110943.316488932731 / METERS_PER_INCH,
    "Lat-83": 110946.25736872234125 / METERS_PER_INCH,
    Decimeter: 0.1 / METERS_PER_INCH,
    Millimeter: 0.001 / METERS_PER_INCH,
    Dekameter: 10.0 / METERS_PER_INCH,
    Decameter: 10.0 / METERS_PER_INCH,
    Hectometer: 100.0 / METERS_PER_INCH,
    GermanMeter: 1.0000135965 / METERS_PER_INCH, // EPSG:9031
    CaGrid: 0.999738 / METERS_PER_INCH,
    ClarkeChain: 20.1166194976 / METERS_PER_INCH, // EPSG:9038
    GunterChain: 20.11684023368047 / METERS_PER_INCH, // EPSG:9033
    BenoitChain: 20.116782494375872 / METERS_PER_INCH, // EPSG:9062
    SearsChain: 20.11676512155 / METERS_PER_INCH, // EPSG:9042
    ClarkeLink: 0.201166194976 / METERS_PER_INCH, // EPSG:9039
    GunterLink: 0.2011684023368047 / METERS_PER_INCH, // EPSG:9034
    BenoitLink: 0.20116782494375872 / METERS_PER_INCH, // EPSG:9063
    SearsLink: 0.2011676512155 / METERS_PER_INCH, // EPSG:9043
    Rod: 5.02921005842012 / METERS_PER_INCH,
    IntnlChain: 20.1168 / METERS_PER_INCH, // EPSG:9097
    IntnlLink: 0.201168 / METERS_PER_INCH, // EPSG:9098
    Perch: 5.02921005842012 / METERS_PER_INCH,
    Pole: 5.02921005842012 / METERS_PER_INCH,
    Furlong: 201.1684023368046 / METERS_PER_INCH,
    Rood: 3.778266898 / METERS_PER_INCH,
    CapeFoot: 0.3047972615 / METERS_PER_INCH,
    Brealey: 375.0 / METERS_PER_INCH,
    ModAmFt: 0.304812252984505969011938 / METERS_PER_INCH,
    Fathom: 1.8288 / METERS_PER_INCH,
    "NautM-UK": 1853.184 / METERS_PER_INCH,
    "50kilometers": 50000.0 / METERS_PER_INCH,
    "150kilometers": 150000.0 / METERS_PER_INCH
  });

  // unit abbreviations supported by PROJ.4
  Util.extend(INCHES_PER_UNIT, {
    mm: INCHES_PER_UNIT.Meter / 1000.0,
    cm: INCHES_PER_UNIT.Meter / 100.0,
    dm: INCHES_PER_UNIT.Meter * 100.0,
    km: INCHES_PER_UNIT.Meter * 1000.0,
    kmi: INCHES_PER_UNIT.nmi, // International Nautical Mile
    fath: INCHES_PER_UNIT.Fathom, // International Fathom
    ch: INCHES_PER_UNIT.IntnlChain, // International Chain
    link: INCHES_PER_UNIT.IntnlLink, // International Link
    "us-in": INCHES_PER_UNIT.inches, // U.S. Surveyor's Inch
    "us-ft": INCHES_PER_UNIT.Foot, // U.S. Surveyor's Foot
    "us-yd": INCHES_PER_UNIT.Yard, // U.S. Surveyor's Yard
    "us-ch": INCHES_PER_UNIT.GunterChain, // U.S. Surveyor's Chain
    "us-mi": INCHES_PER_UNIT.Mile, // U.S. Surveyor's Statute Mile
    "ind-yd": INCHES_PER_UNIT.IndianYd37, // Indian Yard
    "ind-ft": INCHES_PER_UNIT.IndianFt37, // Indian Foot
    "ind-ch": 20.11669506 / METERS_PER_INCH // Indian Chain
  });

  // 将服务端的地图单位转成SuperMap的地图单位
  INCHES_PER_UNIT.degree = INCHES_PER_UNIT.dd;
  INCHES_PER_UNIT.meter = INCHES_PER_UNIT.m;
  INCHES_PER_UNIT.foot = INCHES_PER_UNIT.ft;
  INCHES_PER_UNIT.inch = INCHES_PER_UNIT.inches;
  INCHES_PER_UNIT.mile = INCHES_PER_UNIT.mi;
  INCHES_PER_UNIT.kilometer = INCHES_PER_UNIT.km;
  INCHES_PER_UNIT.yard = INCHES_PER_UNIT.yd;

  function paramToString(param) {
    if (param == undefined || param == null) {
      return ""
    }
    if (param instanceof Date) {
      return param.toJSON()
    }
    if (canBeJsonified(param)) {
      return JSON.stringify(param)
    }

    return param.toString()
  }

  function canBeJsonified(str) {
    if (typeof str !== "string" && typeof str !== "object") {
      return false
    }
    try {
      const type = str.toString();
      return type === "[object Object]" || type === "[object Array]"
    } catch (err) {
      return false
    }
  }

  /* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
   * This program are made available under the terms of the Apache License, Version 2.0
   * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html. */

  /**
   * @class Feature
   * @deprecatedclass SuperMap.Feature
   * @category BaseTypes Geometry
   * @classdesc 要素类组合了地理和属性，Feature 类同时具有 marker 和 lonlat 属性。
   * @param {SuperMap.Layer} layer - 图层。
   * @param {LonLat} lonlat - 经纬度。
   * @param {Object} data - 数据对象。
   * @usage
   */
  class Feature {
    constructor(layer, lonlat, data) {
      this.CLASS_NAME = "SuperMap.Feature";
      /**
       * @deprecated
       * @member {SuperMap.Layer} Feature.prototype.layer
       * @description 图层。
       */
      this.layer = layer;

      /**
       * @member {string} Feature.prototype.id
       * @description 要素 ID。
       */
      this.id = Util.createUniqueID(this.CLASS_NAME + "_");

      /**
       * @member {LonLat} Feature.prototype.lonlat
       * @description 经纬度。
       *
       */
      this.lonlat = lonlat;

      /**
       * @member {Object} Feature.prototype.data
       * @description 数据对象。
       */
      this.data = data != null ? data : {};
    }

    /**
     * @function Feature.prototype.destroy
     * @description 释放相关资源。
     */
    destroy() {
      this.id = null;
      this.lonlat = null;
      this.data = null;
    }
  }

  /* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
   * This program are made available under the terms of the Apache License, Version 2.0
   * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html. */

  /**
   * @class FeatureVector
   * @aliasclass Feature.Vector
   * @deprecatedclass SuperMap.Feature.Vector
   * @category BaseTypes Geometry
   * @classdesc 矢量要素类。该类具有 Geometry 属性存放几何信息，
   * attributes 属性存放非几何信息，另外还包含了 style 属性，用来定义矢量要素的样式，
   * 其中，默认的样式在 {@link FeatureVector.style} 类中定义，如果没有特别的指定将使用默认的样式。
   * @extends {Feature}
   * @param {Geometry} geometry - 要素的几何信息。
   * @param {Object} [attributes] - 描述要素的任意的可序列化属性，将要映射到 attributes 属性中的对象。
   * @param {Object} [style] - 样式对象。
   * @example
   * var geometry = new GeometryPoint(-115,10);
   *  var style = {
   *      strokeColor:"#339933",
   *      strokeOpacity:1,
   *      strokeWidth:3,
   *      pointRadius:6
   *  }
   *  var pointFeature = new FeatureVector(geometry,null,style);
   *  vectorLayer.addFeatures(pointFeature);
   * @usage
   */
  // TRASH THIS
  const State = {
    /** states */
    UNKNOWN: "Unknown",
    INSERT: "Insert",
    UPDATE: "Update",
    DELETE: "Delete"
  };
  class Vector extends Feature {
    constructor(geometry, attributes, style) {
      super(null, null, attributes);
      /**
       * @member {string} FeatureVector.prototype.fid
       * @description fid
       */
      this.fid = null;

      /**
       * @member {Geometry} FeatureVector.prototype.geometry
       * @description 存放几何信息。
       */
      this.geometry = geometry || null;

      /**
       * @member {Object} FeatureVector.prototype.attributes
       * @description 描述要素的任意的可序列化属性。
       */
      this.attributes = {};

      if (attributes) {
        this.attributes = Util.extend(this.attributes, attributes);
      }

      /**
       * @member {Bounds} FeatureVector.prototype.bounds
       * @description 限制要素几何的边界。
       */
      this.bounds = null;

      /**
       * @member {string} FeatureVector.prototype.state
       * @description state
       */
      this.state = null;

      /**
       * @member {Object} FeatureVector.prototype.style
       * @description 要素的样式属性，地图查询返回的 feature 的 style，8C 变为null。
       */
      this.style = style || null;

      /**
       * @member {string} FeatureVector.prototype.url
       * @description 如果设置了这个属性，在更新或者删除要素时需要考虑 {@link HTTP} 。
       */
      this.url = null;

      this.lonlat = null;

      this.CLASS_NAME = "SuperMap.Feature.Vector";

      Vector.style = {
        default: {
          fillColor: "#ee9900",
          fillOpacity: 0.4,
          hoverFillColor: "white",
          hoverFillOpacity: 0.8,
          strokeColor: "#ee9900",
          strokeOpacity: 1,
          strokeWidth: 1,
          strokeLinecap: "round",
          strokeDashstyle: "solid",
          hoverStrokeColor: "red",
          hoverStrokeOpacity: 1,
          hoverStrokeWidth: 0.2,
          pointRadius: 6,
          hoverPointRadius: 1,
          hoverPointUnit: "%",
          pointerEvents: "visiblePainted",
          cursor: "inherit",
          fontColor: "#000000",
          labelAlign: "cm",
          labelOutlineColor: "white",
          labelOutlineWidth: 3
        },
        select: {
          fillColor: "blue",
          fillOpacity: 0.4,
          hoverFillColor: "white",
          hoverFillOpacity: 0.8,
          strokeColor: "blue",
          strokeOpacity: 1,
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeDashstyle: "solid",
          hoverStrokeColor: "red",
          hoverStrokeOpacity: 1,
          hoverStrokeWidth: 0.2,
          pointRadius: 6,
          hoverPointRadius: 1,
          hoverPointUnit: "%",
          pointerEvents: "visiblePainted",
          cursor: "pointer",
          fontColor: "#000000",
          labelAlign: "cm",
          labelOutlineColor: "white",
          labelOutlineWidth: 3
        },
        temporary: {
          fillColor: "#66cccc",
          fillOpacity: 0.2,
          hoverFillColor: "white",
          hoverFillOpacity: 0.8,
          strokeColor: "#66cccc",
          strokeOpacity: 1,
          strokeLinecap: "round",
          strokeWidth: 2,
          strokeDashstyle: "solid",
          hoverStrokeColor: "red",
          hoverStrokeOpacity: 1,
          hoverStrokeWidth: 0.2,
          pointRadius: 6,
          hoverPointRadius: 1,
          hoverPointUnit: "%",
          pointerEvents: "visiblePainted",
          // cursor:"inherit",
          cursor: "default",
          fontColor: "#000000",
          labelAlign: "cm",
          labelOutlineColor: "white",
          labelOutlineWidth: 3
        },
        delete: {
          display: "none"
        }
      };
    }

    /**
     * @function FeatureVector.prototype.destroy
     * @description 释放资源，将引用资源的属性置空。
     */
    destroy() {
      if (this.layer) {
        this.layer.removeFeatures(this);
        this.layer = null;
      }

      this.geometry = null;
      super.destroy();
    }

    /**
     * @function FeatureVector.prototype.clone
     * @description 复制矢量要素，并返回复制后的新对象。
     * @returns {FeatureVector} 相同要素的新的矢量要素。
     */
    clone() {
      return new Vector(this.geometry ? this.geometry.clone() : null, this.attributes, this.style)
    }

    /**
     * @function FeatureVector.prototype.toState
     * @description 设置新状态。
     * @param {string} state - 状态。
     */
    toState(state) {
      if (state === State.UPDATE) {
        switch (this.state) {
          case State.UNKNOWN:
          case State.DELETE:
            this.state = state;
            break
        }
      } else if (state === State.INSERT) {
        switch (this.state) {
          case State.UNKNOWN:
            break
          default:
            this.state = state;
            break
        }
      } else if (state === State.DELETE) {
        switch (this.state) {
          case State.INSERT:
            // the feature should be destroyed
            break
          case State.DELETE:
            break
          case State.UNKNOWN:
          case State.UPDATE:
            this.state = state;
            break
        }
      } else if (state === State.UNKNOWN) {
        this.state = state;
      }
    }
  }
  /**
   *
   * @typedef {Object} FeatureVector.style
   * @description Feature 有大量的样式属性，如果没有特别的指定将使用默认的样式，
   * 大部分样式通过 SVG 标准定义属性。
   * - fill properties 资料介绍：{@link http://www.w3.org/TR/SVG/painting.html#FillProperties}
   * - stroke properties 资料介绍：{@link http://www.w3.org/TR/SVG/painting.html#StrokeProperties}
   * @property {boolean} [fill] - 不需要填充则设置为 false。
   * @property {string} [fillColor='#ee9900'] - 十六进制填充颜色。
   * @property {number} [fillOpacity=0.4] - 填充不透明度。
   * @property {boolean} [stroke] - 不需要描边则设为 false。
   * @property {string} [strokeColor='#ee9900'] - 十六进制描边颜色。
   * @property {number} [strokeOpacity=0.4] - 描边的不透明度(0-1)。
   * @property {number} [strokeWidth=1] - 像素描边宽度。
   * @property {string} [strokeLinecap='round'] - strokeLinecap 有三种类型 butt，round，square。
   * @property {string} [strokeDashstyle='solid'] - 有 dot，dash，dashdot，longdash，longdashdot，solid 几种样式。
   * @property {boolean} [graphic] - 不需要则设置为 false。
   * @property {number} [pointRadius=6] - 像素点半径。
   * @property {string} [pointerEvents='visiblePainted'] - pointerEvents。
   * @property {string} [cursor] - cursor。
   * @property {boolean} [allowRotate='false'] - 是否允许图标随着运行方向旋转。用于时空数据图层。
   * @property {string} [externalGraphic] - 连接到用来渲染点的外部的图形。
   * @property {number} [graphicWidth] - 外部图表的像素宽度。
   * @property {number} [graphicHeight] - 外部图表的高宽度。
   * @property {number} [graphicOpacity] - 外部图表的不透明度(0-1)。
   * @property {number} [graphicXOffset] - 外部图表沿着x方向的偏移量。
   * @property {number} [graphicYOffset] - 外部图表沿着y方向的偏移量 Pixel。
   * @property {number} [rotation] - 一个图表沿着其中心点（或者偏移中心指定点）在顺时针方向旋转。
   * @property {number} [graphicZIndex] - 渲染时使用的索引值。
   * @property {string} [graphicName='circle'] - 渲染点时图标使用的名字。支持"circle" , "square", "star", "x", "cross", "triangle"。
   * @property {string} [graphicTitle] - 外部图表的提示框。
   * @property {string} [backgroundGraphic] - 外部图表的背景。
   * @property {number} [backgroundGraphicZIndex] - 背景图渲染时使用的索引值。
   * @property {number} [backgroundXOffset] - 背景图在 x 轴的偏移量。
   * @property {number} [backgroundYOffset] - 背景图在 y 轴的偏移量。
   * @property {number} [backgroundHeight] - 背景图的高度。如果没有设置，将用 graphicHeight。
   * @property {number} [backgroundWidth] - 背景图的宽度。如果没有设置，将用 graphicWidth。
   * @property {boolean} [isUnicode=false] - 这个属性要配合 label 属性来用，当为 true时，label 就可以使用 unicode 编码，
   * 比如 "a" 的 unicode 十六进制编码为 61，则 label 属性可以为 "&#x61;",其中 "&#" 为前缀，标志这个为 unicode 编码，
   * "x" 是指 16 进制,这时页面显示的是 "a"；当此值为 false 的时候，label 的内容会被直接输出，
   * 比如，label 为 "&#x61;"，这时页面显示的也是 "&#x61;"。
   * @property {string} [label] - 可选的标签文本。
   * @property {string} [labelAlign='cm'] - 标签对齐，是由两个字符组成的字符串，如："lt", "cm", "rb"，
   * 其中第一个字符代表水平方向上的对齐，"l"=left, "c"=center, "r"=right；
   * 第二个字符代表垂直方向上的对齐，"t"=top, "m"=middle, "b"=bottom。
   * @property {number} [labelXOffset] - 标签在 x 轴方向的偏移量。
   * @property {number} [labelYOffset] - 标签在 y 轴方向的偏移量。
   * @property {boolean} [labelSelect=false] - 如果设为 true，标签可以选用 SelectFeature 或者 similar 控件。
   * @property {string} [fontColor='#000000'] - 标签字体颜色。
   * @property {number} [fontOpacity] - 标签透明度 (0-1)。
   * @property {string} [fontFamily] - 标签的字体类型。
   * @property {string} [fontSize] - 标签的字体大小。
   * @property {string} [fontStyle] - 标签的字体样式。
   * @property {string} [fontWeight] - 标签的字体粗细。
   * @property {string} [display] - 如果 display 属性设置为 “none”，符号将没有任何效果。
   * @example
   *  // label的用法如下：
   *  function addGeoTest(){
   *  var geometry = new GeometryPoint(105, 35);
   *  var pointFeature = new FeatureVector(geometry);
   *  var styleTest = {
   *        label:"supermap",
   *        fontColor:"#0000ff",
   *        fontOpacity:"0.5",
   *        fontFamily:"隶书",
   *        fontSize:"8em",
   *        fontWeight:"bold",
   *        fontStyle:"italic",
   *        labelSelect:"true",
   *     }
   *           pointFeature.style = styleTest;
   *          vectorLayer.addFeatures([pointFeature]);
   * }
   */

  /* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
   * This program are made available under the terms of the Apache License, Version 2.0
   * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html. */

  /**
   * @class  Size
   * @deprecatedclass SuperMap.Size
   * @category BaseTypes Style
   * @classdesc 此类描绘一对高宽值的实例。
   * @param {number} [w=0.0] - 宽度。
   * @param {number} [h=0.0] - 高度。
   *
   * @example
   * var size = new Size(31,46);
   * @usage
   */
  class Size {
    constructor(w, h) {
      /**
       * @member {number} [Size.prototype.w=0.0]
       * @description 宽度。
       */
      this.w = w ? parseFloat(w) : 0.0;

      /**
       * @member {number} [Size.prototype.h=0.0]
       * @description 高度。
       */
      this.h = w ? parseFloat(h) : 0.0;
      this.CLASS_NAME = "SuperMap.Size";
    }

    /**
     * @function Size.prototype.toString
     * @description 返回字符串形式。
     * @example
     * var size = new Size(10,5);
     * var str = size.toString();
     * @returns {string} 例如："w=10,h=5"。
     */
    toString() {
      return "w=" + this.w + ",h=" + this.h
    }

    /**
     * @function Size.prototype.clone
     * @description 克隆当前size对象。
     * @example
     * var size = new Size(31,46);
     * var size2 = size.clone();
     * @returns {Size}  新的与当前 size 对象有相同宽、高的 Size 对象。
     */
    clone() {
      return new Size(this.w, this.h)
    }

    /**
     *
     * @function Size.prototype.equals
     * @description 比较两个 size 对象是否相等。
     * @example
     * var size = new Size(31,46);
     * var size2 = new Size(31,46);
     * var isEquals = size.equals(size2);
     *
     * @param {Size} sz - 用于比较相等的 Size 对象。
     * @returns {boolean} 传入的 size 和当前 size 高宽相等，注意：如果传入的 size 为空则返回 false。
     *
     */
    equals(sz) {
      let equals = false;
      if (sz != null) {
        equals = (this.w === sz.w && this.h === sz.h) || (isNaN(this.w) && isNaN(this.h) && isNaN(sz.w) && isNaN(sz.h));
      }
      return equals
    }

    /**
     *
     * @function Size.prototype.destroy
     * @description 销毁此对象。销毁后此对象的所有属性为 null，而不是初始值。
     * @example
     * var size = new Size(31,46);
     * size.destroy();
     */
    destroy() {
      this.w = null;
      this.h = null;
    }
  }

  /* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
   * This program are made available under the terms of the Apache License, Version 2.0
   * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html. */

  /**
   * @class Pixel
   * @deprecatedclass SuperMap.Pixel
   * @category BaseTypes Geometry
   * @classdesc 用 x,y 坐标描绘屏幕坐标（像素点）。
   * @param {number} [x=0.0] - x 坐标。
   * @param {number} [y=0.0] - y 坐标。
   * @param {Pixel.Mode} [mode=Pixel.Mode.LeftTop] - 坐标模式。
   *
   * @example
   * //单独创建一个对象
   * var pixcel = new Pixel(100,50);
   *
   * //依据 size 创建
   *  var size = new Size(21,25);
   *  var offset = new Pixel(-(size.w/2), -size.h);
   * @usage
   */
  class Pixel {
    constructor(x, y, mode) {
      /**
       * @member {number} [Pixel.prototype.x=0.0]
       * @description x 坐标。
       */
      this.x = x ? parseFloat(x) : 0.0;

      /**
       * @member {number} [Pixel.prototype.y=0.0]
       * @description y 坐标。
       */
      this.y = y ? parseFloat(y) : 0.0;

      /**
       * @member {Pixel.Mode} [Pixel.prototype.mode=Pixel.Mode.LeftTop]
       * @description 坐标模式，有左上、右上、右下、左下这几种模式，分别表示相对于左上角、右上角、右下角、左下角的坐标。
       */
      this.mode = mode;
      this.CLASS_NAME = "SuperMap.Pixel";
    }

    /**
     * @function Pixel.prototype.toString
     * @description 返回此对象的字符串形式。
     * @example
     *
     * var pixcel = new Pixel(100,50);
     * var str = pixcel.toString();
     *
     * @returns {string} 例如: "x=200.4,y=242.2"
     */
    toString() {
      return "x=" + this.x + ",y=" + this.y
    }

    /**
     * @function Pixel.prototype.clone
     * @description 克隆当前的 pixel 对象。
     * @example
     * var pixcel = new Pixel(100,50);
     * var pixcel2 = pixcel.clone();
     * @returns {Pixel} 新的与当前 pixel 对象有相同 x、y 坐标的 pixel 对象。
     */
    clone() {
      return new Pixel(this.x, this.y, this.mode)
    }

    /**
     * @function Pixel.prototype.equals
     * @description 比较两 pixel 是否相等。
     * @example
     * var pixcel = new Pixel(100,50);
     * var pixcel2 = new Pixel(100,50);
     * var isEquals = pixcel.equals(pixcel2);
     *
     * @param {Pixel} px - 用于比较相等的 pixel 对象。
     * @returns {boolean} 如果传入的像素点和当前像素点相同返回 true，如果不同或传入参数为 NULL 则返回 false。
     */
    equals(px) {
      let equals = false;
      if (px != null) {
        equals = (this.x == px.x && this.y == px.y) || (isNaN(this.x) && isNaN(this.y) && isNaN(px.x) && isNaN(px.y));
      }
      return equals
    }

    /**
     * @function Pixel.prototype.distanceTo
     * @description 返回两个 pixel 的距离。
     * @example
     * var pixcel = new Pixel(100,50);
     * var pixcel2 = new Pixel(110,30);
     * var distance = pixcel.distanceTo(pixcel2);
     *
     * @param {Pixel} px - 需要计算的 pixel。
     * @returns {number} 作为参数传入的像素与当前像素点的距离。
     */
    distanceTo(px) {
      return Math.sqrt(Math.pow(this.x - px.x, 2) + Math.pow(this.y - px.y, 2))
    }

    /**
     * @function Pixel.prototype.add
     * @description 在原来像素坐标基础上，x 值加上传入的 x 参数，y 值加上传入的 y 参数。
     * @example
     * var pixcel = new Pixel(100,50);
     * //pixcel2是新的对象
     * var pixcel2 = pixcel.add(20,30);
     *
     * @param {number} x - 传入的 x 值。
     * @param {number} y - 传入的 y 值。
     * @returns {Pixel} 新的 pixel 对象，该 pixel 是由当前的 pixel 与传入的 x，y 相加得到。
     */
    add(x, y) {
      if (x == null || y == null) {
        throw new TypeError("Pixel.add cannot receive null values")
      }
      return new Pixel(this.x + x, this.y + y)
    }

    /**
     * @function Pixel.prototype.offset
     * @description 通过传入的 {@link Pixel} 参数对原屏幕坐标进行偏移。
     * @example
     * var pixcel = new Pixel(100,50);
     * var pixcel2 = new Pixel(130,20);
     * //pixcel3 是新的对象
     * var pixcel3 = pixcel.offset(pixcel2);
     *
     * @param {Pixel} px - 传入的 {@link Pixel} 对象。
     * @returns {Pixel} 新的 pixel，该 pixel 是由当前的 pixel 对象的 x，y 值与传入的 Pixel 对象的 x，y 值相加得到。
     */
    offset(px) {
      let newPx = this.clone();
      if (px) {
        newPx = this.add(px.x, px.y);
      }
      return newPx
    }

    /**
     *
     * @function Pixel.prototype.destroy
     * @description 销毁此对象。销毁后此对象的所有属性为 null，而不是初始值。
     * @example
     * var pixcel = new Pixel(100,50);
     * pixcel.destroy();
     */
    destroy() {
      this.x = null;
      this.y = null;
      this.mode = null;
    }
  }
  /**
   * @enum Mode
   * @memberOf Pixel
   * @readonly
   * @description 模式。
   * @type {string}
   */
  Pixel.Mode = {
    /** 左上模式。 */
    LeftTop: "lefttop",
    /** 右上模式。 */
    RightTop: "righttop",
    /** 右下模式。 */
    RightBottom: "rightbottom",
    /** 左下模式。 */
    LeftBottom: "leftbottom"
  };

  /* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
   * This program are made available under the terms of the Apache License, Version 2.0
   * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html. */

  /**
   * @class LonLat
   * @category BaseTypes Geometry
   * @classdesc  这个类用来表示经度和纬度对。
   * @param {number|Array.<number>} [lon=0.0] - 地图单位上的 X 轴坐标或者横纵坐标组成的数组；如果地图是地理投影，则此值是经度，否则，此值是地图地理位置的 x 坐标。
   * @param {number} [lat=0.0] - 地图单位上的 Y 轴坐标，如果地图是地理投影，则此值是纬度，否则，此值是地图地理位置的 y 坐标。
   * @example
   * var lonLat = new LonLat(30,45);
   * @usage
   */
  class LonLat {
    constructor(lon, lat) {
      if (Util.isArray(lon)) {
        lat = lon[1];
        lon = lon[0];
      }
      /**
       * @member {number} [LonLat.prototype.lon=0.0]
       * @description 地图的单位的 X 轴（横轴）坐标。
       */
      this.lon = lon ? Util.toFloat(lon) : 0.0;

      /**
       * @member {number} [LonLat.prototype.lat=0.0]
       * @description 地图的单位的 Y 轴（纵轴）坐标。
       */
      this.lat = lat ? Util.toFloat(lat) : 0.0;
      this.CLASS_NAME = "SuperMap.LonLat";
    }

    /**
     * @function LonLat.prototype.toString
     * @description 返回此对象的字符串形式
     * @example
     * var lonLat = new LonLat(100,50);
     * var str = lonLat.toString();
     * @returns {string} 例如: "lon=100,lat=50"
     */
    toString() {
      return "lon=" + this.lon + ",lat=" + this.lat
    }

    /**
     * @function LonLat.prototype.toShortString
     * @description 将经度纬度转换成简单字符串。
     * @example
     * var lonLat = new LonLat(100,50);
     * var str = lonLat.toShortString();
     * @returns {string} 处理后的经纬度字符串。例如："100,50"
     */
    toShortString() {
      return this.lon + "," + this.lat
    }

    /**
     * @function LonLat.prototype.clone
     * @description 复制坐标对象，并返回复制后的新对象。
     * @example
     * var lonLat1 = new LonLat(100,50);
     * var lonLat2 = lonLat1.clone();
     * @returns {LonLat}  相同坐标值的新的坐标对象。
     */
    clone() {
      return new LonLat(this.lon, this.lat)
    }

    /**
     * @function LonLat.prototype.add
     * @description 在已有坐标对象的经纬度基础上加上新的坐标经纬度，并返回新的坐标对象。
     * @example
     * var lonLat1 = new LonLat(100,50);
     * //lonLat2 是新的对象
     * var lonLat2 = lonLat1.add(100,50);
     * @param {number} lon - 经度参数。
     * @param {number} lat - 纬度参数。
     * @returns {LonLat} 新的 LonLat 对象，此对象的经纬度是由传入的经纬度与当前的经纬度相加所得。
     */
    add(lon, lat) {
      if (lon == null || lat == null) {
        throw new TypeError("LonLat.add cannot receive null values")
      }
      return new LonLat(this.lon + Util.toFloat(lon), this.lat + Util.toFloat(lat))
    }

    /**
     * @function LonLat.prototype.equals
     * @description 判断两个坐标对象是否相等。
     * @example
     * var lonLat1 = new LonLat(100,50);
     * var lonLat2 = new LonLat(100,50);
     * var isEquals = lonLat1.equals(lonLat2);
     * @param {LonLat} ll - 需要进行比较的坐标对象。
     * @returns {boolean} 如果LonLat对象的经纬度和传入的经纬度一致则返回true,不一
     *      致或传入的ll参数为NULL则返回false。
     */
    equals(ll) {
      let equals = false;
      if (ll != null) {
        equals = (this.lon === ll.lon && this.lat === ll.lat) || (isNaN(this.lon) && isNaN(this.lat) && isNaN(ll.lon) && isNaN(ll.lat));
      }
      return equals
    }

    /**
     * @function LonLat.prototype.wrapDateLine
     * @description 通过传入的范围对象对坐标对象转换到该范围内。
     * 如果经度小于给定范围最小精度，则在原经度基础上加上范围宽度，直到精度在范围内为止，如果经度大于给定范围则在原经度基础上减去范围宽度。
     * 即指将不在经度范围内的坐标转换到范围以内（只会转换 lon，不会转换 lat，主要用于转移到日界线以内）。
     * @example
     * var lonLat1 = new LonLat(420,50);
     * var lonLat2 = lonLat1.wrapDateLine(
     *      new Bounds(-180,-90,180,90)
     *  );
     * @param {Bounds} maxExtent - 最大边界的范围。
     * @returns {LonLat} 将坐标转换到范围对象以内，并返回新的坐标。
     */
    wrapDateLine(maxExtent) {
      const newLonLat = this.clone();

      if (maxExtent) {
        // shift right?
        while (newLonLat.lon < maxExtent.left) {
          newLonLat.lon += maxExtent.getWidth();
        }

        // shift left?
        while (newLonLat.lon > maxExtent.right) {
          newLonLat.lon -= maxExtent.getWidth();
        }
      }

      return newLonLat
    }

    /**
     *
     * @function LonLat.prototype.destroy
     * @description 销毁此对象。
     * 销毁后此对象的所有属性为 null，而不是初始值。
     * @example
     * var lonLat = new LonLat(100,50);
     * lonLat.destroy();
     */
    destroy() {
      this.lon = null;
      this.lat = null;
    }

    /**
     * @function LonLat.fromString
     * @description 通过字符串生成一个 {@link LonLat} 对象。
     * @example
     * var str = "100,50";
     * var lonLat = LonLat.fromString(str);
     * @param {string} str - 字符串的格式：Lon+","+Lat。如："100,50"。
     * @returns {LonLat} {@link LonLat} 对象。
     */
    static fromString(str) {
      const pair = str.split(",");
      return new LonLat(pair[0], pair[1])
    }

    /**
     * @function LonLat.fromArray
     * @description 通过数组生成一个 {@link LonLat} 对象。
     * @param {Array.<number>} arr - 数组的格式，长度只能为2,：[Lon,Lat]。如：[5,-42]。
     * @returns {LonLat} {@link LonLat} 对象。
     */
    static fromArray(arr) {
      const gotArr = Util.isArray(arr);
      const lon = gotArr && arr[0];
      const lat = gotArr && arr[1];
      return new LonLat(lon, lat)
    }
  }

  /* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
   * This program are made available under the terms of the Apache License, Version 2.0
   * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html. */

  /**
   * @class Bounds
   * @deprecatedclass SuperMap.Bounds
   * @category BaseTypes Geometry
   * @classdesc 表示边界类实例。使用 bounds 之前需要设置 left，bottom，right，top 四个属性，这些属性的初始值为 null。
   * @param {number|Array.<number>} [left] - 如果是number，则表示左边界，注意考虑宽度，理论上小于 right 值。如果是数组，则表示 [left, bottom, right, top] 左下右上组成的数组。
   * @param {number} [bottom] - 下边界。考虑高度，理论上小于 top 值。
   * @param {number} [right] - 右边界。
   * @param {number} [top] - 上边界。
   * @example
   * let bounds = new Bounds();
   * bounds.extend(new LonLat(4,5));
   * bounds.extend(new LonLat(5,6));
   * bounds.toBBOX(); // returns 4,5,5,6
   * @usage
   */
  class Bounds {
    constructor(left, bottom, right, top) {
      if (Util.isArray(left)) {
        top = left[3];
        right = left[2];
        bottom = left[1];
        left = left[0];
      }
      /**
       * @member {number} Bounds.prototype.left
       * @description 最小的水平坐标系。
       */
      this.left = left != null ? Util.toFloat(left) : this.left;

      /**
       * @member {number} Bounds.prototype.bottom
       * @description 最小的垂直坐标系。
       */
      this.bottom = bottom != null ? Util.toFloat(bottom) : this.bottom;

      /**
       * @member {number} Bounds.prototype.right
       * @description 最大的水平坐标系。
       */
      this.right = right != null ? Util.toFloat(right) : this.right;

      /**
       * @member {number} Bounds.prototype.top
       * @description 最大的垂直坐标系。
       */
      this.top = top != null ? Util.toFloat(top) : this.top;

      /**
       * @member {LonLat} Bounds.prototype.centerLonLat
       * @description bounds 的地图空间的中心点。用 getCenterLonLat() 获得。
       */
      this.centerLonLat = null;
      this.CLASS_NAME = "SuperMap.Bounds";
    }

    /**
     * @function Bounds.prototype.clone
     * @description 复制当前 bounds 对象。
     * @example
     * let bounds1 = new Bounds(-180,-90,180,90);
     * let bounds2 = bounds1.clone();
     * @returns {Bounds} 克隆后的 bounds。
     */
    clone() {
      return new Bounds(this.left, this.bottom, this.right, this.top)
    }

    /**
     * @function Bounds.prototype.equals
     * @description 判断两个 bounds 对象是否相等。
     * @example
     * let bounds1 = new Bounds(-180,-90,180,90);
     * let bounds2 = new Bounds(-180,-90,180,90);
     * let isEquals = bounds1.equals(bounds2);
     * @param {Bounds} bounds - 需要进行计较的 bounds。
     * @returns {boolean} 如果 bounds 对象的边和传入的 bounds 一致则返回 true，不一致或传入的 bounds 参数为 NULL 则返回 false。
     */
    equals(bounds) {
      let equals = false;
      if (bounds != null) {
        equals = this.left === bounds.left && this.right === bounds.right && this.top === bounds.top && this.bottom === bounds.bottom;
      }
      return equals
    }

    /**
     * @function Bounds.prototype.toString
     * @description 返回此对象的字符串形式。
     * @example
     * let bounds = new Bounds(-180,-90,180,90);
     * let str = bounds.toString();
     * @returns {string} 边界对象的字符串表示形式（left,bottom,right,top），例如: "-180,-90,180,90"。
     */
    toString() {
      return [this.left, this.bottom, this.right, this.top].join(",")
    }

    /**
     * @function Bounds.prototype.toArray
     * @description 边界对象的数组表示形式。
     * @example
     * let bounds = new Bounds(-180,-90,100,80);
     * //array1 = [-180,-90,100,80];
     * let array1 = bounds.toArray();
     * //array1 = [-90,-180,80,100];
     * let array2 = bounds.toArray(true);
     * @param {boolean} [reverseAxisOrder=false] - 是否反转轴顺序。
     * 如果设为 true，则倒转顺序（bottom,left,top,right），否则按正常轴顺序（left,bottom,right,top）。
     * @returns {Array.<number>} left, bottom, right, top 数组。
     */
    toArray(reverseAxisOrder) {
      if (reverseAxisOrder === true) {
        return [this.bottom, this.left, this.top, this.right]
      } else {
        return [this.left, this.bottom, this.right, this.top]
      }
    }

    /**
     * @function Bounds.prototype.toBBOX
     * @description 取小数点后 decimal 位数字进行四舍五入再转换为 BBOX 字符串。
     * @example
     * let bounds = new Bounds(-1.1234567,-1.7654321,1.4444444,1.5555555);
     * //str1 = "-1.123457,-1.765432,1.444444,1.555556";
     * let str1 = bounds.toBBOX();
     * //str2 = "-1.1,-1.8,1.4,1.6";
     * let str2 = bounds.toBBOX(1);
     * //str2 = "-1.8,-1.1,1.6,1.4";
     * let str2 = bounds.toBBOX(1,true);
     * @param {number} [decimal=6] - 边界方位坐标的有效数字个数。
     * @param {boolean} [reverseAxisOrder=false] - 是否是反转轴顺序。
     * 如果设为true，则倒转顺序（bottom,left,top,right）,否则按正常轴顺序（left,bottom,right,top）。
     * @returns {string} 边界对象的字符串表示形式，如："5,42,10,45"。
     */
    toBBOX(decimal, reverseAxisOrder) {
      if (decimal == null) {
        decimal = 6;
      }
      const mult = Math.pow(10, decimal);
      const xmin = Math.round(this.left * mult) / mult;
      const ymin = Math.round(this.bottom * mult) / mult;
      const xmax = Math.round(this.right * mult) / mult;
      const ymax = Math.round(this.top * mult) / mult;
      if (reverseAxisOrder === true) {
        return ymin + "," + xmin + "," + ymax + "," + xmax
      } else {
        return xmin + "," + ymin + "," + xmax + "," + ymax
      }
    }

    /// **
    // * @function Bounds.prototype.toGeometry
    // * @description 基于当前边界范围创建一个新的多边形对象。
    // * @example
    // * let bounds = new Bounds(-180,-90,100,80);
    // * // Polygon对象
    // * let geo = bounds.toGeometry();
    // * @returns {GeometryPolygon} 基于当前 bounds 坐标创建的新的多边形。
    // */
    // toGeometry() {
    //     return new Polygon([
    //         new LinearRing([
    //             new Point(this.left, this.bottom),
    //             new Point(this.right, this.bottom),
    //             new Point(this.right, this.top),
    //             new Point(this.left, this.top)
    //         ])
    //     ]);
    // }

    /**
     * @function Bounds.prototype.getWidth
     * @description 获取 bounds 的宽度。
     * @example
     * let bounds = new Bounds(-180,-90,100,80);
     * //width = 280;
     * let width = bounds.getWidth();
     * @returns {number} 获取当前 bounds 的宽度（right 减去 left）。
     */
    getWidth() {
      return this.right - this.left
    }

    /**
     * @function Bounds.prototype.getHeight
     * @description 获取 bounds 的高度。
     * @example
     * let bounds = new Bounds(-180,-90,100,80);
     * //height = 170;
     * let height = bounds.getHeight();
     * @returns {number} 边界高度（top 减去 bottom）。
     */
    getHeight() {
      return this.top - this.bottom
    }

    /**
     * @function Bounds.prototype.getSize
     * @description 获取边框大小。
     * @example
     * let bounds = new Bounds(-180,-90,100,80);
     * let size = bounds.getSize();
     * @returns {Size} 边框大小。
     */
    getSize() {
      return new Size(this.getWidth(), this.getHeight())
    }

    /**
     * @function Bounds.prototype.getCenterPixel
     * @description 获取像素格式的范围中心点。
     * @example
     * let bounds = new Bounds(-180,-90,100,80);
     * let pixel = bounds.getCenterPixel();
     * @returns {Pixel} 像素格式的当前范围的中心点。
     */
    getCenterPixel() {
      return new Pixel((this.left + this.right) / 2, (this.bottom + this.top) / 2)
    }

    /**
     * @function Bounds.prototype.getCenterLonLat
     * @description 获取地理格式的范围中心点。
     * @example
     * let bounds = new Bounds(-180,-90,100,80);
     * let lonlat = bounds.getCenterLonLat();
     * @returns {LonLat} 当前地理范围的中心点。
     */
    getCenterLonLat() {
      if (!this.centerLonLat) {
        this.centerLonLat = new LonLat((this.left + this.right) / 2, (this.bottom + this.top) / 2);
      }
      return this.centerLonLat
    }

    /**
     * @function Bounds.prototype.scale
     * @description 按照比例扩大/缩小出一个新的 bounds。
     * @example
     * let bounds = new Bounds(-50,-50,40,40);
     * let bounds2 = bounds.scale(2);
     * @param {number} [ratio=1] - 需要扩大的比例。
     * @param {(Pixel|LonLat)} [origin] - 扩大时的基准点，默认为当前 bounds 的中心点。
     * @returns {Bounds} 通过 ratio、origin 计算得到的新的边界范围。
     */
    scale(ratio, origin) {
      ratio = ratio || 1;
      if (origin == null) {
        origin = this.getCenterLonLat();
      }

      let origx, origy;

      // get origin coordinates
      if (origin.CLASS_NAME === "SuperMap.LonLat") {
        origx = origin.lon;
        origy = origin.lat;
      } else {
        origx = origin.x;
        origy = origin.y;
      }

      const left = (this.left - origx) * ratio + origx;
      const bottom = (this.bottom - origy) * ratio + origy;
      const right = (this.right - origx) * ratio + origx;
      const top = (this.top - origy) * ratio + origy;

      return new Bounds(left, bottom, right, top)
    }

    /**
     * @function Bounds.prototype.add
     * @description 在当前的 Bounds 上按照传入的坐标点进行平移，返回新的范围。
     * @example
     * let bounds1 = new Bounds(-50,-50,40,40);
     * //bounds2 是新的 bounds
     * let bounds2 = bounds.add(20,10);
     * @param {number} x - 坐标点的 x 坐标。
     * @param {number} y - 坐标点的 y 坐标。
     * @returns {Bounds} 新的 bounds，此 bounds 的坐标是由传入的 x，y 参数与当前 bounds 坐标计算所得。
     */
    add(x, y) {
      if (x == null || y == null) {
        throw new TypeError("Bounds.add cannot receive null values")
      }
      return new Bounds(this.left + x, this.bottom + y, this.right + x, this.top + y)
    }

    /**
     * @function Bounds.prototype.extend
     * @description 在当前 bounds 上扩展 bounds，支持 point，lanlat 和 bounds。扩展后的 bounds 的范围是两者的结合。
     * @example
     * let bounds1 = new Bounds(-50,-50,40,40);
     * //bounds 改变
     * bounds.extend(new LonLat(50,60));
     * @param {GeometryPoint|LonLat|Bounds} object - 可以是 point、lonlat 和 bounds。
     */
    extend(object) {
      let bounds = null;
      if (object) {
        // clear cached center location
        switch (object.CLASS_NAME) {
          case "SuperMap.LonLat":
            bounds = new Bounds(object.lon, object.lat, object.lon, object.lat);
            break
          case "SuperMap.Geometry.Point":
            bounds = new Bounds(object.x, object.y, object.x, object.y);
            break

          case "SuperMap.Bounds":
            bounds = object;
            break
        }

        if (bounds) {
          this.centerLonLat = null;
          if (this.left == null || bounds.left < this.left) {
            this.left = bounds.left;
          }
          if (this.bottom == null || bounds.bottom < this.bottom) {
            this.bottom = bounds.bottom;
          }
          if (this.right == null || bounds.right > this.right) {
            this.right = bounds.right;
          }
          if (this.top == null || bounds.top > this.top) {
            this.top = bounds.top;
          }
        }
      }
    }

    /**
     * @function Bounds.prototype.containsLonLat
     * @description 判断传入的坐标是否在范围内。
     * @example
     * let bounds1 = new Bounds(-50,-50,40,40);
     * //isContains1 = true
     * //这里的第二个参数可以直接为 boolean 类型，也就是inclusive
     * let isContains1 = bounds.containsLonLat(new LonLat(40,40),true);
     *
     * //(40,40)在范围内，同样(40+360,40)也在范围内
     * let bounds2 = new Bounds(-50,-50,40,40);
     * //isContains2 = true;
     * let isContains2 = bounds2.containsLonLat(
     *      new LonLat(400,40),
     *      {
     *           inclusive:true,
     *           //全球的范围
     *           worldBounds: new Bounds(-180,-90,180,90)
     *      }
     * );
     * @param {(LonLat|Object)} ll - <LonLat> 对象或者是一个包含 'lon' 与 'lat' 属性的对象。
     * @param {Object} options - 可选参数。
     * @param {boolean} [options.inclusive=true] - 是否包含边界。
     * @param {Bounds} [options.worldBounds] - 如果提供 worldBounds 参数, 如果 ll 参数提供的坐标超出了世界边界（worldBounds），
     *        但是通过日界线的转化可以被包含, 它将被认为是包含在该范围内的。
     * @returns {boolean} 传入坐标是否包含在范围内。
     */
    containsLonLat(ll, options) {
      if (typeof options === "boolean") {
        options = { inclusive: options };
      }
      options = options || {};
      let contains = this.contains(ll.lon, ll.lat, options.inclusive);
      const worldBounds = options.worldBounds;
      // 日界线以外的也有可能算包含，
      if (worldBounds && !contains) {
        const worldWidth = worldBounds.getWidth();
        const worldCenterX = (worldBounds.left + worldBounds.right) / 2;
        // 这一步很关键
        const worldsAway = Math.round((ll.lon - worldCenterX) / worldWidth);
        contains = this.containsLonLat(
          {
            lon: ll.lon - worldsAway * worldWidth,
            lat: ll.lat
          },
          { inclusive: options.inclusive }
        );
      }
      return contains
    }

    /**
     * @function Bounds.prototype.containsPixel
     * @description 判断传入的像素是否在范围内。直接匹配大小，不涉及像素和地理转换。
     * @example
     * let bounds = new Bounds(-50,-50,40,40);
     * //isContains = true
     * let isContains = bounds.containsPixel(new Pixel(40,40),true);
     * @param {Pixel} px - 提供的像素参数。
     * @param {boolean} [inclusive=true] - 是否包含边界。
     * @returns {boolean} 传入的 pixel 在当前边界范围之内。
     */
    containsPixel(px, inclusive) {
      return this.contains(px.x, px.y, inclusive)
    }

    /**
     * @function Bounds.prototype.contains
     * @description 判断传入的 x，y 坐标值是否在范围内。
     * @example
     * let bounds = new Bounds(-50,-50,40,40);
     * //isContains = true
     * let isContains = bounds.contains(40,40,true);
     * @param {number} x - x 坐标值。
     * @param {number} y - y 坐标值。
     * @param {boolean} [inclusive=true] - 是否包含边界。
     * @returns {boolean} 传入的 x，y 坐标是否在当前范围内。
     */
    contains(x, y, inclusive) {
      // set default
      if (inclusive == null) {
        inclusive = true;
      }

      if (x == null || y == null) {
        return false
      }

      // x = Util.toFloat(x);
      // y = Util.toFloat(y);

      let contains = false;
      if (inclusive) {
        contains = x >= this.left && x <= this.right && y >= this.bottom && y <= this.top;
      } else {
        contains = x > this.left && x < this.right && y > this.bottom && y < this.top;
      }
      return contains
    }

    /**
     * @function Bounds.prototype.intersectsBounds
     * @description 判断目标边界范围是否与当前边界范围相交。如果两个边界范围中的任意
     *              边缘相交或者一个边界包含了另外一个就认为这两个边界相交。
     * @example
     * let bounds = new Bounds(-180,-90,100,80);
     * let isIntersects = bounds.intersectsBounds(
     *      new Bounds(-170,-90,120,80)
     *  );
     * @param {Bounds} bounds - 目标边界。
     * @param {Object} options - 参数。
     * @param {boolean} [options.inclusive=true] - 边缘重合也看成相交。如果是false，
     *                               两个边界范围没有重叠部分仅仅是在边缘相接（重合），
     *                               这种情况被认为没有相交。
     * @param {Bounds} [options.worldBounds] - 提供了 worldBounds 参数, 如果他们相交时
     *                               是在全球范围内, 两个边界将被视为相交。这仅适用于交叉或完全不在世界范围的边界。
     * @returns {boolean} 传入的 bounds 对象与当前 bounds 相交。
     */
    intersectsBounds(bounds, options) {
      if (typeof options === "boolean") {
        options = { inclusive: options };
      }
      options = options || {};
      let self;
      if (options.worldBounds) {
        self = this.wrapDateLine(options.worldBounds);
        bounds = bounds.wrapDateLine(options.worldBounds);
      } else {
        self = this;
      }
      if (options.inclusive == null) {
        options.inclusive = true;
      }
      let intersects = false;
      const mightTouch = self.left === bounds.right || self.right === bounds.left || self.top === bounds.bottom || self.bottom === bounds.top;

      // if the two bounds only touch at an edge, and inclusive is false,
      // then the bounds don't *really* intersect.
      if (options.inclusive || !mightTouch) {
        // otherwise, if one of the boundaries even partially contains another,
        // inclusive of the edges, then they do intersect.
        const inBottom = (bounds.bottom >= self.bottom && bounds.bottom <= self.top) || (self.bottom >= bounds.bottom && self.bottom <= bounds.top);
        const inTop = (bounds.top >= self.bottom && bounds.top <= self.top) || (self.top > bounds.bottom && self.top < bounds.top);
        const inLeft = (bounds.left >= self.left && bounds.left <= self.right) || (self.left >= bounds.left && self.left <= bounds.right);
        const inRight = (bounds.right >= self.left && bounds.right <= self.right) || (self.right >= bounds.left && self.right <= bounds.right);
        intersects = (inBottom || inTop) && (inLeft || inRight);
      }
      // document me
      if (options.worldBounds && !intersects) {
        const world = options.worldBounds;
        const width = world.getWidth();
        const selfCrosses = !world.containsBounds(self);
        const boundsCrosses = !world.containsBounds(bounds);
        if (selfCrosses && !boundsCrosses) {
          bounds = bounds.add(-width, 0);
          intersects = self.intersectsBounds(bounds, { inclusive: options.inclusive });
        } else if (boundsCrosses && !selfCrosses) {
          self = self.add(-width, 0);
          intersects = bounds.intersectsBounds(self, { inclusive: options.inclusive });
        }
      }
      return intersects
    }

    /**
     * @function Bounds.prototype.containsBounds
     * @description 判断目标边界是否被当前边界包含在内。
     * @example
     * let bounds = new Bounds(-180,-90,100,80);
     * let isContains = bounds.containsBounds(
     *      new Bounds(-170,-90,100,80),true,true
     *  );
     * @param {Bounds} bounds - 目标边界。
     * @param {boolean} [partial=false] - 目标边界的任意部分都包含在当前边界中则被认为是包含关系。
     * 如果设为 false，整个目标边界全部被包含在当前边界范围内。
     * @param {boolean} [inclusive=true] - 边缘共享是否被视为包含。
     * @returns {boolean} 传入的边界是否被当前边界包含。
     */
    containsBounds(bounds, partial, inclusive) {
      if (partial == null) {
        partial = false;
      }
      if (inclusive == null) {
        inclusive = true;
      }
      const bottomLeft = this.contains(bounds.left, bounds.bottom, inclusive);
      const bottomRight = this.contains(bounds.right, bounds.bottom, inclusive);
      const topLeft = this.contains(bounds.left, bounds.top, inclusive);
      const topRight = this.contains(bounds.right, bounds.top, inclusive);

      return partial ? bottomLeft || bottomRight || topLeft || topRight : bottomLeft && bottomRight && topLeft && topRight
    }

    /**
     * @function Bounds.prototype.determineQuadrant
     * @description 判断传入坐标是否在 bounds 范围内的象限。以 bounds 中心点为坐标原点。
     * @example
     * let bounds = new Bounds(-180,-90,100,80);
     * //str = "tr";
     * let str = bounds.determineQuadrant(
     *      new LonLat(20,20)
     *  );
     * @param {LonLat} lonlat - 传入的坐标对象。
     * @returns {string} 传入坐标所在的象限（"br" "tr" "tl" "bl" 分别对应"右下"，"右上"，"左上" "左下"）。
     */
    determineQuadrant(lonlat) {
      let quadrant = "";
      const center = this.getCenterLonLat();

      quadrant += lonlat.lat < center.lat ? "b" : "t";
      quadrant += lonlat.lon < center.lon ? "l" : "r";

      return quadrant
    }

    /**
     * @function Bounds.prototype.wrapDateLine
     * @description 将当前 bounds 移动到最大边界范围内部（所谓的内部是相交或者内部）。
     * @example
     * let bounds = new Bounds(380,-40,400,-20);
     * let maxExtent = new Bounds(-180,-90,100,80);
     * //新的bounds
     * let newBounds = bounds.wrapDateLine(maxExtent);
     * @param {Bounds} maxExtent - 最大的边界范围（一般是全球范围）。
     * @param {Object} options - 可选选项参数。
     * @param {number} [options.leftTolerance=0] - left 允许的误差。
     * @param {number} [options.rightTolerance=0] - right 允许的误差。
     * @returns {Bounds} 克隆当前边界。如果当前边界完全在最大范围之外此函数则返回一个不同值的边界，
     *                            若落在最大边界的左边，则给当前的bounds值加上最大范围的宽度，即向右移动，
     *                            若落在右边，则向左移动，即给当前的bounds值加上负的最大范围的宽度。
     */
    wrapDateLine(maxExtent, options) {
      options = options || {};

      const leftTolerance = options.leftTolerance || 0;
      const rightTolerance = options.rightTolerance || 0;

      let newBounds = this.clone();

      if (maxExtent) {
        const width = maxExtent.getWidth();
        // 如果 newBounds 在 maxExtent 的左边，那么一直向右移动，直到相交或者包含为止，每次移动width
        // shift right?
        while (newBounds.left < maxExtent.left && newBounds.right - rightTolerance <= maxExtent.left) {
          newBounds = newBounds.add(width, 0);
        }
        // 如果 newBounds 在 maxExtent 的右边，那么一直向左移动，直到相交或者包含为止，每次移动width
        // shift left?
        while (newBounds.left + leftTolerance >= maxExtent.right && newBounds.right > maxExtent.right) {
          newBounds = newBounds.add(-width, 0);
        }
        // 如果和右边相交，左边又在内部，那么再次向左边移动一次
        // crosses right only? force left
        const newLeft = newBounds.left + leftTolerance;
        if (newLeft < maxExtent.right && newLeft > maxExtent.left && newBounds.right - rightTolerance > maxExtent.right) {
          newBounds = newBounds.add(-width, 0);
        }
      }

      return newBounds
    }

    /**
     * @function Bounds.prototype.toServerJSONObject
     * @description 转换成对应的 JSON 格式对象。
     * @example
     * let bounds = new Bounds(-180,-90,100,80);
     * let obj = bounds.toServerJSONObject();
     * @returns {Object} JSON 格式的 Object 对象。
     */
    toServerJSONObject() {
      const jsonObject = {
        rightTop: { x: this.right, y: this.top },
        leftBottom: { x: this.left, y: this.bottom },
        left: this.left,
        right: this.right,
        top: this.top,
        bottom: this.bottom
      };
      return jsonObject
    }

    /**
     *
     * @function Bounds.prototype.destroy
     * @description 销毁此对象。
     * 销毁后此对象的所有属性为 null，而不是初始值。
     * @example
     * let bounds = new Bounds(-180,-90,100,80);
     * bounds.destroy();
     */
    destroy() {
      this.left = null;
      this.right = null;
      this.top = null;
      this.bottom = null;
      this.centerLonLat = null;
    }

    /**
     * @function Bounds.fromString
     * @description 通过字符串参数创建新的 bounds 的构造函数。
     * @example
     * let bounds = Bounds.fromString("-180,-90,100,80");
     * @param {string} str - 边界字符串，用逗号隔开（e.g. <i>"5,42,10,45"</i>）。
     * @param {boolean} [reverseAxisOrder=false] - 是否反转轴顺序。
     * 如果设为true，则倒转顺序（bottom,left,top,right），否则按正常轴顺序（left,bottom,right,top）。
     * @returns {Bounds} 给定的字符串创建的新的边界对象。
     */
    static fromString(str, reverseAxisOrder) {
      const bounds = str.split(",");
      return Bounds.fromArray(bounds, reverseAxisOrder)
    }

    /**
     * @function Bounds.fromArray
     * @description 通过边界框数组创建 Bounds。
     * @example
     * let bounds = Bounds.fromArray([-180,-90,100,80]);
     * @param {Array.<number>} bbox - 边界值数组。（e.g. <i>[5,42,10,45]</i>）。
     * @param {boolean} [reverseAxisOrder=false] - 是否是反转轴顺序。如果设为true，则倒转顺序（bottom,left,top,right），否则按正常轴顺序（left,bottom,right,top）。
     * @returns {Bounds} 根据传入的数组创建的新的边界对象。
     */
    static fromArray(bbox, reverseAxisOrder) {
      return reverseAxisOrder === true ? new Bounds(bbox[1], bbox[0], bbox[3], bbox[2]) : new Bounds(bbox[0], bbox[1], bbox[2], bbox[3])
    }

    /**
     * @function Bounds.fromSize
     * @description 通过传入的边界大小来创建新的边界。
     * @example
     * let bounds = Bounds.fromSize(new Size(20,10));
     * @param {Size} size - 边界大小。
     * @returns {Bounds} 根据传入的边界大小的创建新的边界。
     */
    static fromSize(size) {
      return new Bounds(0, size.h, size.w, 0)
    }

    /**
     * @function Bounds.oppositeQuadrant
     * @description 反转象限。"t"和"b" 交换，"r"和"l"交换, 如："tl"变为"br"。
     * @param {string} quadrant - 代表象限的字符串，如："tl"。
     * @returns {string} 反转后的象限。
     */
    static oppositeQuadrant(quadrant) {
      let opp = "";

      opp += quadrant.charAt(0) === "t" ? "b" : "t";
      opp += quadrant.charAt(1) === "l" ? "r" : "l";

      return opp
    }
  }

  /* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
   * This program are made available under the terms of the Apache License, Version 2.0
   * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html. */

  /**
   * @class GeometryCollection
   * @aliasclass Geometry.Collection
   * @deprecatedclass SuperMap.Geometry.Collection
   * @classdesc 几何对象集合类，存储在本地的 components 属性中（可作为参数传递给构造函数）。<br>
   *            随着新的几何图形添加到集合中，将不能被克隆，当移动几何图形时，需要指定参照物。<br>
   *            getArea 和 getLength 函数只能通过遍历存储几何对象的 components 数组，总计所有几何图形的面积和长度。
   * @category BaseTypes Geometry
   * @extends {Geometry}
   * @param {Array.<Geometry>} components - 几何对象数组。
   * @example
   * var point1 = new GeometryPoint(10,20);
   * var point2 = new GeometryPoint(30,40);
   * var col = new GeometryCollection([point1,point2]);
   * @usage
   */
  class Collection extends Geometry {
    constructor(components) {
      super();

      /**
       * @description 存储几何对象的数组。
       * @member {Array.<Geometry>} GeometryCollection.prototype.components
       */
      this.components = [];

      /**
       * @member {Array.<string>} GeometryCollection.prototype.componentTypes
       * @description components 存储的的几何对象所支持的几何类型数组，为空表示类型不受限制。
       */
      this.componentTypes = null;
      if (components != null) {
        this.addComponents(components);
      }
      this.CLASS_NAME = "SuperMap.Geometry.Collection";
      this.geometryType = "Collection";
    }

    /**
     * @function GeometryCollection.prototype.destroy
     * @description 销毁几何图形。
     */
    destroy() {
      this.components.length = 0;
      this.components = null;
      super.destroy();
    }

    /**
     * @function GeometryCollection.prototype.clone
     * @description 克隆当前几何对象。
     * @returns {GeometryCollection} 克隆的几何对象集合。
     */
    clone() {
      const geometry = new Collection();
      for (let i = 0, len = this.components.length; i < len; i++) {
        geometry.addComponent(this.components[i].clone());
      }

      // catch any randomly tagged-on properties
      Util.applyDefaults(geometry, this);

      return geometry
    }

    /**
     * @function GeometryCollection.prototype.getComponentsString
     * @description 获取 components 字符串。
     * @returns {string} components 字符串。
     */
    getComponentsString() {
      const strings = [];
      for (let i = 0, len = this.components.length; i < len; i++) {
        strings.push(this.components[i].toShortString());
      }
      return strings.join(",")
    }

    /**
     * @function GeometryCollection.prototype.calculateBounds
     * @description 通过遍历数组重新计算边界，在遍历每一子项中时调用 extend 方法。
     */
    calculateBounds() {
      this.bounds = null;
      const bounds = new Bounds();
      const components = this.components;
      if (components) {
        for (let i = 0, len = components.length; i < len; i++) {
          bounds.extend(components[i].getBounds());
        }
      }
      // to preserve old behavior, we only set bounds if non-null
      // in the future, we could add bounds.isEmpty()
      if (bounds.left != null && bounds.bottom != null && bounds.right != null && bounds.top != null) {
        this.setBounds(bounds);
      }
    }

    /**
     * @function GeometryCollection.prototype.addComponents
     * @description 给几何图形对象添加元素。
     * @param {Array.<Geometry>} components - 几何对象组件。
     * @example
     * var geometryCollection = new GeometryCollection();
     * geometryCollection.addComponents(new SuerpMap.Geometry.Point(10,10));
     */
    addComponents(components) {
      if (!Util.isArray(components)) {
        components = [components];
      }
      for (let i = 0, len = components.length; i < len; i++) {
        this.addComponent(components[i]);
      }
    }

    /**
     * @function GeometryCollection.prototype.addComponent
     * @description 添加几何对象到集合中。如果设置了 componentTypes 类型，则添加的几何对象必须是 componentTypes 中的类型。
     * @param {Geometry} component - 待添加的几何对象。
     * @param {number} [index] - 几何对象插入的位置。
     * @returns {boolean} 是否添加成功。
     */
    addComponent(component, index) {
      let added = false;
      if (component) {
        if (this.componentTypes == null || Util.indexOf(this.componentTypes, component.CLASS_NAME) > -1) {
          if (index != null && index < this.components.length) {
            const components1 = this.components.slice(0, index);
            const components2 = this.components.slice(index, this.components.length);
            components1.push(component);
            this.components = components1.concat(components2);
          } else {
            this.components.push(component);
          }
          component.parent = this;
          this.clearBounds();
          added = true;
        }
      }
      return added
    }

    /**
     * @function GeometryCollection.prototype.removeComponents
     * @description 清除几何对象。
     * @param {Array.<Geometry>} components - 需要清除的几何对象。
     * @returns {boolean} 元素是否被删除。
     */
    removeComponents(components) {
      let removed = false;

      if (!Util.isArray(components)) {
        components = [components];
      }
      for (let i = components.length - 1; i >= 0; --i) {
        removed = this.removeComponent(components[i]) || removed;
      }
      return removed
    }

    /**
     * @function GeometryCollection.prototype.removeComponent
     * @description 从集合中移除几何对象。
     * @param {Geometry} component - 要移除的几何对象。
     * @returns {boolean} 几何对象是否移除成功。
     */
    removeComponent(component) {
      Util.removeItem(this.components, component);

      // clearBounds() so that it gets recalculated on the next call
      // to this.getBounds();
      this.clearBounds();
      return true
    }

    /**
     * @function GeometryCollection.prototype.getArea
     * @description 计算几何对象的面积。注意，这个方法在 {@link GeometryPolygon} 类中需要重写。
     * @returns {number} 几何图形的面积，是几何对象中所有组成部分的面积之和。
     */
    getArea() {
      let area = 0.0;
      for (let i = 0, len = this.components.length; i < len; i++) {
        area += this.components[i].getArea();
      }
      return area
    }

    /**
     * @function GeometryCollection.prototype.equals
     * @description 判断两个几何图形是否相等。如果所有的 components 具有相同的坐标，则认为是相等的。
     * @param {Geometry} geometry - 需要判断的几何图形。
     * @returns {boolean} 输入的几何图形与当前几何图形是否相等。
     */
    equals(geometry) {
      let equivalent = true;
      if (!geometry || !geometry.CLASS_NAME || this.CLASS_NAME !== geometry.CLASS_NAME) {
        equivalent = false;
      } else if (!Util.isArray(geometry.components) || geometry.components.length !== this.components.length) {
        equivalent = false;
      } else {
        for (let i = 0, len = this.components.length; i < len; ++i) {
          if (!this.components[i].equals(geometry.components[i])) {
            equivalent = false;
            break
          }
        }
      }
      return equivalent
    }

    /**
     * @function GeometryCollection.prototype.getVertices
     * @description 返回几何对象的所有结点的列表。
     * @param {boolean} [nodes] - 对于线来说，仅仅返回作为端点的顶点，如果设为 false，则返回非端点的顶点如果没有设置此参数，则返回所有顶点。
     * @returns {Array} 几何对象的顶点列表。
     */
    getVertices(nodes) {
      const vertices = [];
      for (let i = 0, len = this.components.length; i < len; ++i) {
        Array.prototype.push.apply(vertices, this.components[i].getVertices(nodes));
      }
      return vertices
    }
  }

  /* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
   * This program are made available under the terms of the Apache License, Version 2.0
   * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html. */

  /**
   * @class Format
   * @deprecatedclass SuperMap.Format
   * @classdesc 读写各种格式的格式类基类。其子类应该包含并实现 read 和 write 方法。
   * @category BaseTypes Format
   * @param {Object} options - 可选参数。
   * @param {boolean} [options.keepData=false] - 如果设置为 true， data 属性会指向被解析的对象（例如 JSON 或 xml 数据对象）。
   * @param {Object} [options.data] - 当 keepData 属性设置为 true，这是传递给 read 操作的要被解析的字符串。
   * @usage
   */
  class Format {
    constructor(options) {
      /**
       * @member {Object} Format.prototype.data
       * @description 当 keepData 属性设置为 true，这是传递给 read 操作的要被解析的字符串。
       */
      this.data = null;

      /**
       * @member {Object} [Format.prototype.keepData=false]
       * @description 保持最近读到的数据的引用（通过 data 属性）。
       */
      this.keepData = false;

      Util.extend(this, options);
      this.options = options;

      this.CLASS_NAME = "SuperMap.Format";
    }

    /**
     * @function Format.prototype.destroy
     * @description 销毁该格式类，释放相关资源。
     */
    destroy() {
      // 用来销毁该格式类，释放相关资源
    }

    /**
     * @function Format.prototype.read
     * @description 来从字符串中读取数据。
     * @param {string} data - 读取的数据。
     */
    read(data) {
      // eslint-disable-line no-unused-vars
      // 用来从字符串中读取数据
    }

    /**
     * @function Format.prototype.write
     * @description 将对象写成字符串。
     * @param {Object} object - 可序列化的对象。
     * @returns {string} 对象转化后的字符串。
     */
    write(object) {
      // eslint-disable-line no-unused-vars
      // 用来写字符串
    }
  }

  /* eslint-disable no-useless-call */
  /* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
   * This program are made available under the terms of the Apache License, Version 2.0
   * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html. */

  /**
   * @class JSONFormat
   * @aliasclass Format.JSON
   * @deprecatedclass SuperMap.Format.JSON
   * @classdesc 安全的读写 JSON 的解析类。使用 {@link JSONFormat} 构造函数创建新实例。
   * @category BaseTypes Format
   * @param {Object} [options] - 可选参数。
   * @param {string} [options.indent="    "] - 用于格式化输出，indent 字符串会在每次缩进的时候使用一次。
   * @param {string} [options.space=" "] - 用于格式化输出，space 字符串会在名值对的 ":" 后边添加。
   * @param {string} [options.newline="\n"] - 用于格式化输出, newline 字符串会用在每一个名值对或数组项末尾。
   * @param {number} [options.level=0] - 用于格式化输出, 表示的是缩进级别。
   * @param {boolean} [options.pretty=false] - 是否在序列化的时候使用额外的空格控制结构。在 write 方法中使用。
   * @param {boolean} [options.nativeJSON] - 需要被注册的监听器对象。
   * @extends {Format}
   * @usage
   */
  class JSONFormat extends Format {
    constructor(options) {
      super(options);
      /**
       * @member {string} [JSONFormat.prototype.indent="    "]
       * @description 用于格式化输出，indent 字符串会在每次缩进的时候使用一次。
       */
      this.indent = "    ";

      /**
       * @member {string} [JSONFormat.prototype.space=" "]
       * @description 用于格式化输出，space 字符串会在名值对的 ":" 后边添加。
       */
      this.space = " ";

      /**
       * @member {string} [JSONFormat.prototype.newline="\n"]
       * @description 用于格式化输出, newline 字符串会用在每一个名值对或数组项末尾。
       */
      this.newline = "\n";

      /**
       * @member {number} [JSONFormat.prototype.level=0]
       * @description 用于格式化输出, 表示的是缩进级别。
       */
      this.level = 0;

      /**
       * @member {boolean} [JSONFormat.prototype.pretty=false]
       * @description 是否在序列化的时候使用额外的空格控制结构。在 write 方法中使用。
       */
      this.pretty = false;

      /**
       * @member {boolean} JSONFormat.prototype.nativeJSON
       * @description 判断浏览器是否原生支持 JSON 格式数据。
       */
      this.nativeJSON = (function () {
        return !!(window.JSON && typeof JSON.parse === "function" && typeof JSON.stringify === "function")
      })();

      this.CLASS_NAME = "SuperMap.Format.JSON";
      /**
       * @member JSONFormat.prototype.serialize
       * @description 提供一些类型对象转 JSON 字符串的方法。
       */
      this.serialize = {
        /**
         * @function JSONFormat.serialize.object
         * @description 把对象转换为 JSON 字符串。
         * @param {Object} object - 可序列化的对象。
         * @returns {string} JSON 字符串。
         */
        object: function (object) {
          // three special objects that we want to treat differently
          if (object == null) {
            return "null"
          }
          if (object.constructor === Date) {
            return this.serialize.date.apply(this, [object])
          }
          if (object.constructor === Array) {
            return this.serialize.array.apply(this, [object])
          }
          let pieces = ["{"];
          this.level += 1;
          let key, keyJSON, valueJSON;

          let addComma = false;
          for (key in object) {
            if (object.hasOwnProperty(key)) {
              // recursive calls need to allow for sub-classing
              keyJSON = this.write.apply(this, [key, this.pretty]);
              valueJSON = this.write.apply(this, [object[key], this.pretty]);
              if (keyJSON != null && valueJSON != null) {
                if (addComma) {
                  pieces.push(",");
                }
                pieces.push(this.writeNewline(), this.writeIndent(), keyJSON, ":", this.writeSpace(), valueJSON);
                addComma = true;
              }
            }
          }

          this.level -= 1;
          pieces.push(this.writeNewline(), this.writeIndent(), "}");
          return pieces.join("")
        },

        /**
         * @function JSONFormat.serialize.array
         * @description 把数组转换成 JSON 字符串。
         * @param {Array} array - 可序列化的数组。
         * @returns {string} JSON 字符串。
         */
        array: function (array) {
          let json;
          let pieces = ["["];
          this.level += 1;

          for (let i = 0, len = array.length; i < len; ++i) {
            // recursive calls need to allow for sub-classing
            json = this.write.apply(this, [array[i], this.pretty]);
            if (json != null) {
              if (i > 0) {
                pieces.push(",");
              }
              pieces.push(this.writeNewline(), this.writeIndent(), json);
            }
          }

          this.level -= 1;
          pieces.push(this.writeNewline(), this.writeIndent(), "]");
          return pieces.join("")
        },

        /**
         * @function JSONFormat.serialize.string
         * @description 把字符串转换成 JSON 字符串。
         * @param {string} string - 可序列化的字符串。
         * @returns {string} JSON 字符串。
         */
        string: function (string) {
          // If the string contains no control characters, no quote characters, and no
          // backslash characters, then we can simply slap some quotes around it.
          // Otherwise we must also replace the offending characters with safe
          // sequences.
          let m = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
          };
          /* eslint-disable no-control-regex */
          if (/["\\\x00-\x1f]/.test(string)) {
            return (
              '"' +
              string.replace(/([\x00-\x1f\\"])/g, function (a, b) {
                let c = m[b];
                if (c) {
                  return c
                }
                c = b.charCodeAt();
                return "\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(16)
              }) +
              '"'
            )
          }
          return '"' + string + '"'
        },

        /**
         * @function JSONFormat.serialize.number
         * @description 把数字转换成 JSON 字符串。
         * @param {number} number - 可序列化的数字。
         * @returns {string} JSON 字符串。
         */
        number: function (number) {
          return isFinite(number) ? String(number) : "null"
        },

        /**
         * @function JSONFormat.serialize.boolean
         * @description Transform a boolean into a JSON string.
         * @param {boolean} bool - The boolean to be serialized.
         * @returns {string} A JSON string representing the boolean.
         */
        boolean: function (bool) {
          return String(bool)
        },

        /**
         * @function JSONFormat.serialize.object
         * @description 将日期对象转换成 JSON 字符串。
         * @param {Date} date - 可序列化的日期对象。
         * @returns {string} JSON 字符串。
         */
        date: function (date) {
          function format(number) {
            // Format integers to have at least two digits.
            return number < 10 ? "0" + number : number
          }

          return (
            '"' +
            date.getFullYear() +
            "-" +
            format(date.getMonth() + 1) +
            "-" +
            format(date.getDate()) +
            "T" +
            format(date.getHours()) +
            ":" +
            format(date.getMinutes()) +
            ":" +
            format(date.getSeconds()) +
            '"'
          )
        }
      };
    }

    /**
     * @function JSONFormat.prototype.read
     * @description 将一个符合 JSON 结构的字符串进行解析。
     * @param {string} json - 符合 JSON 结构的字符串。
     * @param {function} filter - 过滤方法，最终结果的每一个键值对都会调用该过滤方法，并在对应的值的位置替换成该方法返回的值。
     * @returns {(Object|string|Array|number|boolean)} 对象，数组，字符串或数字。
     */
    read(json, filter) {
      let object;
      if (this.nativeJSON) {
        try {
          object = JSON.parse(json, filter);
        } catch (e) {
          // Fall through if the regexp test fails.
          return { data: json }
        }
      }

      if (this.keepData) {
        this.data = object;
      }

      return object
    }

    /**
     * @function JSONFormat.prototype.write
     * @description 序列化一个对象到一个符合 JSON 格式的字符串。
     * @param {Object|string|Array|number|boolean} value - 需要被序列化的对象，数组，字符串，数字，布尔值。
     * @param {boolean} [pretty=false] - 是否在序列化的时候使用额外的空格控制结构。在 write 方法中使用。
     * @returns {string} 符合 JSON 格式的字符串。
     *
     */
    write(value, pretty) {
      this.pretty = !!pretty;
      let json = null;
      let type = typeof value;
      if (this.serialize[type]) {
        try {
          json = !this.pretty && this.nativeJSON ? JSON.stringify(value) : this.serialize[type].apply(this, [value]);
        } catch (err) {
          // console.error("Trouble serializing: " + err);
        }
      }
      return json
    }

    /**
     * @function JSONFormat.prototype.writeIndent
     * @description 根据缩进级别输出一个缩进字符串。
     * @private
     * @returns {string} 一个适当的缩进字符串。
     */
    writeIndent() {
      let pieces = [];
      if (this.pretty) {
        for (let i = 0; i < this.level; ++i) {
          pieces.push(this.indent);
        }
      }
      return pieces.join("")
    }

    /**
     * @function JSONFormat.prototype.writeNewline
     * @description 在格式化输出模式情况下输出代表新一行的字符串。
     * @private
     * @returns {string} 代表新的一行的字符串。
     */
    writeNewline() {
      return this.pretty ? this.newline : ""
    }

    /**
     * @function JSONFormat.prototype.writeSpace
     * @private
     * @description 在格式化输出模式情况下输出一个代表空格的字符串。
     * @returns {string} 空格字符串。
     */
    writeSpace() {
      return this.pretty ? this.space : ""
    }
  }

  /* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
   * This program are made available under the terms of the Apache License, Version 2.0
   * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html. */

  /**
   * @class GeometryPoint
   * @aliasclass Geometry.Point
   * @deprecatedclass SuperMap.Geometry.Point
   * @classdesc 点几何对象类。
   * @category BaseTypes Geometry
   * @extends {Geometry}
   * @param {number} x - x 坐标。
   * @param {number} y - y 坐标。
   * @param {string} [type = 'Point'] - 点的类型。
   * @param {number} [tag] - 额外的属性，比如差值分析中的 Z 值。
   * @example
   * var point = new GeometryPoint(-111.04, 45.68);
   * @usage
   */
  class Point extends Geometry {
    constructor(x, y, type, tag) {
      super(x, y, type, tag);
      /**
       * @member {number} GeometryPoint.prototype.x
       * @description 横坐标。
       */
      this.x = parseFloat(x);

      /**
       * @member {number} GeometryPoint.prototype.y
       * @description 纵坐标。
       */
      this.y = parseFloat(y);

      /**
       * @member {string} GeometryPoint.prototype.tag
       * @description  用来存储额外的属性，比如差值分析中的 Z 值。
       */
      this.tag = tag || tag == 0 ? parseFloat(tag) : null;

      /**
       * @member {string} GeometryPoint.prototype.type
       * @description  用来存储点的类型
       */
      this.type = type || "Point";
      this.CLASS_NAME = "SuperMap.Geometry.Point";
      this.geometryType = "Point";
    }

    /**
     * @function GeometryPoint.prototype.clone
     * @description 克隆点对象。
     * @returns {GeometryPoint} 克隆后的点对象。
     */
    clone(obj) {
      if (obj == null) {
        obj = new Point(this.x, this.y);
      }

      // catch any randomly tagged-on properties
      Util.applyDefaults(obj, this);

      return obj
    }

    /**
     * @function GeometryPoint.prototype.calculateBounds
     * @description 计算点对象的范围。
     */
    calculateBounds() {
      this.bounds = new Bounds(this.x, this.y, this.x, this.y);
    }

    /**
     * @function GeometryPoint.prototype.equals
     * @description 判断两个点对象是否相等。如果两个点对象具有相同的坐标，则认为是相等的。
     * @example
     * var point= new GeometryPoint(0,0);
     * var point1={x:0,y:0};
     * var result= point.equals(point1);
     * @param {GeometryPoint} geom - 需要判断的点对象。
     * @returns {boolean} 两个点对象是否相等（true 为相等，false 为不等）。
     */
    equals(geom) {
      let equals = false;
      if (geom != null) {
        equals = (this.x === geom.x && this.y === geom.y) || (isNaN(this.x) && isNaN(this.y) && isNaN(geom.x) && isNaN(geom.y));
      }
      return equals
    }

    /**
     * @function GeometryPoint.prototype.move
     * @description 沿着 x、y 轴的正方向上按照给定的位移移动点对象，move 不仅改变了几何对象的位置并且清理了边界缓存。
     * @param {number} x - x 轴正方向上的偏移量。
     * @param {number} y - y 轴正方向上偏移量。
     */
    move(x, y) {
      this.x = this.x + x;
      this.y = this.y + y;
      this.clearBounds();
    }

    /**
     * @function GeometryPoint.prototype.toShortString
     * @description 将 x/y 坐标转换成简单字符串。
     * @returns {string} 字符串代表点对象。(ex. <i>"5, 42"</i>)
     */
    toShortString() {
      return this.x + ", " + this.y
    }

    /**
     * @function GeometryPoint.prototype.destroy
     * @description 释放点对象的资源。
     */
    destroy() {
      this.x = null;
      this.y = null;
      this.tag = null;
      super.destroy();
    }

    /**
     * @function GeometryPoint.prototype.getVertices
     * @description 获取几何图形所有顶点的列表。
     * @returns {Array} 几何图形的顶点列表。
     */
    getVertices() {
      return [this]
    }
  }

  /* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
   * This program are made available under the terms of the Apache License, Version 2.0
   * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html. */

  /**
   * @class GeometryMultiPoint
   * @aliasclass Geometry.MultiPoint
   * @deprecatedclass SuperMap.Geometry.MultiPoint
   * @classdesc 几何对象多点类。
   * @category BaseTypes Geometry
   * @extends GeometryCollection
   * @param {Array.<GeometryPoint>} components - 点对象数组。
   * @example
   * var point1 = new GeometryPoint(5,6);
   * var poine2 = new GeometryMultiPoint(7,8);
   * var multiPoint = new MultiPoint([point1,point2]);
   * @usage
   */
  class MultiPoint extends Collection {
    constructor(components) {
      super(components);
      /**
       * @member {Array.<string>} [GeometryMultiPoint.prototype.componentTypes=["SuperMap.Geometry.Point"]]
       * @description components 存储的的几何对象所支持的几何类型数组。
       * @readonly
       */
      this.componentTypes = ["SuperMap.Geometry.Point"];
      this.CLASS_NAME = "SuperMap.Geometry.MultiPoint";
      this.geometryType = "MultiPoint";
    }

    /**
     * @function GeometryMultiPoint.prototype.addPoint
     * @description 添加点，封装了 {@link GeometryCollection|GeometryCollection.addComponent} 方法。
     * @param {GeometryPoint} point - 添加的点。
     * @param {number} [index] - 下标。
     */
    addPoint(point, index) {
      this.addComponent(point, index);
    }

    /**
     * @function GeometryMultiPoint.prototype.removePoint
     * @description 移除点，封装了 {@link GeometryCollection|GeometryCollection.removeComponent} 方法。
     * @param {GeometryPoint} point - 移除的点对象。
     */
    removePoint(point) {
      this.removeComponent(point);
    }
  }

  /* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
   * This program are made available under the terms of the Apache License, Version 2.0
   * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html. */

  /**
   * @class GeometryCurve
   * @aliasclass Geometry.Curve
   * @deprecatedclass SuperMap.Geometry.Curve
   * @classdesc 几何对象曲线类。
   * @category BaseTypes Geometry
   * @extends GeometryMultiPoint
   * @param {Array.<GeometryPoint>} components - 几何对象数组。
   * @example
   * var point1 = new GeometryPoint(10,20);
   * var point2 = new GeometryPoint(30,40);
   * var curve = new Curve([point1,point2]);
   * @usage
   */
  class Curve extends MultiPoint {
    constructor(components) {
      super(components);
      /**
       * @member {Array.<string>} [GeometryCurve.prototype.componentTypes=["SuperMap.Geometry.Point", "SuperMap.PointWithMeasure"]]
       * @description components 存储的的几何对象所支持的几何类型数组。
       * @readonly
       */
      this.componentTypes = ["SuperMap.Geometry.Point", "SuperMap.PointWithMeasure"];
      this.CLASS_NAME = "SuperMap.Geometry.Curve";
      this.geometryType = "Curve";
    }
  }

  /* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
   * This program are made available under the terms of the Apache License, Version 2.0
   * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html. */

  /**
   * @class GeometryLineString
   * @aliasclass Geometry.LineString
   * @deprecatedclass SuperMap.Geometry.LineString
   * @classdesc 几何对象线串类。
   * @category BaseTypes Geometry
   * @param {Array.<GeometryPoint>} points - 用来生成线串的点数组。
   * @extends GeometryCurve
   * @example
   * var points = [new GeometryPoint(4933.319287022352, -3337.3849141502124),
   *     new GeometryPoint(4960.9674060199022, -3349.3316322355736),
   *     new GeometryPoint(5006.0235999418364, -3358.8890067038628),
   *     new GeometryPoint(5075.3145648369318, -3378.0037556404409),
   *     new GeometryPoint(5305.19551436013, -3376.9669111768926)],
   * var roadLine = new GeometryLineString(points)；
   * @usage
   */
  class LineString extends Curve {
    constructor(points) {
      super(points);
      this.CLASS_NAME = "SuperMap.Geometry.LineString";
      this.geometryType = "LineString";
    }

    /**
     * @function GeometryLineString.prototype.removeComponent
     * @description 只有在线串上有三个或更多的点的时候，才会允许移除点（否则结果将会是单一的点）。
     * @param {GeometryPoint} point - 将被删除的点。
     * @returns {boolean} 删除的点。
     */
    removeComponent(point) {
      // eslint-disable-line no-unused-vars
      const removed = this.components && this.components.length > 2;
      if (removed) {
        super.removeComponent.apply(this, arguments);
      }
      return removed
    }

    /**
     * @function GeometryLineString.prototype.getSortedSegments
     * @description 获取升序排列的点坐标对象数组。
     * @returns {Array} 升序排列的点坐标对象数组。
     */
    getSortedSegments() {
      const numSeg = this.components.length - 1;
      const segments = new Array(numSeg);
      let point1;
      let point2;
      for (let i = 0; i < numSeg; ++i) {
        point1 = this.components[i];
        point2 = this.components[i + 1];
        if (point1.x < point2.x) {
          segments[i] = {
            x1: point1.x,
            y1: point1.y,
            x2: point2.x,
            y2: point2.y
          };
        } else {
          segments[i] = {
            x1: point2.x,
            y1: point2.y,
            x2: point1.x,
            y2: point1.y
          };
        }
      }

      // more efficient to define this somewhere static
      function byX1(seg1, seg2) {
        return seg1.x1 - seg2.x1
      }

      return segments.sort(byX1)
    }

    /**
     * @function GeometryLineString.prototype.getVertices
     * @description 返回几何图形的所有顶点的列表。
     * @param {boolean} [nodes] - 对于线来说，仅仅返回作为端点的顶点，如果设为 false，则返回非端点的顶点。如果没有设置此参数，则返回所有顶点。
     * @returns {Array} 几何图形的顶点列表。
     */
    getVertices(nodes) {
      let vertices;
      if (nodes === true) {
        vertices = [this.components[0], this.components[this.components.length - 1]];
      } else if (nodes === false) {
        vertices = this.components.slice(1, this.components.length - 1);
      } else {
        vertices = this.components.slice();
      }
      return vertices
    }

    /**
     * @function GeometryLineString.calculateCircle
     * @description 三点画圆弧。
     * @param {Array.<GeometryPoint>} points - 传入的待计算的初始点串。
     * @returns {Array.<GeometryPoint>} 计算出相应的圆弧控制点。
     * @example
     * var points = [];
     * points.push(new GeometryPoint(-50,30));
     * points.push(new GeometryPoint(-30,50));
     * points.push(new GeometryPoint(2,60));
     * var circle = GeometryLineString.calculateCircle(points);
     */
    static calculateCircle(points) {
      if (points.length < 3) {
        return points
      }
      const centerPoint = {};
      const p1 = points[0];
      const p2 = points[1];
      const p3 = points[2];
      let R = 0;
      let dStep = 0;
      let direc = true;
      let dRotation = 0;
      let dRotationBegin = 0;
      let dRotationAngle = 0;
      const nSegmentCount = 72;
      const circlePoints = [];

      const KTan13 = (p3.y - p1.y) / (p3.x - p1.x);
      const B13 = p3.y - KTan13 * p3.x;
      if (
        (p3.x != p1.x && p3.y != p1.y && p2.y == KTan13 * p2.x + B13) ||
        (p3.x == p1.x && p2.x == p1.x) ||
        (p3.y == p1.y && p2.y == p1.y) ||
        (p3.x == p1.x && p3.y == p1.y) ||
        (p3.x == p2.x && p3.y == p2.y) ||
        (p1.x == p2.x && p1.y == p2.y)
      ) {
        circlePoints.push(p1);
        circlePoints.push(p2);
        circlePoints.push(p3);
      } else {
        const D =
          (p2.x * p2.x + p2.y * p2.y - (p1.x * p1.x + p1.y * p1.y)) * (2 * (p3.y - p1.y)) -
          (p3.x * p3.x + p3.y * p3.y - (p1.x * p1.x + p1.y * p1.y)) * (2 * (p2.y - p1.y));
        const E =
          2 * (p2.x - p1.x) * (p3.x * p3.x + p3.y * p3.y - (p1.x * p1.x + p1.y * p1.y)) -
          2 * (p3.x - p1.x) * (p2.x * p2.x + p2.y * p2.y - (p1.x * p1.x + p1.y * p1.y));
        const F = 4 * ((p2.x - p1.x) * (p3.y - p1.y) - (p3.x - p1.x) * (p2.y - p1.y));
        centerPoint.x = D / F;
        centerPoint.y = E / F;
        R = Math.sqrt((p1.x - centerPoint.x) * (p1.x - centerPoint.x) + (p1.y - centerPoint.y) * (p1.y - centerPoint.y));

        const dis = (p1.x - p3.x) * (p1.x - p3.x) + (p1.y - p3.y) * (p1.y - p3.y);
        let cons = (2 * R * R - dis) / (2 * R * R);
        cons = cons >= 1 ? 1 : cons;
        cons = cons <= -1 ? -1 : cons;
        dRotationAngle = (Math.acos(cons) * 180) / Math.PI;

        if (p3.x == p1.x) {
          dRotationAngle = (centerPoint.x > p1.x && p2.x > p1.x) || (centerPoint.x < p1.x && p2.x < p1.x) ? 360 - dRotationAngle : dRotationAngle;
        } else {
          dRotationAngle =
            (centerPoint.y > KTan13 * centerPoint.x + B13 && p2.y > KTan13 * p2.x + B13) ||
            (centerPoint.y < KTan13 * centerPoint.x + B13 && p2.y < KTan13 * p2.x + B13)
              ? 360 - dRotationAngle
              : dRotationAngle;
        }
        dStep = dRotationAngle / 72;

        if (p3.y != p1.y) {
          if (p3.x == p1.x) {
            if (p3.y > p1.y) {
              if (p2.x < p1.x) {
                direc = false;
              }
            } else {
              if (p2.x > p1.x) {
                direc = false;
              }
            }
          } else if (p3.x < p1.x) {
            if (p2.y < KTan13 * p2.x + B13) {
              direc = false;
            }
          } else {
            if (p2.y > KTan13 * p2.x + B13) {
              direc = false;
            }
          }
        } else {
          if (p3.x > p1.x) {
            if (p2.y > p1.y) {
              direc = false;
            }
          } else {
            if (p2.y < p1.y) {
              direc = false;
            }
          }
        }

        const K10 = (p1.y - centerPoint.y) / (p1.x - centerPoint.x);
        let atan10 = K10 >= 0 ? (Math.atan(K10) * 180) / Math.PI : Math.abs((Math.atan(K10) * 180) / Math.PI) + 90;

        const CY = Math.abs(centerPoint.y);
        if (p1.y == CY && CY == p3.y) {
          if (p1.x < p3.x) {
            atan10 = atan10 + 180;
          }
        }

        const newPY = p1.y - centerPoint.y;
        circlePoints.push(p1);
        for (let i = 1; i < nSegmentCount; i++) {
          dRotation = dStep * i;
          dRotationBegin = atan10;

          if (direc) {
            if (newPY >= 0) {
              if (K10 >= 0) {
                dRotationBegin = dRotationBegin + dRotation;
              } else {
                dRotationBegin = 180 - (dRotationBegin - 90) + dRotation;
              }
            } else {
              if (K10 > 0) {
                dRotationBegin = dRotationBegin - 180 + dRotation;
              } else {
                dRotationBegin = 90 - dRotationBegin + dRotation;
              }
            }
          } else {
            if (newPY >= 0) {
              if (K10 >= 0) {
                dRotationBegin = dRotationBegin - dRotation;
              } else {
                dRotationBegin = 180 - (dRotationBegin - 90) - dRotation;
              }
            } else {
              if (K10 >= 0) {
                dRotationBegin = dRotationBegin - 180 - dRotation;
              } else {
                dRotationBegin = 90 - dRotationBegin - dRotation;
              }
            }
          }

          dRotationBegin = (dRotationBegin * Math.PI) / 180;
          const x = centerPoint.x + R * Math.cos(dRotationBegin);
          const y = centerPoint.y + R * Math.sin(dRotationBegin);
          circlePoints.push(new Point(x, y));
        }
        circlePoints.push(p3);
      }
      return circlePoints
    }

    /**
     * @function GeometryLineString.createLineEPS
     * @description 根据点的类型画出不同类型的曲线。
     * 点的类型有三种：LTypeArc，LTypeCurve，NONE。
     * @param {Array.<GeometryPoint>} points - 传入的待计算的初始点串。
     * @returns {Array.<GeometryPoint>} 计算出相应的 lineEPS 控制点。
     * @example
     * var points = [];
     * points.push(new GeometryPoint(-50,30));
     * points.push(new GeometryPoint(-30,50,"LTypeArc"));
     * points.push(new GeometryPoint(2,60));
     * points.push(new GeometryPoint(8,20));
     * var lineEPS = GeometryLineString.createLineEPS(points);
     */
    static createLineEPS(points) {
      let list = [];
      const len = points.length;
      if (len < 2) {
        return points
      }
      for (let i = 0; i < len;) {
        const type = points[i].type;
        if (type == "LTypeArc") {
          const listObj = LineString.createLineArc(list, i, len, points);
          list = listObj[0];
          i = listObj[1];
        } else {
          list.push(points[i]);
          i++;
        }
      }
      return list
    }

    static createLineArc(list, i, len, points) {
      if (i == 0) {
        const bezierPtsObj = LineString.addPointEPS(points, i, len, "LTypeArc");
        Array.prototype.push.apply(list, bezierPtsObj[0]);
        i = bezierPtsObj[1] + 1;
      } else if (i == len - 1) {
        const bezierP = [points[i - 1], points[i]];
        const bezierPts = LineString.calculateCircle(bezierP);
        Array.prototype.push.apply(list, bezierPts);
        i++;
      } else {
        const bezierPtsObj = LineString.addPointEPS(points, i, len, "LTypeArc");
        list.pop();
        Array.prototype.push.apply(list, bezierPtsObj[0]);
        i = bezierPtsObj[1] + 1;
      }
      return [list, i]
    }

    static addPointEPS(points, i, len, type) {
      const bezierP = [];
      const j = i + 1;
      if (i == 0) {
        Array.prototype.push.apply(bezierP, [points[i], points[i + 1]]);
      } else if (i == len - 1) {
        Array.prototype.push.apply(bezierP, [points[i - 1], points[i]]);
      } else {
        Array.prototype.push.apply(bezierP, [points[i - 1], points[i], points[i + 1]]);
      }
      let bezierPts;
      if (type == "LTypeCurve") {
        bezierPts = LineString.calculatePointsFBZN(bezierP);
      } else if (type == "LTypeArc") {
        bezierPts = LineString.calculateCircle(bezierP);
      }
      return [bezierPts, j]
    }
  }

  /* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
   * This program are made available under the terms of the Apache License, Version 2.0
   * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html. */

  /**
   * @class GeometryMultiLineString
   * @aliasclass Geometry.MultiLineString
   * @deprecatedclass SuperMap.Geometry.MultiLineString
   * @classdesc 几何对象多线类。
   * @category BaseTypes Geometry
   * @extends GeometryCollection
   * @param {Array.<GeometryLineString>} components - GeometryLineString 数组。
   * @example
   * var multi = new GeometryMultiLineString([
   *      new GeometryLineString([
   *          new GeometryPoint(1, 0),
   *          new GeometryPoint(0, 1)
   *      ])
   *  ]);
   * @usage
   */
  class MultiLineString extends Collection {
    constructor(components) {
      super(components);
      /**
       * @member {Array.<string>} [GeometryMultiLineString.prototype.componentTypes=["SuperMap.Geometry.LineString"]]
       * @description components 存储的的几何对象所支持的几何类型数组。
       * @readonly
       */
      this.componentTypes = ["SuperMap.Geometry.LineString"];
      this.CLASS_NAME = "SuperMap.Geometry.MultiLineString";
      this.geometryType = "MultiLineString";
    }
  }

  /* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
   * This program are made available under the terms of the Apache License, Version 2.0
   * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html. */

  /**
   * @class  GeometryLinearRing
   * @aliasclass Geometry.LinearRing
   * @deprecatedclass SuperMap.Geometry.LinearRing
   * @classdesc 几何对象线环类，是一个特殊的封闭的线串，在每次 addPoint/removePoint 之后会通过添加一个点（此点是复制的第一个点得到的）
   * 作为最后的一个点来自动关闭线环。
   * @category BaseTypes Geometry
   * @extends GeometryLineString
   * @param {Array.<GeometryPoint>} points - 组成线性环的点。
   * @example
   * var points = [new GeometryPoint(4933.319287022352, -3337.3849141502124),
   *      new GeometryPoint(4960.9674060199022, -3349.3316322355736),
   *      new GeometryPoint(5006.0235999418364, -3358.8890067038628),
   *      new GeometryPoint(5075.3145648369318, -3378.0037556404409),
   *      new GeometryPoint(5305.19551436013, -3376.9669111768926)],
   * var linearRing = new GeometryLinearRing(points);
   * @usage
   */
  class LinearRing extends LineString {
    constructor(points) {
      super(points);
      /**
       * @member {Array.<string>} [GeometryLinearRing.prototype.componentTypes=["SuperMap.Geometry.Point"]]
       * @description components 存储的的几何对象所支持的几何类型数组，为空表示类型不受限制。
       * @readonly
       */
      this.componentTypes = ["SuperMap.Geometry.Point"];
      this.CLASS_NAME = "SuperMap.Geometry.LinearRing";
      this.geometryType = "LinearRing";
    }

    /**
     * @function GeometryLinearRing.prototype.addComponent
     * @description 添加一个点到几何图形数组中，如果这个点将要被添加到组件数组的末端，并且与数组中已经存在的最后一个点相同，
     * 重复的点是不能被添加的。这将影响未关闭环的关闭。
     * 这个方法可以通过将非空索引（组件数组的下标）作为第二个参数重写。
     * @param {GeometryPoint} point - 点对象。
     * @param {number} [index] - 插入组件数组的下标。
     * @returns {boolean} 点对象是否添加成功。
     */
    addComponent(point, index) {
      let added = false;

      // remove last point
      const lastPoint = this.components.pop();

      // given an index, add the point
      // without an index only add non-duplicate points
      if (index != null || !point.equals(lastPoint)) {
        added = super.addComponent.apply(this, arguments);
      }

      // append copy of first point
      const firstPoint = this.components[0];
      super.addComponent.apply(this, [firstPoint]);

      return added
    }

    /**
     * @function GeometryLinearRing.prototype.removeComponent
     * @description 从几何组件中删除一个点。
     * @param {GeometryPoint} point - 点对象。
     * @returns {boolean} 点对象是否删除。
     */
    removeComponent(point) {
      // eslint-disable-line no-unused-vars
      const removed = this.components && this.components.length > 3;
      if (removed) {
        // remove last point
        this.components.pop();

        // remove our point
        super.removeComponent.apply(this, arguments);
        // append copy of first point
        const firstPoint = this.components[0];
        super.addComponent.apply(this, [firstPoint]);
      }
      return removed
    }

    /**
     * @function GeometryLinearRing.prototype.getArea
     * @description 获得当前几何对象区域大小，如果是沿顺时针方向的环则是正值，否则为负值。
     * @returns {number} 环的面积。
     */
    getArea() {
      let area = 0.0;
      if (this.components && this.components.length > 2) {
        let sum = 0.0;
        for (let i = 0, len = this.components.length; i < len - 1; i++) {
          const b = this.components[i];
          const c = this.components[i + 1];
          sum += (b.x + c.x) * (c.y - b.y);
        }
        area = -sum / 2.0;
      }
      return area
    }

    /**
     * @function GeometryLinearRing.prototype.getVertices
     * @description 返回几何图形的所有点的列表。
     * @param {boolean} [nodes] - 对于线来说，仅仅返回作为端点的顶点，如果设为 false ，则返回非端点的顶点，如果没有设置此参数，则返回所有顶点。
     * @returns {Array} 几何对象所有点的列表。
     */
    getVertices(nodes) {
      return nodes === true ? [] : this.components.slice(0, this.components.length - 1)
    }
  }

  /* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
   * This program are made available under the terms of the Apache License, Version 2.0
   * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html. */

  /**
   * @class GeometryPolygon
   * @aliasclass Geometry.Polygon
   * @deprecatedclass SuperMap.Geometry.Polygon
   * @classdesc  多边形几何对象类。
   * @category BaseTypes Geometry
   * @extends GeometryCollection
   * @param {Array.<GeometryLinearRing>} components - 多边形的线环数组。
   * @example
   * var points =[new GeometryPoint(0,4010338),
   *      new GeometryPoint(1063524,4010338),
   *      new GeometryPoint(1063524,3150322),
   *      new GeometryPoint(0,3150322)
   *  ],
   *  var linearRings = new GeometryLinearRing(points),
   *  var  region = new GeometryPolygon([linearRings]);
   * @usage
   */
  class Polygon extends Collection {
    constructor(components) {
      super(components);
      /**
       * @member {Array.<string>} [GeometryPolygon.prototype.componentTypes=["SuperMap.Geometry.LinearRing"]]
       * @description components 存储的的几何对象所支持的几何类型数组。
       * @readonly
       */
      this.componentTypes = ["SuperMap.Geometry.LinearRing"];
      this.CLASS_NAME = "SuperMap.Geometry.Polygon";
      this.geometryType = "Polygon";
    }

    /**
     * @function GeometryMultiPoint.prototype.getArea
     * @description 获得区域面积，从区域的外部口径减去计此区域内部口径算所得的面积。
     * @returns {number} 几何对象的面积。
     */
    getArea() {
      let area = 0.0;
      if (this.components && this.components.length > 0) {
        area += Math.abs(this.components[0].getArea());
        for (let i = 1, len = this.components.length; i < len; i++) {
          area -= Math.abs(this.components[i].getArea());
        }
      }
      return area
    }
  }

  /* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
   * This program are made available under the terms of the Apache License, Version 2.0
   * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html. */

  /**
   * @class GeometryMultiPolygon
   * @aliasclass Geometry.MultiPolygon
   * @deprecatedclass SuperMap.Geometry.MultiPolygon
   * @classdesc 几何对象多多边形类。
   * @category BaseTypes Geometry
   * @extends GeometryCollection
   * @param  {Array.<GeometryPolygon>} components - 形成 GeometryMultiPolygon 的多边形数组。
   * @example
   * var points1 = [new GeometryPoint(10,10),new GeometryPoint(0,0)];
   * var points2 = [new GeometryPoint(10,10),new GeometryPoint(0,0),new GeometryPoint(3,3),new GeometryPoint(10,10)];
   *
   * var linearRing1 = new GeometryLinearRing(points1);
   * var linearRing2 = new GeometryLinearRing(points2);
   *
   * var polygon1 = new GeometryPolygon([linearRing1]);
   * var polygon2 = new GeometryPolygon([linearRing2]);
   *
   * var multiPolygon1 = new GeometryMultiPolygon([polygon1,polygon2]);
   * @usage
   */
  class MultiPolygon extends Collection {
    constructor(components) {
      super(components);
      /**
       * @member {Array.<string>} [GeometryMultiPolygon.prototype.componentTypes=["SuperMap.Geometry.Polygon"]]
       * @description components 存储的的几何对象所支持的几何类型数组。
       * @readonly
       */
      this.componentTypes = ["SuperMap.Geometry.Polygon"];
      this.CLASS_NAME = "SuperMap.Geometry.MultiPolygon";
      this.geometryType = "MultiPolygon";
    }
  }

  /**
   * @enum GeometryType
   * @description 几何对象枚举,定义了一系列几何对象类型。
   * @category BaseTypes Constant
   * @type {string}
   * @usage
   * ```
   * // 浏览器
   * <script type="text/javascript" src="{cdn}"></script>
   * <script>
   *   const result = {namespace}.GeometryType.LINE;
   *
   * </script>
   * // ES6 Import
   * import { GeometryType } from '{npm}';
   *
   * const result = GeometryType.LINE;
   * ```
   */
  const GeometryType = {
    /** LINE */
    LINE: "LINE",
    /** LINEM */
    LINEM: "LINEM",
    /** POINT */
    POINT: "POINT",
    /** REGION */
    REGION: "REGION",
    /** POINTEPS */
    POINTEPS: "POINTEPS",
    /** LINEEPS */
    LINEEPS: "LINEEPS",
    /** REGIONEPS */
    REGIONEPS: "REGIONEPS",
    /** GEOCOMPOUND */
    GEOCOMPOUND: "GEOCOMPOUND"
  };

  /* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
   * This program are made available under the terms of the Apache License, Version 2.0
   * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html. */

  /**
   * @class ServerColor
   * @deprecatedclass SuperMap.ServerColor
   * @category iServer Map Theme
   * @classdesc 颜色类。该类使用三原色（ RGB ）来表达颜色。
   * @param {Object} options - 可选参数。
   * @param {number} [options.red=255] - 获取或设置红色值。
   * @param {number} [options.green=0] - 获取或设置绿色值。
   * @param {number} [options.blue=0] - 获取或设置蓝色值。
   * @usage
   */
  class ServerColor {
    constructor(red, green, blue) {
      /**
       * @member {number} [ServerColor.prototype.red=255]
       * @description 获取或设置红色值。
       */
      this.red = !red && red != 0 ? 255 : red;

      /**
       * @member {number} [ServerColor.prototype.green=0]
       * @description 获取或设置绿色值。
       */
      this.green = green || 0;

      /**
       * @member {number} [ServerColor.prototype.blue=0]
       * @description 获取或设置蓝色值。
       */
      this.blue = blue || 0;

      this.CLASS_NAME = "SuperMap.ServerColor";
    }

    /**
     * @function ServerColor.prototype.destroy
     * @description 释放资源，将引用资源的属性置空。
     */
    destroy() {
      const me = this;
      me.red = null;
      me.green = null;
      me.blue = null;
    }

    /**
     * @function ServerColor.formJson
     * @description 将 JSON 对象转化为 ServerColor 对象。
     * @param {Object} jsonObject - 要转换的 JSON 对象。
     * @returns {ServerColor} 转化后的 ServerColor 对象。
     */
    static fromJson(jsonObject) {
      if (!jsonObject) {
        return
      }
      const color = new ServerColor();
      let red = 255;
      if (jsonObject.red !== null) {
        red = Number(jsonObject.red);
      }
      color.red = red;

      let green = 0;
      if (jsonObject.green !== null) {
        green = Number(jsonObject.green);
      }
      color.green = green;

      let blue = 0;
      if (jsonObject.blue !== null) {
        blue = Number(jsonObject.blue);
      }
      color.blue = blue;
      return color
    }
  }

  /* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
   * This program are made available under the terms of the Apache License, Version 2.0
   * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html. */

  /**
   * @class ServerStyle
   * @deprecatedclass SuperMap.ServerStyle
   * @category  iServer Map Theme
   * @classdesc 服务端矢量要素风格类。该类用于定义点状符号、线状符号、填充符号风格及其相关属性。
   * @param {Object} options - 参数。
   * @param {FillGradientMode} options.fillGradientMode - 渐变填充风格的渐变类型。
   * @param {ServerColor} [options.fillBackColor=[255,255,255]] - 填充背景颜色。
   * @param {boolean} [options.fillBackOpaque=false] - 背景是否不透明。
   * @param {ServerColor} [options.fillForeColor=[255,0,0]] - 填充颜色。
   * @param {number} [options.fillGradientAngle=0] - 渐变填充的旋转角度。
   * @param {number} [options.fillGradientOffsetRatioX=0] - 渐变填充中心点相对于填充区域范围中心点的水平偏移百分比。
   * @param {number} [options.fillGradientOffsetRatioY=0] - 填充中心点相对于填充区域范围中心点的垂直偏移百分比。
   * @param {number} [options.fillOpaqueRate=100] - 填充不透明度。
   * @param {number} [options.fillSymbolID=0] - 填充符号的编码。
   * @param {ServerColor} [options.lineColor] - 矢量要素的边线颜色。默认 lineColor = new ServerColor(0, 0, 0)。
   * @param {number} [options.lineSymbolID=0] - 线状符号的编码。
   * @param {number} [options.lineWidth=1] - 边线的宽度。
   * @param {number} [options.markerAngle=0] - 点状符号的旋转角度。
   * @param {number} [options.markerSize=1] - 点状符号的大小。
   * @param {number} [options.markerSymbolID=-1] - 点状符号的编码。
   * @usage
   */
  class ServerStyle {
    constructor(options) {
      /**
       * @member {ServerColor} ServerStyle.prototype.fillBackColor
       * @description 填充背景颜色。当填充模式为渐变填充时，该颜色为填充终止色。
       */
      this.fillBackColor = new ServerColor(255, 255, 255);

      /**
       * @member {boolean} [ServerStyle.prototype.fillBackOpaque=false]
       * @description 背景是否不透明。false 表示透明。
       */
      this.fillBackOpaque = false;

      /**
       * @member {ServerColor} ServerStyle.prototype.fillForeColor
       * @description 填充颜色。当填充模式为渐变填充时，该颜色为填充起始颜色。
       */
      this.fillForeColor = new ServerColor(255, 0, 0);

      /**
       * @member {FillGradientMode} ServerStyle.prototype.fillGradientMode
       * @description 渐变填充风格的渐变类型。
       */
      this.fillGradientMode = null;

      /**
       * @member {number} ServerStyle.prototype.fillGradientAngle -
       * @description 渐变填充的旋转角度。单位为度，精确到 0.1 度，逆时针方向为正方向。
       */
      this.fillGradientAngle = 0;

      /**
       * @member {number} ServerStyle.prototype.fillGradientOffsetRatioX
       * @description 渐变填充中心点相对于填充区域范围中心点的水平偏移百分比。它们的关系如下：设填充区域范围中心点的坐标为（x0, y0），
       *              填充中心点的坐标为（x, y），填充区域范围的宽度为 a，水平偏移百分比为 dx，则 x=x0 + a*dx/100。
       */
      this.fillGradientOffsetRatioX = 0;

      /**
       * @member {number} ServerStyle.prototype.fillGradientOffsetRatioY
       * @description 填充中心点相对于填充区域范围中心点的垂直偏移百分比。它们的关系如下：<br>
       *              设填充区域范围中心点的坐标为（x0, y0），填充中心点的坐标为（x, y），填充区域范围的高度为 b，垂直偏移百分比为 dy，则 y=y0 + b*dx/100。
       */
      this.fillGradientOffsetRatioY = 0;

      /**
       * @member {number} [ServerStyle.prototype.fillOpaqueRate=100]
       * @description 填充不透明度。合法值为 0 - 100 的数值。其中为 0 表示完全透明；
       *              100 表示完全不透明。赋值小于 0 时按照 0 处理，大于 100 时按照 100 处理。
       */
      this.fillOpaqueRate = 100;

      /**
       * @member {number} ServerStyle.prototype.fillSymbolID
       * @description 填充符号的编码。此编码用于唯一标识各普通填充风格的填充符号。
       *              关于填充符号的样式与对应的 ID 号请在 SuperMap 桌面软件中查找。
       */
      this.fillSymbolID = 0;

      /**
       * @member {ServerColor} ServerStyle.prototype.lineColor
       * @description 矢量要素的边线颜色。如果等级符号是点符号，点符号的颜色由 lineColor 控制。
       */
      this.lineColor = new ServerColor(0, 0, 0);

      /**
       * @member {number} [ServerStyle.prototype.lineSymbolID=0]
       * @description 线状符号的编码。此编码用于唯一标识各普通填充风格的填充符号。
       *              关于线状符号的样式与对应的 ID 号请在 SuperMap 桌面软件中查找。
       */
      this.lineSymbolID = 0;

      /**
       * @member {number} [ServerStyle.prototype.lineWidth=1.0]
       * @description 边线的宽度。单位为毫米，精度到 0.1。
       */
      this.lineWidth = 1;

      /**
       * @member {number} [ServerStyle.prototype.markerAngle=0]
       * @description 点状符号的旋转角度。以度为单位，精确到 0.1 度，逆时针方向为正方向。
       */
      this.markerAngle = 0;

      /**
       * @member {number} [ServerStyle.prototype.markerSize=1.0]
       * @description 点状符号的大小。单位为毫米，精度为 0.1。当该属性设置为0时，采用符号默认大小 1.0 显示。
       *              当该属性设置为非法值时，交由服务器默认处理。
       */
      this.markerSize = 1;

      /**
       * @member {number} [ServerStyle.prototype.markerSymbolID=-1]
       * @description 点状符号的编码。此编码用于唯一标识各点状符号。
       *              关于线状符号的样式与对应的 ID 号请在 SuperMap 桌面软件中查找。
       */
      this.markerSymbolID = -1;
      if (options) {
        Util.extend(this, options);
      }

      this.CLASS_NAME = "SuperMap.ServerStyle";
    }

    /**
     * @function ServerStyle.prototype.destroy
     * @description 释放资源，将引用资源的属性置空。
     */
    destroy() {
      const me = this;
      if (me.fillBackColor) {
        me.fillBackColor.destroy();
        me.fillBackColor = null;
      }
      me.fillBackOpaque = null;

      if (me.fillForeColor) {
        me.fillForeColor.destroy();
        me.fillForeColor = null;
      }
      me.fillGradientMode = null;
      me.fillGradientAngle = null;
      me.fillGradientOffsetRatioX = null;
      me.fillGradientOffsetRatioY = null;
      me.fillOpaqueRate = null;
      me.fillSymbolID = null;
      if (me.lineColor) {
        me.lineColor.destroy();
        me.lineColor = null;
      }
      me.lineSymbolID = null;
      me.lineWidth = null;
      me.markerAngle = null;
      me.markerSize = null;
      me.markerSymbolID = null;
    }

    /**
     * @function ServerStyle.prototype.toServerJSONObject
     * @description 转换成对应的 JSON 格式对象。
     * @returns {Object} 对应的 JSON 格式对象.
     */
    toServerJSONObject() {
      let styleObj = {};
      styleObj = Util.copyAttributes(styleObj, this);
      // 暂时先忽略serverColor往Json的转换
      return styleObj
    }

    /**
     * @function ServerStyle.fromJson
     * @description 将JSON对象转换为 ServerStyle 对象。
     * @param {Object} jsonObject - 要转换的 JSON 对象。
     * @returns {ServerStyle} 转化后的 ServerStyle 对象。
     */
    static fromJson(jsonObject) {
      if (!jsonObject) {
        return
      }
      return new ServerStyle({
        fillBackColor: ServerColor.fromJson(jsonObject.fillBackColor),
        fillBackOpaque: jsonObject.fillBackOpaque,
        fillForeColor: ServerColor.fromJson(jsonObject.fillForeColor),
        fillGradientMode: jsonObject.fillGradientMode,
        fillGradientAngle: jsonObject.fillGradientAngle,
        fillGradientOffsetRatioX: jsonObject.fillGradientOffsetRatioX,
        fillGradientOffsetRatioY: jsonObject.fillGradientOffsetRatioY,
        fillOpaqueRate: jsonObject.fillOpaqueRate,
        fillSymbolID: jsonObject.fillSymbolID,
        lineColor: ServerColor.fromJson(jsonObject.lineColor),
        lineSymbolID: jsonObject.lineSymbolID,
        lineWidth: jsonObject.lineWidth,
        markerAngle: jsonObject.markerAngle,
        markerSize: jsonObject.markerSize,
        markerSymbolID: jsonObject.markerSymbolID
      })
    }
  }

  /* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
   * This program are made available under the terms of the Apache License, Version 2.0
   * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html. */

  /**
   * @class PointWithMeasure
   * @deprecatedclass SuperMap.PointWithMeasure
   * @category iServer SpatialAnalyst RouteLocator
   * @classdesc 路由点类。路由点是指具有线性度量值 (Measure) 的二维地理坐标点。
   * @param {Object} options - 参数。
   * @param {number} options.measure - 度量值，即路由对象属性值 M。
   * @param {number} options.x - 地理坐标系下的 X 坐标值。
   * @param {number} options.y - 地理坐标系下的 Y 坐标值。
   * @extends {GeometryPoint}
   * @usage
   */
  class PointWithMeasure extends Point {
    constructor(options) {
      super(options);

      /**
       * @member {number} PointWithMeasure.prototype.measure
       * @description 度量值，即路由对象属性值 M。
       */
      this.measure = null;

      if (options) {
        Util.extend(this, options);
      }

      this.CLASS_NAME = "SuperMap.PointWithMeasure";
    }

    /**
     * @function PointWithMeasure.prototype.equals
     * @description 判断两个路由点对象是否相等。如果两个路由点对象具有相同的坐标以及度量值，则认为是相等的。
     * @param {PointWithMeasure} geom - 需要判断的路由点对象。
     * @returns {boolean} 两个路由点对象是否相等（true 为相等，false 为不等）。
     */
    equals(geom) {
      let equals = false;
      if (geom != null) {
        const isValueEquals = this.x === geom.x && this.y === geom.y && this.measure === geom.measure;
        const isNaNValue = isNaN(this.x) && isNaN(this.y) && isNaN(this.measure);
        const isNaNGeometry = isNaN(geom.x) && isNaN(geom.y) && isNaN(geom.measure);
        equals = isValueEquals || (isNaNValue && isNaNGeometry);
      }
      return equals
    }

    /**
     * @function PointWithMeasure.prototype.toJson
     * @description 转换为 JSON 对象。
     * */
    toJson() {
      let result = "{";
      if (this.measure != null && this.measure != undefined) {
        result += '"measure":' + this.measure + ",";
      }
      result += '"x":' + this.x + ",";
      result += '"y":' + this.y;
      result += "}";
      return result
    }

    /**
     * @function PointWithMeasure.prototype.destroy
     * @description 释放资源，将引用资源的属性置空。
     */
    destroy() {
      const me = this;
      me.measure = null;
      me.x = null;
      me.y = null;
    }

    /**
     * @function PointWithMeasure.fromJson
     * @description 将 JSON 对象转换为{@link PointWithMeasure} 对象。
     * @param {Object} jsonObject - JSON 对象表示的路由点。
     * @returns {PointWithMeasure} 转化后的 PointWithMeasure 对象。
     */
    static fromJson(jsonObject) {
      if (!jsonObject) {
        return
      }
      return new PointWithMeasure({
        x: jsonObject.x,
        y: jsonObject.y,
        measure: jsonObject.measure
      })
    }
  }

  /* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
   * This program are made available under the terms of the Apache License, Version 2.0
   * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html. */

  /**
   * @class Route
   * @deprecatedclass SuperMap.Route
   * @category iServer SpatialAnalyst RouteCalculateMeasure
   * @classdesc 路由对象类。路由对象为一系列有序的带有属性值 M 的 x，y 坐标对，其中 M 值为该结点的距离属性（到已知点的距离）。
   * @param {Array.<Geometry>} points - 形成路由对象的线数组。
   * @param {Object} options - 参数。
   * @param {number} options.id - 路由对象在数据库中的 id。
   * @param {number} options.length - 路由对象的长度。单位与数据集的单位相同。
   * @param {number} [options.maxM] - 最大线性度量值，即所有结点到起始点的量算距离中最大值。
   * @param {number} [options.minM] - 最小线性度量值，即所有结点到起始点的量算距离中最小值。
   * @param {string} [options.type] - 数据类型，如："LINEM"。
   * @extends GeometryCollection
   * @usage
   */
  class Route extends Collection {

      constructor(points, options) {
          super(points, options);

          /**
           * @member {number} Route.prototype.id
           * @description 路由对象在数据库中的 ID。
           */
          this.id = null;

          /**
           * @member {number} Route.prototype.center
           * @description 路由对象的中心点。
           */
          this.center = null;

          /**
           * @member {string} Route.prototype.style
           * @description 路由对象的样式。
           */
          this.style = null;

          /**
           * @member {number} Route.prototype.length
           * @description 路由对象的长度。单位与数据集的单位相同。
           */
          this.length = null;

          /**
           *  @member {number} Route.prototype.maxM
           *  @description 最大线性度量值，即所有结点到起始点的量算距离中最大值。
           */
          this.maxM = null;

          /**
           * @member {number} Route.prototype.minM
           * @description 最小线性度量值，即所有结点到起始点的量算距离中最小值。
           */
          this.minM = null;

          /**
           * @member {Array.<number>} Route.prototype.parts
           * @description 服务端几何对象中各个子对象所包含的节点个数。
           */
          this.parts = null;

          /**
           * @member {Array.<Object>} Route.prototype.points
           * @description 路由对象的所有路由点。
           * @example
           * (start code)
           * [
           *  {
           *      "measure": 0,
           *      "y": -4377.027184298267,
           *      "x": 4020.0045221720466
           *  },
           *  {
           *      "measure": 37.33288381391519,
           *      "y": -4381.569363260499,
           *      "x": 4057.0600591960642
           *  }
           * ]
           * (end)
           */
          this.points = null;

          /**
           * @member {string} Route.prototype.type
           * @description 服务端几何对象类型。
           */
          this.type = null;

          /**
           * @member {Array.<string>} [Route.prototype.componentTypes=LineString]
           * @description components 存储的的几何对象所支持的几何类型数组。
           */
          this.componentTypes = ["SuperMap.Geometry.LinearRing", "SuperMap.Geometry.LineString"];

          if (options) {
              Util.extend(this, options);
          }

          this.CLASS_NAME = "SuperMap.Route";
          this.geometryType = "LINEM";
      }

      /**
       *
       * @function Route.prototype.toJson
       * @description 转换为 JSON 对象。
       * @returns {Object} JSON 对象。
       */
      toJson() {
          let result = "{";
          if (this.id != null && this.id != undefined) {
              result += "\"id\":" + this.id + ",";
          }
          if (this.center != null && this.center != undefined) {
              result += "\"center\":" + this.center + ",";
          }
          if (this.style != null && this.style != undefined) {
              result += "\"style\":" + this.style + ",";
          }
          if (this.length != null && this.length != undefined) {
              result += "\"length\":" + this.length + ",";
          }
          if (this.maxM != null && this.maxM != undefined) {
              result += "\"maxM\":" + this.maxM + ",";
          }
          if (this.minM != null && this.minM != undefined) {
              result += "\"minM\":" + this.minM + ",";
          }
          if (this.type != null && this.type != undefined) {
              result += "\"type\":\"" + this.type + "\",";
          }
          if (this.parts != null && this.parts != undefined) {
              result += "\"parts\":[" + this.parts[0];

              for (let i = 1; i < this.parts.length; i++) {
                  result += "," + this.parts[i];
              }
              result += "],";
          }
          if (this.components != null && this.components.length > 0) {
              result += "\"points\":[";
              for (let j = 0, len = this.components.length; j < len; j++) {
                  for (let k = 0, len2 = this.components[j].components.length; k < len2; k++) {
                      result += this.components[j].components[k].toJson() + ",";
                  }
              }
              result = result.replace(/,$/g, "");
              result += "]";
          }
          result = result.replace(/,$/g, "");
          result += "}";
          return result
      }


      /**
       * @function Route.prototype.destroy
       * @override
       */
      destroy() {
          const me = this;
          me.id = null;
          me.center = null;
          me.style = null;
          me.length = null;
          me.maxM = null;
          me.minM = null;
          me.type = null;
          me.parts = null;
          me.components.length = 0;
          me.components = null;
          me.componentTypes = null;
      }


      /**
       * @function Route.fromJson
       * @description 将 JSON 对象转换为 Route 对象。
       * @param {Object} [jsonObject] - JSON 对象表示的路由对象。
       * @returns {Route} 转化后的 Route 对象。
       */
      static fromJson(jsonObject) {
          if (!jsonObject) {
              return
          }

          const geoParts = jsonObject.parts || [];
              const geoPoints = jsonObject.points || [];
              const len = geoParts.length;
              const lineList = [];
          if (len > 0) {
              for (let i = 0, pointIndex = 0, pointList = []; i < len; i++) {
                  for (let j = 0; j < geoParts[i]; j++) {
                      pointList.push(PointWithMeasure.fromJson(geoPoints[pointIndex + j]));
                  }
                  pointIndex += geoParts[i];
                  // 判断线是否闭合，如果闭合，则返回LinearRing，否则返回LineString
                  if (pointList[0].equals(pointList[geoParts[i] - 1])) {
                      lineList.push(new LinearRing(pointList));
                  } else {
                      lineList.push(new LineString(pointList));
                  }
                  pointList = [];
              }

          } else {
              return null
          }

          return new Route(lineList, {
              id: jsonObject.id,
              center: jsonObject.center,
              style: jsonObject.style,
              length: jsonObject.length,
              maxM: jsonObject.maxM,
              minM: jsonObject.minM,
              type: jsonObject.type,
              parts: jsonObject.parts
          })
      }

  }

  /* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
   * This program are made available under the terms of the Apache License, Version 2.0
   * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html. */

  /**
   * @class ServerGeometry
   * @deprecatedclass SuperMap.ServerGeometry
   * @category  iServer Data Feature
   * @classdesc 服务端几何对象类。该类描述几何对象（矢量）的特征数据（坐标点对、几何对象的类型等）。基于服务端的空间分析、空间关系运算、查询等 GIS 服务功能使用服务端几何对象。
   * @param {Object} options - 参数。
   * @param {string} options.id - 服务端几何对象唯一标识符。
   * @param {Array.<number>} options.parts - 服务端几何对象中各个子对象所包含的节点个数。
   * @param {Array.<GeometryPoint>} options.points - 组成几何对象的节点的坐标对数组。
   * @param {GeometryType} options.type - 几何对象的类型。
   * @param {ServerStyle} [options.style] - 服务端几何对象的风格。
   * @usage
   */
  class ServerGeometry {
    constructor(options) {
      /**
       * @member {string} ServerGeometry.prototype.id
       * @description 服务端几何对象唯一标识符。
       */
      this.id = 0;

      /**
       * @member {ServerStyle} [ServerGeometry.prototype.style]
       * @description 服务端几何对象的风格（ServerStyle）。
       */
      this.style = null;

      /**
       * @member {Array.<number>} ServerGeometry.prototype.parts
       * @description 服务端几何对象中各个子对象所包含的节点个数。<br>
       * 1.几何对象从结构上可以分为简单几何对象和复杂几何对象。
       * 简单几何对象与复杂几何对象的区别：简单的几何对象一般为单一对象，
       * 而复杂的几何对象由多个简单对象组成或经过一定的空间运算之后产生，
       * 如：矩形为简单的区域对象，而中空的矩形为复杂的区域对象。<br>
       * 2.通常情况，一个简单几何对象的子对象就是它本身，
       * 因此对于简单对象来说的该字段为长度为1的整型数组，
       * 该字段的值就是这个简单对象节点的个数。
       * 如果一个几何对象是由几个简单对象组合而成的，
       * 例如，一个岛状几何对象由 3 个简单的多边形组成而成，
       * 那么这个岛状的几何对象的 Parts 字段值就是一个长度为 3 的整型数组，
       * 数组中每个成员的值分别代表这三个多边形所包含的节点个数。
       */
      this.parts = null;

      /**
       * @member {Array.<GeometryPoint>} ServerGeometry.prototype.points
       * @description 组成几何对象的节点的坐标对数组。<br>
       * 1.所有几何对象（点、线、面）都是由一些简单的点坐标组成的，
       * 该字段存放了组成几何对象的点坐标的数组。
       * 对于简单的面对象，他的起点和终点的坐标点相同。<br>
       * 2.对于复杂的几何对象，根据 Parts 属性来确定每一个组成复杂几何对象的简单对象所对应的节点的个数，
       * 从而确定 Points 字段中坐标对的分配归属问题。
       */
      this.points = null;

      /**
       * @member {GeometryType} ServerGeometry.prototype.type
       * @description 几何对象的类型（GeometryType）。
       */
      this.type = null;

      /**
       * @member {Object} ServerGeometry.prototype.prjCoordSys
       * @description 投影坐标参数，现仅在缓冲区分析中有效。
       */
      this.prjCoordSys = null;
      if (options) {
        Util.extend(this, options);
      }

      this.CLASS_NAME = "SuperMap.ServerGeometry";
    }

    /**
     * @function ServerGeometry.prototype.destroy
     * @description 释放资源，将引用资源的属性置空。
     */
    destroy() {
      const me = this;
      me.id = null;
      me.style = null;
      me.parts = null;
      me.partTopo = null;
      me.points = null;
      me.type = null;
      me.prjCoordSys = null;
    }

    /**
     * @function ServerGeometry.prototype.toGeometry
     * @description 将服务端几何对象 ServerGeometry 转换为客户端几何对象 Geometry。
     * @returns {Geometry} 转换后的客户端几何对象。
     */
    toGeometry() {
      const me = this;
      const geoType = me.type;
      switch (geoType.toUpperCase()) {
        case GeometryType.POINT:
          return me.toGeoPoint()
        case GeometryType.LINE:
          return me.toGeoLine()
        case GeometryType.LINEM:
          return me.toGeoLinem()
        case GeometryType.REGION:
          return me.toGeoRegion()
        case GeometryType.POINTEPS:
          return me.toGeoPoint()
        case GeometryType.LINEEPS:
          return me.toGeoLineEPS()
        case GeometryType.REGIONEPS:
          return me.toGeoRegionEPS()
        case GeometryType.GEOCOMPOUND:
          return me.transformGeoCompound()
      }
    }

    /**
     * @function ServerGeometry.prototype.toGeoPoint
     * @description 将服务端的点几何对象转换为客户端几何对象。包括 Point、MultiPoint。
     * @returns {Geometry} 转换后的客户端几何对象。
     */
    toGeoPoint() {
      const me = this;
      const geoParts = me.parts || [];
      const geoPoints = me.points || [];
      const len = geoParts.length;
      if (len > 0) {
        if (len === 1) {
          return new Point(geoPoints[0].x, geoPoints[0].y)
        } else {
          const pointList = [];
          for (let i = 0; i < len; i++) {
            pointList.push(new Point(geoPoints[i].x, geoPoints[i].y));
          }
          return new MultiPoint(pointList)
        }
      } else {
        return null
      }
    }

    /**
     * @function ServerGeometry.prototype.toGeoLine
     * @description 将服务端的线几何对象转换为客户端几何对象。包括 GeometryLinearRing、GeometryLineString、GeometryMultiLineString。
     * @returns {Geometry} 转换后的客户端几何对象。
     */
    toGeoLine() {
      const me = this;
      const geoParts = me.parts || [];
      const geoPoints = me.points || [];
      const len = geoParts.length;
      if (len > 0) {
        if (len === 1) {
          const pointList = [];
          for (let i = 0; i < geoParts[0]; i++) {
            pointList.push(new Point(geoPoints[i].x, geoPoints[i].y));
          }
          // 判断线是否闭合，如果闭合，则返回LinearRing，否则返回LineString
          if (pointList[0].equals(pointList[geoParts[0] - 1])) {
            return new LinearRing(pointList)
          } else {
            return new LineString(pointList)
          }
        } else {
          const lineList = [];
          for (let i = 0; i < len; i++) {
            const pointList = [];
            for (let j = 0; j < geoParts[i]; j++) {
              pointList.push(new Point(geoPoints[j].x, geoPoints[j].y));
            }
            lineList.push(new LineString(pointList));
            geoPoints.splice(0, geoParts[i]);
          }
          return new MultiLineString(lineList)
        }
      } else {
        return null
      }
    }

    /**
     * @function ServerGeometry.prototype.toGeoLineEPS
     * @description 将服务端的线几何对象转换为客户端几何对象。包括 GeometryLinearRing、GeometryLineString、GeometryMultiLineString。
     * @returns {Geometry} 转换后的客户端几何对象。
     */
    toGeoLineEPS() {
      const me = this;
      const geoParts = me.parts || [];
      const geoPoints = me.points || [];
      let i;
      let j;
      let pointList;
      let lineList;
      let lineEPS;
      const len = geoParts.length;
      if (len > 0) {
        if (len === 1) {
          for (i = 0, pointList = []; i < geoParts[0]; i++) {
            pointList.push(new Point(geoPoints[i].x, geoPoints[i].y, geoPoints[i].type));
          }
          // 判断线是否闭合，如果闭合，则返回LinearRing，否则返回LineString
          if (pointList[0].equals(pointList[geoParts[0] - 1])) {
            lineEPS = LineString.createLineEPS(pointList);
            return new LinearRing(lineEPS)
          } else {
            lineEPS = LineString.createLineEPS(pointList);
            return new LineString(lineEPS)
          }
        } else {
          for (i = 0, lineList = []; i < len; i++) {
            for (j = 0, pointList = []; j < geoParts[i]; j++) {
              pointList.push(new Point(geoPoints[j].x, geoPoints[j].y));
            }
            lineEPS = LineString.createLineEPS(pointList);
            lineList.push(new LineString(lineEPS));
            geoPoints.splice(0, geoParts[i]);
          }
          return new MultiLineString(lineList)
        }
      } else {
        return null
      }
    }

    /**
     * @function ServerGeometry.prototype.toGeoLinem
     * @description 将服务端的路由线几何对象转换为客户端几何对象。包括 LinearRing、LineString、MultiLineString。
     * @returns {Geometry} 转换后的客户端几何对象。
     */
    toGeoLinem() {
      const me = this;
      return Route.fromJson(me)
    }

    /**
     * @function ServerGeometry.prototype.toGeoRegion
     * @description 将服务端的面几何对象转换为客户端几何对象。类型为 GeometryPolygon。
     * @returns {Geometry} 转换后的客户端几何对象。
     */
    toGeoRegion() {
      const me = this;
      const geoParts = me.parts || [];
      const geoTopo = me.partTopo || [];
      const geoPoints = me.points || [];
      const len = geoParts.length;
      if (len <= 0) {
        return null
      }
      let polygonArray = [];
      let pointList = [];
      if (len == 1) {
        for (let i = 0; i < geoPoints.length; i++) {
          pointList.push(new Point(geoPoints[i].x, geoPoints[i].y));
        }
        polygonArray.push(new Polygon([new LinearRing(pointList)]));
        return new MultiPolygon(polygonArray)
      }
      // 处理复杂面
      let CCWArray = [];
      const areaArray = [];
      const polygonArrayTemp = [];
      const polygonBounds = [];
      // polyon岛洞标识数组，初始都是岛。
      const CCWIdent = [];
      for (let i = 0, pointIndex = 0; i < len; i++) {
        for (let j = 0; j < geoParts[i]; j++) {
          pointList.push(new Point(geoPoints[pointIndex + j].x, geoPoints[pointIndex + j].y));
        }
        pointIndex += geoParts[i];
        const polygon = new Polygon([new LinearRing(pointList)]);
        pointList = [];
        polygonArrayTemp.push(polygon);
        if (geoTopo.length === 0) {
          polygonBounds.push(polygon.getBounds());
        }
        CCWIdent.push(1);
        areaArray.push(polygon.getArea());
      }
      // iServer 9D新增字段
      if (geoTopo.length === 0) {
        // 根据面积排序
        ServerGeometry.bubbleSort(areaArray, polygonArrayTemp, geoTopo, polygonBounds);
        // 岛洞底层判断原则：将所有的子对象按照面积排序，面积最大的直接判定为岛（1），从面积次大的开始处理，
        // 如果发现该对象在某个面积大于它的对象之中（即被包含），则根据包含它的对象的标识（1 or -1），指定其标识（-1 or 1），
        // 依次处理完所有对象，就得到了一个标识数组，1表示岛，-1表示洞
        // 目标polygon索引列表 -1标示没有被任何polygon包含，
        const targetArray = [];
        for (let i = 1; i < polygonArrayTemp.length; i++) {
          for (let j = i - 1; j >= 0; j--) {
            targetArray[i] = -1;
            if (polygonBounds[j].containsBounds(polygonBounds[i])) {
              CCWIdent[i] = CCWIdent[j] * -1;
              if (CCWIdent[i] < 0) {
                targetArray[i] = j;
              }
              break
            }
          }
        }
        for (let i = 0; i < polygonArrayTemp.length; i++) {
          if (CCWIdent[i] > 0) {
            polygonArray.push(polygonArrayTemp[i]);
          } else {
            polygonArray[targetArray[i]].components = polygonArray[targetArray[i]].components.concat(polygonArrayTemp[i].components);
            // 占位
            polygonArray.push("");
          }
        }
      } else {
        polygonArray = [];
        for (let i = 0; i < polygonArrayTemp.length; i++) {
          if (geoTopo[i] && geoTopo[i] == -1) {
            CCWArray = CCWArray.concat(polygonArrayTemp[i].components);
          } else {
            if (CCWArray.length > 0 && polygonArray.length > 0) {
              polygonArray[polygonArray.length - 1].components = polygonArray[polygonArray.length - 1].components.concat(CCWArray);
              CCWArray = [];
            }
            polygonArray.push(polygonArrayTemp[i]);
          }
          if (i == len - 1) {
            const polyLength = polygonArray.length;
            if (polyLength) {
              polygonArray[polyLength - 1].components = polygonArray[polyLength - 1].components.concat(CCWArray);
            } else {
              for (let k = 0, length = CCWArray.length; k < length; k++) {
                polygonArray.push(new Polygon(CCWArray));
              }
            }
          }
        }
      }
      return new MultiPolygon(polygonArray)
    }

    /**
     * @function ServerGeometry.prototype.toGeoRegionEPS
     * @description 将服务端的面几何对象转换为客户端几何对象。类型为 Polygon。
     * @returns {Geometry} 转换后的客户端几何对象。
     */
    toGeoRegionEPS() {
      const me = this;
      const geoParts = me.parts || [];
      const geoTopo = me.partTopo || [];
      const geoPoints = me.points || [];
      const len = geoParts.length;

      if (len <= 0) {
        return null
      }
      let polygonArray = [];
      let pointList = [];
      let lineEPS;
      if (len == 1) {
        for (let i = 0; i < geoPoints.length; i++) {
          pointList.push(new Point(geoPoints[i].x, geoPoints[i].y));
        }

        lineEPS = LineString.createLineEPS(pointList);
        polygonArray.push(new Polygon([new LinearRing(lineEPS)]));
        return new MultiPolygon(polygonArray)
      }
      // 处理复杂面
      let CCWArray = [];
      const areaArray = [];
      const polygonArrayTemp = [];
      const polygonBounds = [];
      // polyon岛洞标识数组，初始都是岛。
      const CCWIdent = [];
      for (let i = 0, pointIndex = 0; i < len; i++) {
        for (let j = 0; j < geoParts[i]; j++) {
          pointList.push(new Point(geoPoints[pointIndex + j].x, geoPoints[pointIndex + j].y));
        }
        pointIndex += geoParts[i];

        lineEPS = LineString.createLineEPS(pointList);
        const polygon = new Polygon([new LinearRing(lineEPS)]);
        pointList = [];
        polygonArrayTemp.push(polygon);
        if (geoTopo.length === 0) {
          polygonBounds.push(polygon.getBounds());
        }
        CCWIdent.push(1);
        areaArray.push(polygon.getArea());
      }
      // iServer 9D新增字段
      if (geoTopo.length === 0) {
        // 根据面积排序
        ServerGeometry.bubbleSort(areaArray, polygonArrayTemp, geoTopo, polygonBounds);
        // 岛洞底层判断原则：将所有的子对象按照面积排序，面积最大的直接判定为岛（1），从面积次大的开始处理，
        // 如果发现该对象在某个面积大于它的对象之中（即被包含），则根据包含它的对象的标识（1 or -1），指定其标识（-1 or 1），
        // 依次处理完所有对象，就得到了一个标识数组，1表示岛，-1表示洞
        // 目标polygon索引列表 -1标示没有被任何polygon包含，
        const targetArray = [];
        for (let i = 1; i < polygonArrayTemp.length; i++) {
          for (let j = i - 1; j >= 0; j--) {
            targetArray[i] = -1;
            if (polygonBounds[j].containsBounds(polygonBounds[i])) {
              CCWIdent[i] = CCWIdent[j] * -1;
              if (CCWIdent[i] < 0) {
                targetArray[i] = j;
              }
              break
            }
          }
        }
        for (let i = 0; i < polygonArrayTemp.length; i++) {
          if (CCWIdent[i] > 0) {
            polygonArray.push(polygonArrayTemp[i]);
          } else {
            polygonArray[targetArray[i]].components = polygonArray[targetArray[i]].components.concat(polygonArrayTemp[i].components);
            // 占位
            polygonArray.push("");
          }
        }
      } else {
        polygonArray = [];
        for (let i = 0; i < polygonArrayTemp.length; i++) {
          if (geoTopo[i] && geoTopo[i] == -1) {
            CCWArray = CCWArray.concat(polygonArrayTemp[i].components);
          } else {
            if (CCWArray.length > 0 && polygonArray.length > 0) {
              polygonArray[polygonArray.length - 1].components = polygonArray[polygonArray.length - 1].components.concat(CCWArray);
              CCWArray = [];
            }
            polygonArray.push(polygonArrayTemp[i]);
          }
          if (i == len - 1) {
            const polyLength = polygonArray.length;
            if (polyLength) {
              polygonArray[polyLength - 1].components = polygonArray[polyLength - 1].components.concat(CCWArray);
            } else {
              for (let k = 0, length = CCWArray.length; k < length; k++) {
                polygonArray.push(new Polygon(CCWArray));
              }
            }
          }
        }
      }
      return new MultiPolygon(polygonArray)
    }

    transformGeoCompound() {
      const me = this;
      const geoParts = me.geoParts || [];
      const len = geoParts.length;
      if (len <= 0) {
        return null
      }
      const geometryList = [];
      for (let index = 0; index < len; index++) {
        const geometry = geoParts[index];
        geometryList.push(new ServerGeometry(geometry).toGeometry());
      }
      return new Collection(geometryList)
    }

    /**
     * @function ServerGeometry.prototype.fromJson
     * @description 将 JSON 对象表示服务端几何对象转换为 ServerGeometry。
     * @param {Object} jsonObject - 要转换的 JSON 对象。
     * @returns {ServerGeometry} 转换后的 ServerGeometry 对象。
     */
    static fromJson(jsonObject) {
      if (!jsonObject) {
        return
      }
      return new ServerGeometry({
        id: jsonObject.id,
        style: ServerStyle.fromJson(jsonObject.style),
        parts: jsonObject.parts,
        partTopo: jsonObject.partTopo,
        points: jsonObject.points,
        center: jsonObject.center,
        length: jsonObject.length,
        maxM: jsonObject.maxM,
        minM: jsonObject.minM,
        type: jsonObject.type
      })
    }

    /**
     * @function ServerGeometry.prototype.fromGeometry
     * @description 将客户端 Geometry 转换成服务端 ServerGeometry。
     * @param {Geometry} geometry - 要转换的客户端 Geometry 对象。
     * @returns {ServerGeometry} 转换后的 ServerGeometry 对象。
     */
    static fromGeometry(geometry) {
      if (!geometry) {
        return
      }
      let id = 0;
      const parts = [];
      const points = [];
      let type = null;
      const icomponents = geometry.components;
      const className = geometry.CLASS_NAME;
      const prjCoordSys = { epsgCode: geometry.SRID };

      if (!isNaN(geometry.id)) {
        id = geometry.id;
      }
      // 坑爹的改法，没法，为了支持态势标绘，有时间就得全改
      if (
        className != "SuperMap.Geometry.LinearRing" &&
        className != "SuperMap.Geometry.LineString" &&
        (geometry instanceof MultiPoint || geometry instanceof MultiLineString)
      ) {
        const ilen = icomponents.length;
        for (let i = 0; i < ilen; i++) {
          const vertices = icomponents[i].getVertices();
          const partPointsCount = vertices.length;
          parts.push(partPointsCount);
          for (let j = 0; j < partPointsCount; j++) {
            points.push(new Point(vertices[j].x, vertices[j].y));
          }
        }
        // 这里className不是多点就全部是算线
        type = className == "SuperMap.Geometry.MultiPoint" ? GeometryType.POINT : GeometryType.LINE;
      } else if (geometry instanceof MultiPolygon) {
        const ilen = icomponents.length;
        for (let i = 0; i < ilen; i++) {
          const polygon = icomponents[i];
          const linearRingOfPolygon = polygon.components;
          const linearRingOfPolygonLen = linearRingOfPolygon.length;
          for (let j = 0; j < linearRingOfPolygonLen; j++) {
            const vertices = linearRingOfPolygon[j].getVertices();
            const partPointsCount = vertices.length + 1;
            parts.push(partPointsCount);
            for (let k = 0; k < partPointsCount - 1; k++) {
              points.push(new Point(vertices[k].x, vertices[k].y));
            }
            points.push(new Point(vertices[0].x, vertices[0].y));
          }
        }
        type = GeometryType.REGION;
      } else if (geometry instanceof Polygon) {
        const ilen = icomponents.length;
        for (let i = 0; i < ilen; i++) {
          const vertices = icomponents[i].getVertices();
          const partPointsCount = vertices.length + 1;
          parts.push(partPointsCount);
          for (let j = 0; j < partPointsCount - 1; j++) {
            points.push(new Point(vertices[j].x, vertices[j].y));
          }
          points.push(new Point(vertices[0].x, vertices[0].y));
        }
        type = GeometryType.REGION;
      } else {
        const vertices = geometry.getVertices();
        let geometryVerticesCount = vertices.length;
        for (let j = 0; j < geometryVerticesCount; j++) {
          points.push(new Point(vertices[j].x, vertices[j].y));
        }
        if (geometry instanceof LinearRing) {
          points.push(new Point(vertices[0].x, vertices[0].y));
          geometryVerticesCount++;
        }
        parts.push(geometryVerticesCount);
        type = geometry instanceof Point ? GeometryType.POINT : GeometryType.LINE;
      }

      return new ServerGeometry({
        id: id,
        style: null,
        parts: parts,
        points: points,
        type: type,
        prjCoordSys: prjCoordSys
      })
    }

    /**
     * @function ServerGeometry.prototype.IsClockWise
     * @description 判断 linearRing 中的点的顺序。返回值大于 0，逆时针；小于 0，顺时针。
     * @param {Geometry} geometry - 要转换的客户端 Geometry 对象。
     * @returns {number} 返回值大于 0，逆时针；小于 0，顺时针。
     */
    static IsClockWise(points) {
      const length = points.length;
      if (length < 3) {
        return 0.0
      }
      let s = points[0].y * (points[length - 1].x - points[1].x);
      points.push(points[0]);
      for (let i = 1; i < length; i++) {
        s += points[i].y * (points[i - 1].x - points[i + 1].x);
      }
      return s * 0.5
    }

    static bubbleSort(areaArray, pointList, geoTopo, polygonBounds) {
      for (let i = 0; i < areaArray.length; i++) {
        for (let j = 0; j < areaArray.length; j++) {
          if (areaArray[i] > areaArray[j]) {
            const d = areaArray[j];
            areaArray[j] = areaArray[i];
            areaArray[i] = d;
            const b = pointList[j];
            pointList[j] = pointList[i];
            pointList[i] = b;
            if (geoTopo && geoTopo.length > 0) {
              const c = geoTopo[j];
              geoTopo[j] = geoTopo[i];
              geoTopo[i] = c;
            }
            if (polygonBounds && polygonBounds.length > 0) {
              const f = polygonBounds[j];
              polygonBounds[j] = polygonBounds[i];
              polygonBounds[i] = f;
            }
          }
        }
      }
    }
  }

  /* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
   * This program are made available under the terms of the Apache License, Version 2.0
   * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html. */

  /**
   * @class GeoJSONFormat
   * @aliasclass Format.GeoJSON
   * @deprecatedclass SuperMap.Format.GeoJSON
   * @classdesc  GeoJSON 的读和写。使用 {@link GeoJSONObject} 构造器创建一个 GeoJSON 解析器。
   * @category BaseTypes Format
   * @param {Object} [options] - 可选参数。
   * @param {string} [options.indent="    "] - 用于格式化输出，indent 字符串会在每次缩进的时候使用一次。
   * @param {string} [options.space=" "] - 用于格式化输出，space 字符串会在名值对的 ":" 后边添加。
   * @param {string} [options.newline="\n"] - 用于格式化输出, newline 字符串会用在每一个名值对或数组项末尾。
   * @param {number} [options.level=0] - 用于格式化输出, 表示的是缩进级别。
   * @param {boolean} [options.pretty=false] - 是否在序列化的时候使用额外的空格控制结构。在 write 方法中使用。
   * @param {boolean} [options.nativeJSON] - 需要被注册的监听器对象。
   * @param {boolean} [options.ignoreExtraDims=true] - 忽略维度超过 2 的几何要素。
   * @extends {JSONFormat}
   * @usage
   */
  class GeoJSON extends JSONFormat {
    constructor(options) {
      super(options);
      /**
       * @member {boolean} [GeoJSONFormat.prototype.ignoreExtraDims=true]
       * @description 忽略维度超过 2 的几何要素。
       */
      this.ignoreExtraDims = true;

      this.CLASS_NAME = "SuperMap.Format.GeoJSON";
      /**
       * @member {Object} GeoJSONFormat.prototype.parseCoords
       * @private
       * @description 一个属性名对应着 GeoJSON 对象的几何类型的对象。每个属性其实都是一个实际上做解析用的方法。
       */
      this.parseCoords = {
        /**
         * @function GeoJSONFormat.parseCoords.point
         * @description 将一组坐标转成一个 {@link Geometry} 对象。
         * @param {Object} array - GeoJSON 片段中的一组坐标。
         * @returns {Geometry} 一个几何对象。
         */
        point: function (array) {
          // if (this.ignoreExtraDims === false && array.length != 2) {
          //   throw "Only 2D points are supported: " + array
          // }
          return new Point(array[0], array[1])
        },

        /**
         * @function GeoJSONFormat.parseCoords.multipoint
         * @description 将坐标组数组转化成为一个 {@link Geometry} 对象。
         * @param {Object} array - GeoJSON 片段中的坐标组数组。
         * @returns {Geometry} 一个几何对象。
         */
        multipoint: function (array) {
          const points = [];
          let p = null;
          for (let i = 0, len = array.length; i < len; ++i) {
            p = this.parseCoords.point.apply(this, [array[i]]);
            points.push(p);
          }
          return new MultiPoint(points)
        },

        /**
         * @function GeoJSONFormat.parseCoords.linestring
         * @description 将坐标组数组转化成为一个 {@link Geometry} 对象。
         * @param {Object} array - GeoJSON 片段中的坐标组数组。
         * @returns {Geometry} 一个几何对象。
         */
        linestring: function (array) {
          const points = [];
          let p = null;
          for (let i = 0, len = array.length; i < len; ++i) {
            p = this.parseCoords.point.apply(this, [array[i]]);
            points.push(p);
          }
          return new LineString(points)
        },

        /**
         * @function GeoJSONFormat.parseCoords.multilinestring
         * @description 将坐标组数组转化成为一个 {@link Geometry} 对象。
         * @param {Object} array - GeoJSON 片段中的坐标组数组。
         * @returns {Geometry} 一个几何对象。
         */
        multilinestring: function (array) {
          const lines = [];
          let l = null;
          for (let i = 0, len = array.length; i < len; ++i) {
            l = this.parseCoords.linestring.apply(this, [array[i]]);
            lines.push(l);
          }
          return new MultiLineString(lines)
        },

        /**
         * @function GeoJSONFormat.parseCoords.polygon
         * @description 将坐标组数组转化成为一个 {@link Geometry} 对象。
         * @returns {Geometry} 一个几何对象。
         */
        polygon: function (array) {
          const rings = [];
          let r, l;
          for (let i = 0, len = array.length; i < len; ++i) {
            try {
              l = this.parseCoords.linestring.apply(this, [array[i]]);
            } catch (err) {
              throw err
            }
            r = new LinearRing(l.components);
            rings.push(r);
          }
          return new Polygon(rings)
        },

        /**
         * @function GeoJSONFormat.parseCoords.multipolygon
         * @description 将坐标组数组转化成为一个 {@link Geometry} 对象。
         * @param {Object} array - GeoJSON 片段中的坐标组数组。
         * @returns {Geometry} 一个几何对象。
         */
        multipolygon: function (array) {
          const polys = [];
          let p = null;
          for (let i = 0, len = array.length; i < len; ++i) {
            try {
              p = this.parseCoords.polygon.apply(this, [array[i]]);
            } catch (err) {
              throw err
            }
            polys.push(p);
          }
          return new MultiPolygon(polys)
        },

        /**
         * @function GeoJSONFormat.parseCoords.box
         * @description 将坐标组数组转化成为一个 {@link Geometry} 对象。
         * @param {Array} array - GeoJSON 片段中的坐标组数组。
         * @returns {Geometry} 一个几何对象。
         */
        box: function (array) {
          // if (array.length != 2) {
          //   // throw "GeoJSON box coordinates must have 2 elements"
          // }
          return new Polygon([
            new LinearRing([
              new Point(array[0][0], array[0][1]),
              new Point(array[1][0], array[0][1]),
              new Point(array[1][0], array[1][1]),
              new Point(array[0][0], array[1][1]),
              new Point(array[0][0], array[0][1])
            ])
          ])
        }
      };
      /**
       * @member {Object} GeoJSONFormat.prototype.extract
       * @private
       * @description 一个属性名对应着GeoJSON类型的对象。其值为相应的实际的解析方法。
       */
      this.extract = {
        /**
         * @function GeoJSONFormat.extract.feature
         * @description 返回一个表示单个要素对象的 GeoJSON 的一部分。
         * @param {SuperMap.ServerFeature} feature - iServer 要素对象。
         * @returns {Object} 一个表示点的对象。
         */
        feature: function (feature) {
          const geom = this.extract.geometry.apply(this, [feature.geometry]);
          const json = {
            type: "Feature",
            properties: this.createAttributes(feature),
            geometry: geom
          };

          if (feature.geometry && feature.geometry.type === "TEXT") {
            json.properties.texts = feature.geometry.texts;
            json.properties.textStyle = feature.geometry.textStyle;
          }
          if (feature.fid) {
            json.id = feature.fid;
          }
          if (feature.ID) {
            json.id = feature.ID;
          }
          return json
        },

        /**
         * @function GeoJSONFormat.extract.geometry
         * @description 返回一个表示单个几何对象的 GeoJSON 的一部分。
         * @param {Object} geometry - iServer 几何对象。
         * @returns {Object} 一个表示几何体的对象。
         */
        geometry: function (geometry) {
          if (geometry == null) {
            return null
          }
          if (!geometry.parts && geometry.points) {
            geometry.parts = [geometry.points.length];
          }
          const geo = geometry.hasOwnProperty("geometryType") ? geometry : new ServerGeometry(geometry).toGeometry() || geometry;
          let geometryType = geo.geometryType || geo.type;

          if (geometryType === "LinearRing") {
            geometryType = "LineString";
          }
          if (geometryType === "LINEM") {
            geometryType = "MultiLineString";
          }
          const data = this.extract[geometryType.toLowerCase()].apply(this, [geo]);
          geometryType = geometryType === "TEXT" ? "Point" : geometryType;
          let json;
          if (geometryType === "Collection") {
            json = {
              type: "GeometryCollection",
              geometries: data
            };
          } else {
            json = {
              type: geometryType,
              coordinates: data
            };
          }
          return json
        },

        /**
         * @function GeoJSONFormat.extract.point
         * @description 从一个点对象中返回一个坐标组。
         * @param {GeometryPoint} point - 一个点对象。
         * @returns {Array} 一个表示一个点的坐标组。
         */
        point: function (point) {
          const p = [point.x, point.y];
          for (const name in point) {
            if (name !== "x" && name !== "y" && point[name] !== null && !isNaN(point[name])) {
              p.push(point[name]);
            }
          }
          return p
        },

        /**
         * @function GeoJSONFormat.extract.point
         * @description 从一个文本对象中返回一个坐标组。
         * @param {Object} geo - 一个文本对象。
         * @returns {Array} 一个表示一个点的坐标组。
         */
        text: function (geo) {
          return [geo.points[0].x, geo.points[0].y]
        },

        /**
         * @function GeoJSONFormat.extract.multipoint
         * @description 从一个多点对象中返一个坐标组数组。
         * @param {GeometryMultiPoint} multipoint - 多点对象。
         * @returns {Array} 一个表示多点的坐标组数组。
         */
        multipoint: function (multipoint) {
          const array = [];
          for (let i = 0, len = multipoint.components.length; i < len; ++i) {
            array.push(this.extract.point.apply(this, [multipoint.components[i]]));
          }
          return array
        },

        /**
         * @function GeoJSONFormat.extract.linestring
         * @description 从一个线对象中返回一个坐标组数组。
         * @param {Linestring} linestring - 线对象。
         * @returns {Array} 一个表示线对象的坐标组数组。
         */
        linestring: function (linestring) {
          const array = [];
          for (let i = 0, len = linestring.components.length; i < len; ++i) {
            array.push(this.extract.point.apply(this, [linestring.components[i]]));
          }
          return array
        },

        /**
         * @function GeoJSONFormat.extract.multilinestring
         * @description 从一个多线对象中返回一个线数组。
         * @param {GeometryMultiLineString} multilinestring - 多线对象。
         *
         * @returns {Array} 一个表示多线的线数组。
         */
        multilinestring: function (multilinestring) {
          const array = [];
          for (let i = 0, len = multilinestring.components.length; i < len; ++i) {
            array.push(this.extract.linestring.apply(this, [multilinestring.components[i]]));
          }
          return array
        },

        /**
         * @function GeoJSONFormat.extract.polygon
         * @description 从一个面对象中返回一组线环。
         * @param {GeometryPolygon} polygon - 面对象。
         * @returns {Array} 一组表示面的线环。
         */
        polygon: function (polygon) {
          const array = [];
          for (let i = 0, len = polygon.components.length; i < len; ++i) {
            array.push(this.extract.linestring.apply(this, [polygon.components[i]]));
          }
          return array
        },

        /**
         * @function GeoJSONFormat.extract.multipolygon
         * @description 从一个多面对象中返回一组面。
         * @param {GeometryMultiPolygon} multipolygon - 多面对象。
         * @returns {Array} 一组表示多面的面。
         */
        multipolygon: function (multipolygon) {
          const array = [];
          for (let i = 0, len = multipolygon.components.length; i < len; ++i) {
            array.push(this.extract.polygon.apply(this, [multipolygon.components[i]]));
          }
          return array
        },

        /**
         * @function GeoJSONFormat.extract.collection
         * @description 从一个几何要素集合中一组几何要素数组。
         * @param {GeometryCollection} collection - 几何要素集合。
         * @returns {Array} 一组表示几何要素集合的几何要素数组。
         */
        collection: function (collection) {
          const len = collection.components.length;
          const array = new Array(len);
          for (let i = 0; i < len; ++i) {
            array[i] = this.extract.geometry.apply(this, [collection.components[i]]);
          }
          return array
        }
      };
    }

    /**
     * @function GeoJSONFormat.prototype.read
     * @description 将 GeoJSON 对象或者GeoJSON 对象字符串转换为 SuperMap Feature 对象。
     * @param {GeoJSONObject} json - GeoJSON 对象。
     * @param {string} [type='FeaureCollection'] - 可选的字符串，它决定了输出的格式。支持的值有："Geometry","Feature"，和 "FeatureCollection"，如果此值为null。
     * @param {function} filter - 对象中每个层次每个键值对都会调用此函数得出一个结果。每个值都会被 filter 函数的结果所替换掉。这个函数可被用来将某些对象转化成某个类相应的对象，或者将日期字符串转化成Date对象。
     * @returns {Object}  返回值依赖于 type 参数的值。
     *     -如果 type 等于 "FeatureCollection"，返回值将会是 {@link FeatureVector} 数组。
     *     -如果 type 为 "Geometry",输入的 JSON 对象必须表示一个唯一的几何体，然后返回值就会是 {@link Geometry}。
     *     -如果 type 为 "Feature"，输入的 JSON 对象也必须表示的一个要素，这样返回值才会是 {@link FeatureVector}。
     */

    read(json, type, filter) {
      type = type || "FeatureCollection";
      let results = null;
      let obj = null;
      if (typeof json === "string") {
        obj = super.read(json, filter);
      } else {
        obj = json;
      }
      if (!obj) ; else if (typeof obj.type !== "string") ; else if (this.isValidType(obj, type)) {
        switch (type) {
          case "Geometry":
            try {
              results = this.parseGeometry(obj);
            } catch (err) {
              // console.error(err);
            }
            break
          case "Feature":
            try {
              results = this.parseFeature(obj);
              results.type = "Feature";
            } catch (err) {
              // console.error(err);
            }
            break
          case "FeatureCollection":
            // for type FeatureCollection, we allow input to be any type
            results = [];
            switch (obj.type) {
              case "Feature":
                try {
                  results.push(this.parseFeature(obj));
                } catch (err) {
                  results = null;
                  // console.error(err);
                }
                break
              case "FeatureCollection":
                for (let i = 0, len = obj.features.length; i < len; ++i) {
                  try {
                    results.push(this.parseFeature(obj.features[i]));
                  } catch (err) {
                    results = null;
                    // console.error(err);
                  }
                }
                break
              default:
                try {
                  const geom = this.parseGeometry(obj);
                  results.push(new Vector(geom));
                } catch (err) {
                  results = null;
                  // console.error(err);
                }
            }
            break
        }
      }
      return results
    }

    /**
     * @function GeoJSONFormat.prototype.write
     * @description iServer Geometry JSON 对象 转 GeoJSON对象字符串。
     * @param {Object} obj - iServer Geometry JSON 对象。
     * @param {boolean} [pretty=false] - 是否使用换行和缩进来控制输出。
     * @returns {GeoJSONObject} 一个 GeoJSON 字符串，它表示了输入的几何对象，要素对象，或者要素对象数组。
     */
    write(obj, pretty) {
      return super.write(this.toGeoJSON(obj), pretty)
    }

    /**
     * @function GeoJSONFormat.prototype.fromGeoJSON
     * @version 9.1.1
     * @description 将 GeoJSON 对象或者GeoJSON 对象字符串转换为iServer Feature JSON。
     * @param {GeoJSONObject} json - GeoJSON 对象。
     * @param {string} [type='FeaureCollection'] - 可选的字符串，它决定了输出的格式。支持的值有："Geometry","Feature"，和 "FeatureCollection"，如果此值为null。
     * @param {function} filter - 对象中每个层次每个键值对都会调用此函数得出一个结果。每个值都会被 filter 函数的结果所替换掉。这个函数可被用来将某些对象转化成某个类相应的对象，或者将日期字符串转化成Date对象。
     * @returns {Object}  iServer Feature JSON。
     */
    fromGeoJSON(json, type, filter) {
      const feature = this.read(json, type, filter);
      if (!Util.isArray(feature)) {
        return this._toiSevrerFeature(feature)
      }
      return feature.map((element) => {
        return this._toiSevrerFeature(element)
      })
    }

    /**
     * @function GeoJSONFormat.prototype.toGeoJSON
     * @version 9.1.1
     * @description 将 iServer Feature JSON 对象转换为 GeoJSON 对象。
     * @param {Object} obj - iServer Feature JSON。
     * @returns {GeoJSONObject}  GeoJSON 对象。
     */
    toGeoJSON(obj) {
      let geojson = {
        type: null
      };
      if (Util.isArray(obj)) {
        geojson.type = "FeatureCollection";
        const numFeatures = obj.length;
        geojson.features = new Array(numFeatures);
        for (let i = 0; i < numFeatures; ++i) {
          const element = obj[i];
          if (isGeometry(element)) {
            const feature = {};
            feature.geometry = element;
            geojson.features[i] = this.extract.feature.apply(this, [feature]);
          } else {
            geojson.features[i] = this.extract.feature.apply(this, [element]);
          }
        }
      } else if (isGeometry(obj)) {
        const feature = {};
        feature.geometry = obj;
        geojson = this.extract.feature.apply(this, [feature]);
      } else {
        geojson = this.extract.feature.apply(this, [obj]);
      }

      function isGeometry(input) {
        return (input.hasOwnProperty("parts") && input.hasOwnProperty("points")) || input.hasOwnProperty("geoParts")
      }

      return geojson
    }

    /**
     *  @function GeoJSONFormat.prototype.isValidType
     *  @description 检查一个 GeoJSON 对象是否和给定的类型相符的合法的对象。
     *  @returns {boolean} GeoJSON 是否是给定类型的合法对象。
     *  @private
     */
    isValidType(obj, type) {
      let valid = false;
      switch (type) {
        case "Geometry":
          if (
            Util.indexOf(["Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon", "Box", "GeometryCollection"], obj.type) ==
            -1
          ) ; else {
            valid = true;
          }
          break
        case "FeatureCollection":
          // allow for any type to be converted to a feature collection
          valid = true;
          break
        default:
          // for Feature types must match
          if (obj.type == type) {
            valid = true;
          }
      }
      return valid
    }

    /**
     * @function GeoJSONFormat.prototype.parseFeature
     * @description 将一个 GeoJSON 中的 feature 转化成 {@link FeatureVector}> 对象。
     * @private
     * @param {GeoJSONObject} obj - 从 GeoJSON 对象中创建一个对象。
     * @returns {FeatureVector} 一个要素。
     */
    parseFeature(obj) {
      let geometry;
      const attributes = obj.properties ? obj.properties : {};
      const bbox = (obj.geometry && obj.geometry.bbox) || obj.bbox;
      try {
        geometry = this.parseGeometry(obj.geometry);
      } catch (err) {
        // deal with bad geometries
        throw err
      }
      const feature = new Vector(geometry, attributes);
      if (bbox) {
        feature.bounds = Bounds.fromArray(bbox);
      }
      if (obj.id) {
        feature.geometry.id = obj.id;
        feature.fid = obj.id;
      }
      return feature
    }

    /**
     * @function GeoJSONFormat.prototype.parseGeometry
     * @description 将一个 GeoJSON 中的几何要素转化成 {@link Geometry} 对象。
     * @param {GeoJSONObject} obj - 从 GeoJSON 对象中创建一个对象。
     * @returns {Geometry} 一个几何要素。
     * @private
     */
    parseGeometry(obj) {
      if (obj == null) {
        return null
      }
      let geometry;
      if (obj.type == "GeometryCollection") {
        // if (!Util.isArray(obj.geometries)) {
        //   throw "GeometryCollection must have geometries array: " + obj
        // }
        const numGeom = obj.geometries.length;
        const components = new Array(numGeom);
        for (let i = 0; i < numGeom; ++i) {
          components[i] = this.parseGeometry([obj.geometries[i]]);
        }
        geometry = new Collection(components);
      } else {
        // if (!Util.isArray(obj.coordinates)) {
        //   throw "Geometry must have coordinates array: " + obj
        // }
        // if (!this.parseCoords[obj.type.toLowerCase()]) {
        //   throw "Unsupported geometry type: " + obj.type
        // }
        try {
          geometry = this.parseCoords[obj.type.toLowerCase()].apply(this, [obj.coordinates]);
        } catch (err) {
          // deal with bad coordinates
          throw err
        }
      }
      return geometry
    }

    /**
     * @function GeoJSONFormat.prototype.createCRSObject
     * @description 从一个要素对象中创建一个坐标参考系对象。
     * @param {FeatureVector} object - 要素对象。
     * @private
     * @returns {GeoJSONObject} 一个可作为 GeoJSON 对象的 CRS 属性使用的对象。
     */
    createCRSObject(object) {
      const proj = object.layer.projection.toString();
      let crs = {};
      if (proj.match(/epsg:/i)) {
        const code = parseInt(proj.substring(proj.indexOf(":") + 1));
        if (code == 4326) {
          crs = {
            type: "name",
            properties: {
              name: "urn:ogc:def:crs:OGC:1.3:CRS84"
            }
          };
        } else {
          crs = {
            type: "name",
            properties: {
              name: "EPSG:" + code
            }
          };
        }
      }
      return crs
    }

    _toiSevrerFeature(feature) {
      const attributes = feature.attributes;
      const attrNames = [];
      const attrValues = [];
      for (const attr in attributes) {
        attrNames.push(attr);
        attrValues.push(attributes[attr]);
      }
      const newFeature = {
        fieldNames: attrNames,
        fieldValues: attrValues,
        geometry: ServerGeometry.fromGeometry(feature.geometry)
      };
      newFeature.geometry.id = feature.fid;
      return newFeature
    }

    createAttributes(feature) {
      if (!feature) {
        return null
      }
      const attr = {};
      processFieldsAttributes(feature, attr);
      const exceptKeys = ["fieldNames", "fieldValues", "geometry", "stringID", "ID"];
      for (const key in feature) {
        if (exceptKeys.indexOf(key) > -1) {
          continue
        }
        attr[key] = feature[key];
      }

      function processFieldsAttributes(feature, attributes) {
        if (!(feature.hasOwnProperty("fieldNames") && feature.hasOwnProperty("fieldValues"))) {
          return
        }
        const names = feature.fieldNames;
        const values = feature.fieldValues;
        for (const i in names) {
          attributes[names[i]] = values[i];
        }
      }

      return attr
    }
  }

  function toGeoJSON(features) {
    const geoJSONFormat = new GeoJSON();
    return geoJSONFormat.toGeoJSON(features)
  }

  exports.toGeoJSON = toGeoJSON;

}));

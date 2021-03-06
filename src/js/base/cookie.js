/**
 *
 *   @description: 该文件用于定义特殊名单列表
 *
 * */

(function (global) {
    'use strict';
    /**
     * @module base.cookie
     * @namespace Cookie
     * @property {boolean} isEnabled                    - 是否支持Cookie
     * @property {function} set                         - 设置Cookie
     * @property {function} get                         - 读取指定的Cookie
     * @property {function} del                         - 删除指定的Cookie
     * @property {function} test                        - 测试浏览器是否支持Cookie
     * @property {function} serialize                   - 将对象转换成字符串
     * @property {function} deserialize                 - 将字符串转换成对象
     * @property {function} setSession                  - 设置sessionStorage
     * @property {function} getSession                  - 获取sessionStorage
     */
    var Cookie = {

        /**
         * @memberof Cookie
         * @summary 是否支持Cookie
         * @type {boolean}
         */
        isEnabled: false,

        /**
         * @memberof Cookie
         * @summary 设置Cookie
         * @type {function}
         * @param {String} name 要设置的Cookie名称
         * @param {String} value 要设置的Cookie值
         * @param {Int} expire 过期时间，单位是小时
         * @param {String} domain 域，默认为本域
         */
        set: function (name, value, expire, domain) {
            var expires = '';

            if (0 !== expire) {
                var t = new Date();
                t.setTime(t.getTime() + (expire || 24) * 3600000);
                expires = ';expires=' + t.toGMTString();
            }
            var s = encodeURIComponent(name) + '=' + encodeURIComponent(value) + expires + ';path=/' + (domain ? (';domain=' + domain) : '');
            document.cookie = s;

            return true;
        },

        /**
         * @memberof Cookie
         * @summary 读取指定的Cookie
         * @type {function}
         * @param {String} name 要获取的Cookie名称
         * @return {String} 对应的Cookie值，如果不存在，返回{null}
         */
        get: function (name) {
            var arrCookie = document.cookie.split(';'),
                arrS;
            for (var i = 0; i < arrCookie.length; i++) {
                var item = arrCookie[i];
                var index = item.indexOf('=');
                var cName = item.substr(0, index);
                var cValue = item.substr(index + 1);
                if (cName.trim() === name) {
                    return decodeURIComponent(cValue);
                }
            }
            return '';
        },

        /**
         * @memberof Cookie
         * @summary 删除指定的Cookie
         * @type {function}
         * @param {String} name 要获取的Cookie名称
         * @param {String} domain 域，默认为本域
         * @param {String} path 路径
         */
        del: function (name, domain, path) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            document.cookie = name + '=; expires=' + exp.toGMTString() + ';' + (path ? ('path=' + path + '; ') : 'path=/; ') + (domain ? ('domain=' + domain + ';') : ('domain=;'));
        },

        /**
         * @memberof Cookie
         * @summary 测试浏览器是否支持Cookie, 如果浏览器支持Cookie,Cookie.isEnabled的值为TRUE,不支持Cookie.isEnabled的值为FALSE
         * @type {function}
         * @return {boolean}
         */
        test: function () {
            var testKey = '_c_t_';
            this.set(testKey, '1');
            this.isEnabled = ('1' === this.get(testKey));
            this.del(testKey);

            return this.isEnabled;
        },

        /**
         * @memberof Cookie
         * @summary 将对象转换成字符串
         * @type {function}
         * @param {object} value                            - 数据对象
         * @return {string}
         */
        serialize: function (value) {

            return JSON.stringify(value);
        },

        /**
         * @memberof Cookie
         * @summary 将字符串转换成对象
         * @type {function}
         * @param {string} value                            - 数据字符串
         * @return {object|undefined}                       - 返回对象，出错时返回undefined
         */
        deserialize: function (value) {

            if (typeof value !== 'string') {

                return value;
            }

            try {

                return JSON.parse(value);

            } catch (e) {

                return value || {};
            }
        },

        /**
         * @memberof Cookie
         * @summary 设置sessionStorage
         * @type {function}
         * @param {string} name                             - 参数名称
         * @param {string} value                            - 参数值
         */
        setSession: function (name, value) {

            try {

                if (!!window.sessionStorage) {
                    window.sessionStorage.setItem(name, this.serialize(value));
                }

            } catch (e) {
                console.log('not support session', e);
                this.set(name, this.serialize(value), 24);
            }
        },

        /**
         * @memberof Cookie
         * @summary 获取sessionStorage
         * @type {function}
         * @param {string} name                             - 参数名称
         * @return {string}
         */
        getSession: function (name) {
            var sRet = '';

            try {

                if (!!window.sessionStorage) {
                    sRet = this.deserialize(window.sessionStorage.getItem(name));
                }

            } catch (e) {
                console.log('not support session', e);
                sRet = this.deserialize(this.get(name));
            }

            return sRet;
        },

        //substr domin last 2 chars
        gMD : function (d) {
            var u;
            
            if (d === u || d === null) {

                return null;
            }
            var i = d.length,
                s;
            
            if (d.charAt(i - 3) === '.') {
                s = d.lastIndexOf('.', d.lastIndexOf('.', i -= (d.indexOf('.com.') > 0) ? 8 : 4));
            
            } else {
                s = d.lastIndexOf('.', d.lastIndexOf('.') - 1);
            }
            s = (s === -1) ? 0 : ++s;

            return d.substring(s);
        },
        randomUid: function () {
             return new Date().getTime();
        },
        _init: function () {
            var domain = document.domain || '127.0.0.1';
            if(this.get('_UID_')) {
                Cookie.set('_UID_', this.randomUid(), 30*86400, domain); //month
            }
        }
    };
    Cookie._init();

    window.Cookie = Cookie;
    /*
     * 兼容 RequireJS 和 Sea.js
     */
    if (typeof define === "function") {
        define('base/cookie',function(require, exports, module) {
            module.exports = Cookie;
        })
    }

}(window));
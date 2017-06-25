'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DomainAPIModel = function () {
    function DomainAPIModel() {
        _classCallCheck(this, DomainAPIModel);

        this.links = {};
    }

    _createClass(DomainAPIModel, [{
        key: 'setDomainName',
        value: function setDomainName(domainName) {
            this.domain = domainName;
        }
    }, {
        key: 'addLink',
        value: function addLink(name, method, url) {
            _lodash2.default.set(this.links, name, {
                method: method,
                url: url
            });
        }
    }, {
        key: 'addPost',
        value: function addPost(name, url) {
            this.addLink(name, 'POST', url);
        }
    }, {
        key: 'addPut',
        value: function addPut(name, url) {
            this.addLink(name, 'PUT', url);
        }
    }, {
        key: 'addGet',
        value: function addGet(name, url) {
            this.addLink(name, 'GET', url);
        }
    }, {
        key: 'addDelete',
        value: function addDelete(name, url) {
            this.addLink(name, 'DELETE', url);
        }
    }, {
        key: 'addHead',
        value: function addHead(name, url) {
            this.addLink(name, 'HEAD', url);
        }
    }, {
        key: 'addPath',
        value: function addPath(name, url) {
            this.addLink(name, 'PATCH', url);
        }
    }]);

    return DomainAPIModel;
}();

exports.default = DomainAPIModel;
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
        value: function addLink(name, method, url, version) {
            if (_lodash2.default.get(this.links, name)) {
                var exists = _lodash2.default.get(this.links, name);
                if (exists instanceof DomainAPIModel) {
                    var lastKey = 0;
                    _lodash2.default.forIn(exists.links, function (value, key) {
                        lastKey = key;
                    });
                    lastKey++;
                    if (version <= lastKey) {
                        throw new Error('Version must increment.');
                    }
                    exists.addLink(version || lastKey, method, url, version || lastKey);
                } else {
                    var current = _lodash2.default.clone(exists);
                    if (version <= current.version) {
                        throw new Error('Version must increment.');
                    }
                    exists = new DomainAPIModel(name);
                    exists.setDomainName(name);
                    exists.addLink(current.version, current.method, current.url);
                    exists.addLink(version || ++current.version, method, url, version || current.version);
                    _lodash2.default.set(this.links, name, exists);
                }
            } else {
                _lodash2.default.set(this.links, name, {
                    method: method,
                    url: '' + url + (version > 1 ? '/v' + version : ''),
                    version: version || 1
                });
            }
        }
    }, {
        key: 'addPost',
        value: function addPost(name, url, ver) {
            this.addLink(name, 'POST', url, ver);
        }
    }, {
        key: 'addPut',
        value: function addPut(name, url, ver) {
            this.addLink(name, 'PUT', url, ver);
        }
    }, {
        key: 'addGet',
        value: function addGet(name, url, ver) {
            this.addLink(name, 'GET', url, ver);
        }
    }, {
        key: 'addDelete',
        value: function addDelete(name, url, ver) {
            this.addLink(name, 'DELETE', url, ver);
        }
    }, {
        key: 'addHead',
        value: function addHead(name, url, ver) {
            this.addLink(name, 'HEAD', url, ver);
        }
    }, {
        key: 'addPatch',
        value: function addPatch(name, url, ver) {
            this.addLink(name, 'PATCH', url, ver);
        }
    }]);

    return DomainAPIModel;
}();

exports.default = DomainAPIModel;
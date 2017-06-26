'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _DomainDTO = require('./DomainDTO');

var _DomainDTO2 = _interopRequireDefault(_DomainDTO);

var _DomainLink = require('./DomainLink');

var _DomainLink2 = _interopRequireDefault(_DomainLink);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var protocol = function protocol(req) {
    return req.connection.encrypted ? 'https://' : 'http://';
};
var addApiName = function addApiName(api) {
    if (api.indexOf(0) !== '/') {
        api = '/' + api;
    }
    if (api.indexOf(api.length - 1) !== '/') {
        return api += '/';
    }
};

var DomainResource = function DomainResource(app, api) {
    _classCallCheck(this, DomainResource);

    var domainActions = [];
    if (!app) {
        throw new Error('Express app is required.');
    }
    if (!api) {
        throw new Error('Api name is required.');
    }
    this.getDTO = function (req) {
        return buildDomainDto(domainActions, protocol(req), req.headers.host, addApiName(api));
    };
    this.get = function (name, url, callback, version) {
        app.get('' + addApiName(api) + url, callback);
        domainActions.push(new _DomainLink2.default('Get', name, url, version));
    };
    this.put = function (name, url, callback, version) {
        app.put('' + addApiName(api) + url, callback);
        domainActions.push(new _DomainLink2.default('Put', name, url, version));
    };
    this.post = function (name, url, callback, version) {
        app.post('' + addApiName(api) + url, callback);
        domainActions.push(new _DomainLink2.default('Post', name, url, version));
    };
    this.delete = function (name, url, callback, version) {
        app.delete('' + addApiName(api) + url, callback);
        domainActions.push(new _DomainLink2.default('Delete', name, url, version));
    };
};

exports.default = DomainResource;

var buildDomainDto = function buildDomainDto(domainActions, protocol, host, api) {
    var dto = new _DomainDTO2.default('DOMAIN_RESOURCE');
    domainActions.forEach(function (domain) {
        switch (domain.method) {
            case 'Get':
                dto.addGet(domain.name, '' + protocol + host + api + domain.url, domain.version);
                break;
            case 'Post':
                dto.addPost(domain.name, '' + protocol + host + api + domain.url, domain.version);
                break;
            case 'Put':
                dto.addPut(domain.name, '' + protocol + host + api + domain.url, domain.version);
                break;
            case 'Delete':
                dto.addDelete(domain.name, '' + protocol + host + api + domain.url, domain.version);
                break;
        }
    });
    return dto;
};
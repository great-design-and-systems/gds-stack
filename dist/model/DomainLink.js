"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DomainLink = function DomainLink(method, name, url, version) {
    _classCallCheck(this, DomainLink);

    this.method = method;
    this.name = name;
    this.url = url;
    this.version = version;
};

exports.default = DomainLink;
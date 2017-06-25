"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DomainLink = function DomainLink(action, name, url, version) {
    _classCallCheck(this, DomainLink);

    this.action = action;
    this.name = name;
    this.url = url;
    this.version = version;
};

exports.default = DomainLink;
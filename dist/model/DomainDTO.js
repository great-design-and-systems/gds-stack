'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _DomainApi = require('./DomainApi');

var _DomainApi2 = _interopRequireDefault(_DomainApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DomainDtoModel = function (_DomainAPIModel) {
    _inherits(DomainDtoModel, _DomainAPIModel);

    function DomainDtoModel(type, data) {
        _classCallCheck(this, DomainDtoModel);

        var _this = _possibleConstructorReturn(this, (DomainDtoModel.__proto__ || Object.getPrototypeOf(DomainDtoModel)).call(this));

        _this.type = type;
        _this.data = data;
        _this.setDomainName(process.env.DOMAIN_NAME);
        return _this;
    }

    return DomainDtoModel;
}(_DomainApi2.default);

exports.default = DomainDtoModel;
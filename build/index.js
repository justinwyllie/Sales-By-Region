/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@babel/runtime/helpers/arrayLikeToArray.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayLikeToArray.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeToArray = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/arrayLikeToArray.js");

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}

module.exports = _arrayWithoutHoles;
module.exports["default"] = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/iterableToArray.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/iterableToArray.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

module.exports = _iterableToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/nonIterableSpread.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/nonIterableSpread.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableSpread;
module.exports["default"] = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/toConsumableArray.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toConsumableArray.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithoutHoles = __webpack_require__(/*! ./arrayWithoutHoles.js */ "./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js");

var iterableToArray = __webpack_require__(/*! ./iterableToArray.js */ "./node_modules/@babel/runtime/helpers/iterableToArray.js");

var unsupportedIterableToArray = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js");

var nonIterableSpread = __webpack_require__(/*! ./nonIterableSpread.js */ "./node_modules/@babel/runtime/helpers/nonIterableSpread.js");

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeToArray = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/arrayLikeToArray.js");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ "./src/components/SalesByRegionReport/SalesByRegionReport.js":
/*!*******************************************************************!*\
  !*** ./src/components/SalesByRegionReport/SalesByRegionReport.js ***!
  \*******************************************************************/
/*! exports provided: SalesByRegionReport */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SalesByRegionReport", function() { return SalesByRegionReport; });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mockData__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../mockData */ "./src/mockData.js");
/* harmony import */ var _woocommerce_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @woocommerce/components */ "@woocommerce/components");
/* harmony import */ var _woocommerce_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_woocommerce_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _woocommerce_date__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @woocommerce/date */ "@woocommerce/date");
/* harmony import */ var _woocommerce_date__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_woocommerce_date__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _woocommerce_currency__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @woocommerce/currency */ "@woocommerce/currency");
/* harmony import */ var _woocommerce_currency__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_woocommerce_currency__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _woocommerce_settings__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @woocommerce/settings */ "@woocommerce/settings");
/* harmony import */ var _woocommerce_settings__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_woocommerce_settings__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_7__);









class SalesByRegionReport extends _wordpress_element__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    const dateQuery = this.createDateQuery(this.props.query);
    console.log("dateQuery", dateQuery);
    const storeCurrency = new _woocommerce_currency__WEBPACK_IMPORTED_MODULE_5___default.a(_woocommerce_settings__WEBPACK_IMPORTED_MODULE_6__["CURRENCY"]);
    this.state = {
      dateQuery: dateQuery,
      currency: storeCurrency,
      allCountries: [],
      data: {
        loading: true
      }
    };
    this.fetchData(this.state.dateQuery);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.getQueryParameters = this.getQueryParameters.bind(this);
    this.prepareData = this.prepareData.bind(this);
    this.getOrdersWithCountries = this.getOrdersWithCountries.bind(this);
    this.getTotalNumber = this.getTotalNumber.bind(this);
  }

  fetchData(dateQuery) {
    if (!this.state.data.loading) this.setState({
      data: {
        loading: true
      }
    });
    const endPoints = {
      'countries': '/wc/v3/data/countries?_fields=code,name',
      //'orders': '/wc-analytics/reports/orders?_fields=order_id,date_created,date_created_gmt,customer_id,total_sales',
      'customers': '/wc-analytics/reports/customers?_fields=id,country',
      'orders': '/wc-analytics/reports/orders?'
    };
    const queryParameters = this.getQueryParameters(dateQuery);
    const countriesPath = endPoints.countries;
    const ordersPath = endPoints.orders + queryParameters;
    const customersPath = endPoints.customers + queryParameters;
    Promise.all([this.state.allCountries.length === 0 ? _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_7___default()({
      path: countriesPath
    }) : Promise.resolve(this.state.allCountries), _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_7___default()({
      path: ordersPath
    }), _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_7___default()({
      path: customersPath
    })]).then(([countries, orders, customers]) => {
      console.log("fetched data orders", orders);
      console.log("fetched Data customers", customers);
      console.log("fetched Data countries", countries);
      const data = this.prepareData(countries, orders, customers);
      console.log("processed Data", data);
      this.setState({
        data: data,
        allCountries: countries
      });
    }).catch(err => console.log(err));
    console.log("processed data", this.state.data);
    console.log("paths", endPoints); //test endpoints

    const test1 = "/wc-analytics/reports/orders";
    _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_7___default()({
      path: test1
    }).then(data => {
      console.log("test1", data);
    });
    const test2 = "/wc-analytics/orders/4610";
    _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_7___default()({
      path: test2
    }).then(data => {
      console.log("test2", data);
    });
  }

  getQueryParameters(dateQuery) {
    const afterDate = encodeURIComponent(Object(_woocommerce_date__WEBPACK_IMPORTED_MODULE_4__["appendTimestamp"])(dateQuery.primaryDate.after, 'start'));
    const beforeDate = encodeURIComponent(Object(_woocommerce_date__WEBPACK_IMPORTED_MODULE_4__["appendTimestamp"])(dateQuery.primaryDate.before, 'end'));
    return `&after=${afterDate}&before=${beforeDate}&interval=day&order=asc&per_page=100&_locale=user`;
  }

  getTotalNumber(data, property) {
    const propertyTotal = data.reduce((accumulator, currentObject) => accumulator + currentObject[property], 0);
    return Math.round(propertyTotal * 100) / 100;
  }

  getOrdersWithCountries(orders, customers, countries) {
    return orders.map(order => {
      order.country_code = customers.find(item => item.id === order.customer_id).country;
      const country = countries.find(item => item.code === order.country_code);
      order.country = country ? country.name : Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('Unknown country', 'wc-admin-sales-by-country');
      return order;
    });
  }

  getPerCountryData(ordersWithCountries) {
    console.log("getPerCountryData", ordersWithCountries);
    return ordersWithCountries.reduce((accumulator, currentObject) => {
      const countryCode = currentObject['country_code'];
      if (!accumulator.countries) accumulator.countries = [];

      if (!accumulator.countries.find(item => item.country_code === countryCode)) {
        const countryObjectTemplate = {
          'country': currentObject['country'],
          'country_code': countryCode,
          'sales': 0,
          'sales_percentage': 0,
          'orders': 0,
          'average_order_value': 0
        };
        accumulator.countries.push(countryObjectTemplate);
      }

      const countryIndexInAccumulator = accumulator.countries.findIndex(item => item.country_code === countryCode);
      accumulator.countries[countryIndexInAccumulator].sales += currentObject.total_sales;
      accumulator.countries[countryIndexInAccumulator].orders++;
      return accumulator;
    }, {});
  }

  prepareData(countries, orders, customers) {
    let data;

    if (orders.length > 0) {
      const ordersWithCountries = this.getOrdersWithCountries(orders, customers, countries);
      data = this.getPerCountryData(ordersWithCountries);
      console.log("data", data);
      data.totals = {
        total_sales: this.getTotalNumber(data.countries, 'sales'),
        orders: this.getTotalNumber(data.countries, 'orders'),
        countries: data.countries.length
      };
      data.countries = data.countries.map(country => {
        country.sales_percentage = Math.round(country.sales / data.totals.total_sales * 10000) / 100;
        country.average_order_value = country.sales / country.orders;
        return country;
      });
    } else {
      data = {
        countries: [],
        totals: {
          total_sales: 0,
          orders: 0,
          countries: 0
        }
      };
    }

    data.loading = false;
    return data;
  }

  createDateQuery(query) {
    console.log("query1", query);
    const {
      period,
      compare,
      before,
      after
    } = Object(_woocommerce_date__WEBPACK_IMPORTED_MODULE_4__["getDateParamsFromQuery"])(query);
    const {
      primary: primaryDate,
      secondary: secondaryDate
    } = Object(_woocommerce_date__WEBPACK_IMPORTED_MODULE_4__["getCurrentDates"])(query);
    return {
      period,
      compare,
      before,
      after,
      primaryDate,
      secondaryDate
    };
  }

  handleDateChange(newQuery) {
    console.log("debug2", this, newQuery);
    const newDateQuery = this.createDateQuery(newQuery);
    this.setState({
      dateQuery: newDateQuery
    }); //this.fetchData(newDateQuery);
  }

  render() {
    console.log("rendering", "props", this.props);
    console.log("rendering", "state", this.state);
    const reportFilters = Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_woocommerce_components__WEBPACK_IMPORTED_MODULE_2__["ReportFilters"], {
      dateQuery: this.state.dateQuery,
      query: this.props.query,
      path: this.props.path,
      currency: this.state.currency,
      isoDateFormat: _woocommerce_date__WEBPACK_IMPORTED_MODULE_4__["isoDateFormat"],
      onDateSelect: this.handleDateChange
    });
    const {
      data,
      currency
    } = this.state;

    if (this.state.data.loading) {
      return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("p", null, "Waiting...");
    } else {
      return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null, reportFilters, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_woocommerce_components__WEBPACK_IMPORTED_MODULE_2__["SummaryList"], null, () => [Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_woocommerce_components__WEBPACK_IMPORTED_MODULE_2__["SummaryNumber"], {
        key: "sales",
        value: currency.render(data.totals.total_sales),
        label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('Total Sales', 'sales-by-region')
      }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_woocommerce_components__WEBPACK_IMPORTED_MODULE_2__["SummaryNumber"], {
        key: "countries",
        value: data.totals.countries,
        label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('Countries', 'sales-by-region')
      }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_woocommerce_components__WEBPACK_IMPORTED_MODULE_2__["SummaryNumber"], {
        key: "orders",
        value: data.totals.orders,
        label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('Orders', 'sales-by-region')
      })]));
    }
  }

}

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/toConsumableArray.js");
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.scss */ "./src/index.scss");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _components_SalesByRegionReport_SalesByRegionReport__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/SalesByRegionReport/SalesByRegionReport */ "./src/components/SalesByRegionReport/SalesByRegionReport.js");

// Import SCSS entry file so that webpack picks up changes





console.log('hello world'); //https://developer.wordpress.org/block-editor/reference-guides/packages/packages-hooks/#api-usage

Object(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__["addFilter"])('woocommerce_admin_reports_list', 'sales-by-region', function (reports) {
  return [].concat(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(reports), [{
    report: 'sales-by-region',
    title: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('Sales by Region', 'sales-by-region'),
    component: _components_SalesByRegionReport_SalesByRegionReport__WEBPACK_IMPORTED_MODULE_5__["SalesByRegionReport"]
  }]);
});

/***/ }),

/***/ "./src/index.scss":
/*!************************!*\
  !*** ./src/index.scss ***!
  \************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/mockData.js":
/*!*************************!*\
  !*** ./src/mockData.js ***!
  \*************************/
/*! exports provided: mockData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mockData", function() { return mockData; });
var mockData = {
  "countries": [{
    "country": "France",
    "country_code": "FR",
    "sales": 33023.23,
    "sales_percentage": 50.37,
    "orders": 4,
    "average_order_value": 8255.8075
  }, {
    "country": "South Korea",
    "country_code": "KR",
    "sales": 3760.72,
    "sales_percentage": 5.73,
    "orders": 1,
    "average_order_value": 3760.72
  }, {
    "country": "Canada",
    "country_code": "CA",
    "sales": 1957.3,
    "sales_percentage": 2.98,
    "orders": 6,
    "average_order_value": 326.27
  }, {
    "country": "Russia",
    "country_code": "RU",
    "sales": 607.44,
    "sales_percentage": 0.92,
    "orders": 3,
    "average_order_value": 202.48
  }, {
    "country": "Croatia",
    "country_code": "HR",
    "sales": 26225.58,
    "sales_percentage": 40.00,
    "orders": 2,
    "average_order_value": 13112.79
  }],
  "totals": {
    "total_sales": 65574.27,
    "orders": 16,
    "countries": 5
  },
  "loading": false
}; // JavaScript Document

/***/ }),

/***/ "@woocommerce/components":
/*!************************************!*\
  !*** external ["wc","components"] ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = window["wc"]["components"]; }());

/***/ }),

/***/ "@woocommerce/currency":
/*!**********************************!*\
  !*** external ["wc","currency"] ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = window["wc"]["currency"]; }());

/***/ }),

/***/ "@woocommerce/date":
/*!******************************!*\
  !*** external ["wc","date"] ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = window["wc"]["date"]; }());

/***/ }),

/***/ "@woocommerce/settings":
/*!************************************!*\
  !*** external ["wc","wcSettings"] ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = window["wc"]["wcSettings"]; }());

/***/ }),

/***/ "@wordpress/api-fetch":
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = window["wp"]["apiFetch"]; }());

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = window["wp"]["element"]; }());

/***/ }),

/***/ "@wordpress/hooks":
/*!*******************************!*\
  !*** external ["wp","hooks"] ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = window["wp"]["hooks"]; }());

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = window["wp"]["i18n"]; }());

/***/ })

/******/ });
//# sourceMappingURL=index.js.map
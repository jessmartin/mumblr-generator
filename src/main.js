"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var ipfs_core_1 = require("ipfs-core");
var micromark_1 = require("micromark");
var fs_1 = __importDefault(require("fs"));
var jsdom = require('jsdom'); // Consider replacing with linkedom
var JSDOM = jsdom.JSDOM;
function main() {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function () {
        var ipfs, cid, blogPostHtml, _b, _c, fileEntry, content, updateItem, e_1_1, html, dom, body;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log('Starting IPFS...');
                    return [4 /*yield*/, (0, ipfs_core_1.create)()];
                case 1:
                    ipfs = _d.sent();
                    cid = 'bafybeih3yplpf4rtzh2xncwmsxlvoftbaj45agbpt3jga234vperrrmbjq';
                    blogPostHtml = '';
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 8, 9, 14]);
                    _b = __asyncValues(ipfs.ls(cid));
                    _d.label = 3;
                case 3: return [4 /*yield*/, _b.next()];
                case 4:
                    if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 7];
                    fileEntry = _c.value;
                    console.log('Parsing ' + fileEntry.name);
                    return [4 /*yield*/, readFile(ipfs, fileEntry.cid)];
                case 5:
                    content = _d.sent();
                    updateItem = new JSDOM("\n      <div class=\"update\">\n        <div class=\"update-t\" data-timestamp=\"???\">\n          <a class=\"datestamp\" href=\"???\" title=\"Updates on this date\">???</a>\n          <a class=\"clockstamp\" href=\"/updates/???\" title=\"Permalink to this update\">???</a>\n        </div>\n        <div class=\"update-s\">\n          ".concat((0, micromark_1.micromark)(content.toString()), "\n        </div>\n      </div>"));
                    blogPostHtml += updateItem.serialize();
                    _d.label = 6;
                case 6: return [3 /*break*/, 3];
                case 7: return [3 /*break*/, 14];
                case 8:
                    e_1_1 = _d.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 14];
                case 9:
                    _d.trys.push([9, , 12, 13]);
                    if (!(_c && !_c.done && (_a = _b["return"]))) return [3 /*break*/, 11];
                    return [4 /*yield*/, _a.call(_b)];
                case 10:
                    _d.sent();
                    _d.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 13: return [7 /*endfinally*/];
                case 14:
                    console.log(blogPostHtml);
                    try {
                        html = fs_1["default"].readFileSync('./src/template.html', 'utf8');
                        dom = new JSDOM(html);
                        body = dom.window.document.querySelector('div.feed');
                        body.innerHTML = blogPostHtml;
                        fs_1["default"].writeFileSync('./public/index.html', dom.serialize());
                    }
                    catch (e) {
                        console.log(e);
                    }
                    console.log('All finished!');
                    process.exit();
                    return [2 /*return*/];
            }
        });
    });
}
exports["default"] = main;
var readFile = function (ipfs, cid) { return __awaiter(void 0, void 0, void 0, function () {
    var decoder, content, _a, _b, chunk, e_2_1;
    var e_2, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                decoder = new TextDecoder();
                content = '';
                _d.label = 1;
            case 1:
                _d.trys.push([1, 6, 7, 12]);
                _a = __asyncValues(ipfs.cat(cid));
                _d.label = 2;
            case 2: return [4 /*yield*/, _a.next()];
            case 3:
                if (!(_b = _d.sent(), !_b.done)) return [3 /*break*/, 5];
                chunk = _b.value;
                content += decoder.decode(chunk);
                _d.label = 4;
            case 4: return [3 /*break*/, 2];
            case 5: return [3 /*break*/, 12];
            case 6:
                e_2_1 = _d.sent();
                e_2 = { error: e_2_1 };
                return [3 /*break*/, 12];
            case 7:
                _d.trys.push([7, , 10, 11]);
                if (!(_b && !_b.done && (_c = _a["return"]))) return [3 /*break*/, 9];
                return [4 /*yield*/, _c.call(_a)];
            case 8:
                _d.sent();
                _d.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                if (e_2) throw e_2.error;
                return [7 /*endfinally*/];
            case 11: return [7 /*endfinally*/];
            case 12: return [2 /*return*/, content];
        }
    });
}); };
main();

"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
// import config from 'config'
var gitlab_1 = require("gitlab");
var RE_ROADMAP_LABELS = /^°\s/;
var print = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return console.log.apply(console, args);
};
function templateDefault(results, full) {
    if (full === void 0) { full = false; }
    for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
        var cat = results_1[_i];
        print("## [\u2609](" + cat.link + ") " + cat.name.substr(2) + "\n");
        print(cat.description + "\n");
        for (var _a = 0, _b = cat.items; _a < _b.length; _a++) {
            var item = _b[_a];
            print("- " + item.title + " [" + item.priority + "] ([#" + item.iid + "](" + item.web_url + "))");
            if (full && (item.description.trim() !== '')) {
                // Indent
                print(item.description.trim().split('\n').map(function (s) { return '   ' + s; }).join('\n'));
            }
        }
        print();
    }
}
function templateFull(results) {
    return templateDefault(results, true);
}
function templateLight(results, full) {
    if (full === void 0) { full = false; }
    for (var _i = 0, results_2 = results; _i < results_2.length; _i++) {
        var cat = results_2[_i];
        print("- [\u2609](" + cat.link + ") " + cat.name.substr(2) + " - " + cat.description);
        for (var _a = 0, _b = cat.items; _a < _b.length; _a++) {
            var item = _b[_a];
            print("  - " + item.title + " [" + item.priority + "] ([#" + item.iid + "](" + item.web_url + "))");
        }
    }
}
function templateSlides(results) {
    print('# Roadmap\n');
    for (var _i = 0, results_3 = results; _i < results_3.length; _i++) {
        var cat = results_3[_i];
        print("- [\u2609](" + cat.link + ") " + cat.name.substr(2));
    }
    print('\n---\n');
    for (var _a = 0, results_4 = results; _a < results_4.length; _a++) {
        var cat = results_4[_a];
        print("# [\u2609](" + cat.link + ") " + cat.name.substr(2) + "\n");
        print("> " + cat.description + "\n");
        if (cat.items.length) {
            for (var _b = 0, _c = cat.items; _b < _c.length; _b++) {
                var item = _c[_b];
                print("- " + item.title + " [" + item.priority + "] ([#" + item.iid + "](" + item.web_url + "))");
            }
            for (var _d = 0, _e = cat.items; _d < _e.length; _d++) {
                var item = _e[_d];
                print('\n----\n');
                print("## " + item.title + " [" + item.priority + "] ([#" + item.iid + "](" + item.web_url + "))\n");
                print("" + (item.description || ''));
            }
        }
        print('\n---\n');
    }
    // for (let cat of results) {
    //   print(`## [☉](${cat.link}) ${cat.name.substr(2)}\n`)
    //   print(`${cat.description}\n`)
    //
    //   for (let item of cat.items) {
    //     print(`- ${item.title} [${item.priority}] ([#${item.iid}](${item.web_url}))`)
    //     if (full && (item.description.trim() !== '')) {
    //       // Indent
    //       print(item.description.trim().split('\n').map(s => '   ' + s).join('\n'))
    //     }
    //   }
    //   print()
    // }
}
var templates = {
    classic: templateDefault,
    full: templateFull,
    light: templateLight,
    slides: templateSlides,
};
function roadmapExport(options) {
    return __awaiter(this, void 0, void 0, function () {
        var host, pid, token, template, api, project, labels, results, _i, labels_1, label, link, category, issues, _a, issues_1, issue, item, pLabel;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    host = options.host, pid = options.pid, token = options.token, template = options.template;
                    api = new gitlab_1.Gitlab({ host: host, token: token });
                    return [4 /*yield*/, api.Projects.show(pid)];
                case 1:
                    project = _b.sent();
                    return [4 /*yield*/, api.Labels.all(pid)];
                case 2:
                    labels = (_b.sent())
                        .filter(function (label) { return RE_ROADMAP_LABELS.test(label.name); });
                    results = [];
                    _i = 0, labels_1 = labels;
                    _b.label = 3;
                case 3:
                    if (!(_i < labels_1.length)) return [3 /*break*/, 6];
                    label = labels_1[_i];
                    link = project.web_url + "/issues?scope=all&utf8=\u2713&label_name[]=" + encodeURIComponent(label.name);
                    category = __assign(__assign({}, label), { link: link, items: [] });
                    results.push(category);
                    return [4 /*yield*/, api.Issues.all({ projectId: pid, labels: label.name })];
                case 4:
                    issues = _b.sent();
                    for (_a = 0, issues_1 = issues; _a < issues_1.length; _a++) {
                        issue = issues_1[_a];
                        item = __assign(__assign({}, issue), { priority: 'normal' });
                        pLabel = issue.labels.find(function (p) { return /^priority:/.test(p); });
                        item.priority = pLabel ? pLabel.split(':')[1] : 'normal';
                        category.items.push(item);
                        //
                        // print(`- ${issue.title} [${priority}] ([#${issue.iid}](${issue.web_url}))`)
                        // if (!slides && (issue.description.trim() !== '')) {
                        //   // Indent
                        //   print(issue.description.split('\n').map(s => '   ' + s).join('\n'))
                        // }
                    }
                    _b.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    // print(template, templates[template])
                    templates[template](results);
                    return [2 /*return*/, results];
            }
        });
    });
}
exports.roadmapExport = roadmapExport;

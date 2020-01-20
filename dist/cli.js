#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var yargs = require("yargs");
var rc_1 = __importDefault(require("rc"));
var api_1 = require("./api");
var conf = rc_1.default('roadmap-extract', {
    //defaults go here.
    host: 'https://git.novadiscovery.net',
    token: 'undefined'
});
var argv = yargs
    .config(conf)
    .options({
    'pid': { type: 'number', alias: ['p'], description: 'Project id', required: true },
    'token': { type: 'string', description: 'Project token (use rc file instead)', required: false },
    'host': { type: 'string', description: 'Gitlab host', required: false },
    'template': { type: 'string', alias: ['t'], enum: ['classic', 'details', 'light', 'slide'], description: 'Template type', required: false, default: 'classic' },
})
    .argv;
var options = {
    host: argv.host,
    pid: argv.pid,
    token: argv.token,
    template: argv.template,
};
api_1.roadmapExport(options).catch(function (error) {
    console.error('Error: ', error.message);
    process.exit(1);
});

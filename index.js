#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var os = require("os");
var child_process = require("child_process");
var fileDir = path.join(os.homedir(), ".local", "share", "warp");
var gatesFilePath = path.join(fileDir, "gates.json");
function getGatesObject() {
    if (fs.existsSync(gatesFilePath)) {
        var gatesContent = fs.readFileSync(gatesFilePath, "utf-8");
        return JSON.parse(gatesContent);
    }
    else {
        fs.writeFileSync(gatesFilePath, "{}", "utf-8");
        var gatesContent = fs.readFileSync(gatesFilePath, "utf-8");
        return JSON.parse(gatesContent);
    }
}
function addGate(gatename) {
    if (fs.existsSync(gatesFilePath)) {
        var gatesObject = getGatesObject();
        gatesObject["".concat(gatename)] = process.cwd();
        fs.writeFileSync(gatesFilePath, JSON.stringify(gatesObject), "utf-8");
    }
    else {
        fs.writeFileSync(gatesFilePath, "{}", "utf-8");
    }
}
function removeGate(gatename) {
    if (fs.existsSync(gatesFilePath)) {
        var gatesObject = getGatesObject();
        var newGatesObject = {};
        for (var _i = 0, _a = Object.entries(gatesObject); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (key === gatename) {
                continue;
            }
            newGatesObject[key] = value;
        }
        fs.writeFileSync(gatesFilePath, JSON.stringify(newGatesObject), "utf-8");
    }
    else {
        fs.writeFileSync(gatesFilePath, "{}", "utf-8");
    }
}
function blinkToGate(gatename) {
    var gatesObject = getGatesObject();
    var GatePath = gatesObject["".concat(gatename)];
    var command = "code ".concat(GatePath, " -r");
    child_process.exec(command, function (error, _, stderr) {
        if (error) {
            console.error("Error: ".concat(error.message));
            return;
        }
        if (stderr) {
            console.error("Stderr: ".concat(stderr));
            return;
        }
    });
}
function listGates() {
    var gatesObject = getGatesObject();
    console.log("listing gate names and paths");
    for (var _i = 0, _a = Object.entries(gatesObject); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        console.log("".concat(key, ": ").concat(value));
    }
}
function execute() {
    if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir);
    }
    var selectedFeature = process.argv[2];
    switch (selectedFeature) {
        case "add": {
            addGate(process.argv[3]);
            break;
        }
        case "remove": {
            removeGate(process.argv[3]);
            break;
        }
        case "blink": {
            blinkToGate(process.argv[3]);
            break;
        }
        case "list": {
            listGates();
            break;
        }
        default: {
            break;
        }
    }
}
execute();

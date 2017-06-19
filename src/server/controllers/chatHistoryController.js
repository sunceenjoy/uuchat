/**
 * Created by jianzhiqiang on 2017/5/12.
 */
"use strict";

var utils = require('../utils');
var ChatHistory = require('../database/chatHistory');

var chatHistoryController = module.exports;

chatHistoryController.create = function (req, res, next) {
    var chatHistory = {
        cid: req.params.cid,
        csid: req.params.csid,
        marked: req.body.marked
    };

    ChatHistory.insert(chatHistory, function (err, data) {
        if (err) return next(err);

        res.json({code: 200, msg: data});
    });
};

chatHistoryController.list = function (req, res, next) {
    var condition = {csid: req.params.csid};
    var order = [['updatedAt', 'DESC']];

    var pageNum = utils.parsePositiveInteger(req.query.pageNum);
    var pageSize = 100;

    ChatHistory.list(condition, order, pageSize, pageNum, function (err, chatHistories) {
        if (err) return next(err);

        res.json({code: 200, msg: chatHistories});
    });
};

chatHistoryController.getLatestMonthChats = function (req, res, next) {
    var condition = {csid: req.params.csid};

    condition.updatedAt = {
        $gt: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
    };

    var order = [['updatedAt', 'DESC']];

    var pageNum = utils.parsePositiveInteger(req.query.pageNum);
    var pageSize = 100;

    ChatHistory.list(condition, order, pageSize, pageNum, function (err, data) {
        if (err) return next(err);

        res.json({code: 200, msg: data});
    });
};

chatHistoryController.search = function (req, res, next) {
    var condition = {};
    var order = [['updatedAt', 'DESC']];

    var pageNum = utils.parsePositiveInteger(req.query.pageNum);
    var pageSize = 10;

    ChatHistory.list(condition, order, pageSize, pageNum, function (err, chatHistories) {
        if (err) return next(err);

        res.json({code: 200, msg: chatHistories});
    });
};
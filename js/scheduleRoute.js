// This file contains the schedule rules for the app

let express = require('express');
let bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({extended:false});
let jsonParser = bodyParser.json({});

// For constructing query string from object properties
const Query = require('query-string');

// For convenience, just name the router 'app'
let app = require('express').Router();

let model = require('./model.js');

module.exports = app;
app.get('/schedule/getschedule', (req, res)=>{
  model.User.findOne({email: req.session.user}, '_id', (err, id)=>{
    if (err) {
      model.errHandler(err, res);
    }
    else {
      model.Schedule.find({owner: id._id}, (err, result)=>{
        if (err) {
          model.errHandler(err, res);
        }
        else {
          res.send(result);
        }
      });
    }
  });
});

app.get('/schedule/newschedule', (req, res)=>{
  model.User.findOne({email: req.session.user}, '_id', (err, id)=>{
    if (err) {
      model.errHandler(err, res);
    }
    else {
      var schedule = new model.Schedule({owner: id._id, content: req.query.content, endDate: req.query.endDate, startDate: req.query.startDate});
      schedule.save(function (err) {
        if (err) {
          model.errHandler(err, res);
        }
        else {
          res.redirect('/schedule');
        }
      });
    }
  });
});

app.get('/schedule/updateschedule', (req, res)=>{
  var OldstartDate = new Date(req.query.OldstartDate);
  var OldendDate = new Date(req.query.OldendDate);
  model.User.findOne({email: req.session.user}, '_id', (err, id)=>{
    if (err) {
      model.errHandler(err, res);
    }
    else {
      model.Schedule.find({owner: id._id}, (err, schedule)=>{
        for (i=0; i<schedule.length;i++) {
          var TempstartDate = new Date(schedule[i].startDate);
          var TempendDate = new Date(schedule[i].endDate);
          if ((OldstartDate.getTime() === TempstartDate.getTime()) && (OldendDate.getTime() === TempendDate.getTime())){
            schedule[i].content = req.query.content;
            schedule[i].startDate = req.query.NewstartDate;
            schedule[i].endDate = req.query.NewendDate;
            schedule[i].save();
            break;
          }
        }
        res.redirect('/schedule');
      })
    }
  });
});

app.get('/schedule/deleteschedule', (req, res)=>{
  var OldstartDate = new Date(req.query.startDate);
  model.User.findOne({email: req.session.user}, '_id', (err, id)=>{
    if (err) {
      model.errHandler(err, res);
    }
    else {
      model.Schedule.find({owner: id._id, content: req.query.content}, (err, schedule)=>{
        for (i=0; i<schedule.length;i++) {
          var tempDate = new Date(schedule[i].startDate);
          if (OldstartDate.getTime() === tempDate.getTime()) {
            schedule[i].remove();
            break;
          }
        }
        res.redirect('/schedule');
      })
    }
  });
});

'use strict';
let mongodb = require('mongodb')
let mongoose = require('mongoose')
let httpRequest = require('xmlhttprequest').XMLHttpRequest

module.exports = function (app) {
  let uri = "mongodb+srv://hungtp2912:"+ encodeURIComponent(process.env.PW)+"@cluster0.sgaqi8v.mongodb.net/Message_Manager?retryWrites=true&w=majority&appName=Cluster0";
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true})

  let replySchema = new mongoose.Schema({
    text: {type: String, required: true},
    delete_password: {type: String, required: true},
    created_on: {type: Date, required: true},
    reported: {type: Boolean, required: true}
  })

  let msgSchema = new mongoose.Schema({
    board: {type: String, required: true},
    text: {type: String, required: true},
    created_on: {type: Date, required: true},
    bumped_on: {type: Date, required: true},
    reported: {type: Boolean, default: false},
    delete_password: {type: String, required: true},
    replies: [replySchema]
  })
  let Reply = mongoose.model('Reply', replySchema)
  let Msg = mongoose.model('message', msgSchema)

  app.route('/api/threads/:board')
  .post((req, res) => {
    let data = req.body
    console.log(data)
    let newMsg = new Msg({
      board: data.board,
      text: data.text,
      delete_password: data.delete_password
    })

    newMsg.save()
          . then((result) => {
            console.log('New Msg created: ', result)
            res.status(201).json(result)
          })
          .catch(err => {
            console.error('Error creating message: ', err)
            res.status(500).json({error: 'Error creating new message'})
          })
  })

  .get((req, res) => {
    // let bumpedThread = 
  })

  .put((req, res) => {

  })

  .delete((req, res) => {

  })
    
  app.route('/api/replies/:board')
  .post((req, res) => {
    let data = req.body
    let threadId = data['thread_id']
    let board = req.params
    
  })

  .get((req, res) => {

  })

  .put((req, res) => {
    
  })

  .delete((req, res) => {
    
  })

};
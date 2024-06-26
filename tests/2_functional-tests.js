const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    let msgId
    let replyId
    let pass = 'test'

    test('Create a new message', (done) => {
        chai.request(server)
            .post('/api/threads/test')
            .send({
                board: 'test',
                text: 'Functional test thread',
                delete_password: pass
            })
            .end((err, res) => {
                assert.equal(res.status, 200)
                let newMsgId = res.redirects[0].split('/')[res.redirects[0].split('/').length - 1]
                msgId = newMsgId
                done()
            })
    })

    test('Post a reply', (done) => {
        chai.request(server)
            .post('/api/replies/test')
            .send({
                thread_id: msgId,
                text: 'Test reply to a thread',
                delete_password: pass
            })
            .end((err, res) => {                
                assert.equal(res.status, 200)
                let createdReplyId = res.redirects[0].split('=')[res.redirects[0].split('=').length - 1]
                replyId = createdReplyId
                done()
            })
    })

    test('Get msg from a board', done =>{
        chai.request(server)
            .get('/api/threads/test')
            .send()
            .end((err, res) => {
                console.log('=================')
                console.log(res.body)
                assert.isArray(res.body)
                assert.isAtMost(res.body.length, 10)
                let secondMsg = res.body[0]
                assert.isAtMost(secondMsg.replies.length, 3)
                done()
            })
    })

    test('Get replies on a thread', done => {
        chai.request(server)
            .get('/api/replies/test')
            .query({thread_id: msgId})
            .send()
            .end((err, res) => {
                let msg = res.body
                assert.equal(msg._id, msgId)
                assert.isUndefined(msg.delete_password)
                assert.isArray(msg.replies)
                done()
            })
    })

    test('Report a Thread', done => {
        chai.request(server)
            .put('/api/threads/test')
            .send({
                thread_id: msgId
            })
            .end((err, res) => {
                assert.equal(res.body, 'success')
                done()
            })
    })

    test('Report a reply', done => {
        chai.request(server)
            .put('/api/replies/test')
            .send({
                thread_id: msgId,
                reply_id: replyId
            })
            .end((err, res) => {
                assert.equal(res.body, 'reported')
                done()
            })
    })

    test('Delete a reply on a thread', done => {
        chai.request(server)
            .delete('/api/replies/test')
            .send({
                thread_id: msgId,
                reply_id: replyId,
                delete_password: pass
            })
            .end((err, res) => {
                assert.equal(res.body, 'success')
                done()
            })
    })

    test('Delete a thread', done => {
        chai.request(server)
            .delete('/api/threads/test')
            .send({
                thread_id: msgId,
                delete_password: pass
            })
            .end((err, res) => {
                assert.equal(res.body, 'success')
                done()
            })
    })
});

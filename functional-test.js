const		superagent = require('superagent')
		,	expect = require('expect.js')


// Test Suite
describe('Sick Lists Server', function(){

	var id

	it('post task', function(done){
		superagent.post('http://localhost:3000/tasks')
			.send({text: 'A new task'})
			.end(function(e, res){
				expect(e).to.eql(null)
				expect(res.status).to.eql(200)
				expect(res.type).to.eql('application/json')
				expect(res.body.length).to.be.above(0)
				expect(res.body[0].text).to.be.eql('A new task')
				id = res.body[0]._id
				done()
			})
	})

	it('retrieve a task', function(done){
		superagent.get('http://localhost:3000/tasks')
			.end(function(e, res){
				expect(e).to.eql(null)
				expect(res.status).to.eql(200)
				expect(res.type).to.eql('application/json')
				expect(res.body.length).to.be.above(0)
				expect(res.body[0].text).to.be.eql('A new task')
				done()
			})
	})

	it('update a task', function(done){
		superagent.put('http://localhost:3000/tasks')
			.send({
				text: 'Another task',
				_id: id
			})
			.end(function(e, res){
				expect(e).to.eql(null)
				expect(res.status).to.eql(200)
				expect(res.type).to.eql('application/json')
				expect(res.body.msg).to.eql('success')
				done()
			})
	})

	it('checks updated task', function(done){
		superagent.get('http://localhost:3000/tasks')
			.end(function(e, res){
				expect(e).to.eql(null)
				expect(res.status).to.eql(200)
				expect(res.type).to.eql('application/json')
				expect(res.body.map(function(item){ return item.text }))
					.to.contain('Another task')
				done()
			})
	})

})

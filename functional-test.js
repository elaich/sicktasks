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
				expect(res.body[0].done).to.be.eql(false)
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
				expect(res.body.filter(function(item){ return item._id == id })[0])
					.to.have.property('text', 'A new task')
				done()
			})
	})

	it('updates a task text', function(done){
		superagent.put('http://localhost:3000/tasks/' + id)
			.send({
				text: 'Another task'
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
				expect(res.body.filter(function(item){ return item._id == id })[0])
					.to.have.property('text', 'Another task')
				done()
			})
	})

	it('marks a task as done', function(done){
		superagent.put('http://localhost:3000/tasks/' + id)
			.send({
				done: true
			})
			.end(function(e, res){
				expect(e).to.eql(null)
				expect(res.status).to.eql(200)
				expect(res.type).to.eql('application/json')
				expect(res.body.msg).to.eql('success')
				done()
			})
	})

	it('checks if a task is done', function(done){
		superagent.get('http://localhost:3000/tasks')
			.end(function(e, res){
				expect(e).to.eql(null)
				expect(res.status).to.eql(200)
				expect(res.type).to.eql('application/json')
				expect(res.body.filter(function(task){
					return task._id === id
				})[0]).to.have.property('done', true)
				done()
			})
	})

	it('deletes a task', function(done){
		superagent.del('http://localhost:3000/tasks/' + id)
			.end(function(e, res){
				expect(e).to.eql(null)
				expect(res.status).to.eql(200)
				expect(res.type).to.eql('application/json')
				expect(res.body.msg).to.eql('success')
				done()
			})
	})

	it('checks deleted task', function(done){
		superagent.get('http://localhost:3000/tasks')
			.end(function(e, res){
				expect(e).to.eql(null)
				expect(res.body.filter(function(item){ return item._id == id }).length)
					.to.eql(0)
				done()
			})
	})

})

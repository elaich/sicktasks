const		express = require('express')
		,	mongo = require('mongoskin')
		, 	bodyParser = require('body-parser')
		,	logger = require('morgan')

var app = express()

var db = mongo.db('mongodb://localhost:27017/tasks', {safe:true})


app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use(express.static(__dirname + '/public'))

app.use(function(req, res, next){
	req.collection = db.collection('tasks')
	next()
})

app.set('views', './views')
app.set('view engine', 'jade')

app.get('/', function(req, res, next){
	req.collection.find().toArray(function(err, results){
		if (err) return next(err)
		res.render('index', {tasks: results})
	})
})

app.post('/tasks', function(req, res, next){
	req.body.done = false
	req.collection.insert(req.body, function(err, results){
		if (err) return next(err)
		res.json(results)
	})
})

app.get('/tasks', function(req, res, next){
	req.collection.find().toArray(function(err, results){
		if (err) return next(err)
		res.json(results)
	})
})

app.put('/tasks/:id', function(req, res, next){
	var updated = {$set: (req.body.text)?{text: req.body.text}:{done: req.body.done}}

	req.collection.updateById(req.params.id, updated, function(err, sucess){
		if(err) return(err)
		res.json((sucess === 1)?{msg: 'success'}:{msg: 'error'})
	})
})

app.delete('/tasks/:id', function(req, res, next){
	req.collection.removeById(req.params.id, function(err, success){
		if (err) return (err)
		res.json((success === 1)?{msg: 'success'}:{msg: 'error'})
	})
})

app.listen(3000)

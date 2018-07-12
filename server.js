const path = require('path');

// ============ Express ============ 
const express = require('express');
const app = express();

// ============ Body Parser ============ 
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ============ View Engine ============ 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============ Session ============ 
const session = require('express-session');
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 }
}))

// ============ Flash ============ 
const flash = require('express-flash');
app.use(flash());

// ============ Mongoose ============ 
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/Task_api_db")
const TaskSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, "Task must have a title."],
        minlength: [3, "Title must be at least 3 characters long"]
    },
    description: {
    	type: String, 
    	default: ''
    },
    completed: {
    	type: Boolean,
    	default: false
    }
}, { timestamps: true });
const Task = mongoose.model('Task', TaskSchema);

// ============ Static Routes ============ 
app.use(express.static(path.join(__dirname, "static")));

// ============ Server ============ 
app.listen(8000);

// ============ Routes ============ 
app.get('/', function (req, res) {
	Task.find({}, function(err, tasks){
		if(err){
			console.log('an error ocurred in loading all query: ',err);
		}else{
			console.log('tasks found: ', tasks);
			 res.json(tasks);
		}
	});
});

app.get('/tasks/:id', function (req, res) {
	Task.findOne({_id: req.params.id}, function(err, task){
		if(err){
			console.log('an error ocurred in loading all query: ',err);
		}else{
			console.log('task found: ', task);
			 res.json(task);
		}
	});
});

app.post('/tasks', function(req, res){
	console.log('request body: ', req.body);
	const taskInst = new Task();
	taskInst.title = req.body.title;
	if(req.body.desc){
		taskInst.description = req.body.desc;
	};
	taskInst.save(function(err, task){
		if(err){
			console.log(err);
		} else{
			console.log('task created: ', task);
			res.json(task);
		}
	})
});

app.put('/tasks/:id', function (req, res) {
	Task.findOne({_id: req.params.id}, function(err, task){
		if(err){
			console.log('an error ocurred in loading all query: ',err);
		}else{
			if(req.body.title){
				task.title = req.body.title;
			}
			if(req.body.desc){
				task.description = req.body.desc;
			}
			task.save(function(err){
				if(err){
					console.log('errrrrr', err);
				}else{
					res.json(task);
				}
			})
		}
	});
});

app.delete("/tasks/:id", function(req, res){
    console.log("app.delete('/tasks/:id'), id: ", req.params.id);
    Task.findOneAndDelete({_id: req.params.id}, function(query) {
    	console.log('query: ', query);
    	res.json({deleted: 'task id: '+ req.params.id})
    })
})










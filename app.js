var express 		= require('express'),
	app 			= express(), 
	mongoose 		= require('mongoose'), 
	bodyParser 		= require('body-parser'), 
	methodOverride 	= require('method-override');

app.set('view engine','ejs'); 
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method')); 
app.use(express.static(__dirname));

app.locals.BtnKeys = {
	'index': ['view ratings','results','start rating stocks','ratings'],
	'results': ['back home','index','start rating stocks','rating'],
	'rating': ['back home','index','view ratings','rating']
}

app.listen(3000,function(){
	console.log('stock rating app is runnning')
})

app.get('/',function(req,res){
	res.redirect('/index')
})

app.get('/index',function(req,res){
	res.render('index',{url: req.url.split('/').pop()})
})

app.get('/results',function(req,res){
	res.render('results',{url: req.url.split('/').pop()})
})


app.get('/rating',function(req,res){
	res.render('rating',{url: req.url.split('/').pop()})
})
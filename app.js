var express 		= require('express'),
	app 			= express(), 
	mongoose 		= require('mongoose'), 
	bodyParser 		= require('body-parser'), 
	methodOverride 	= require('method-override'),
	Stock 			= require('./models/stocks'),
	seedDb 			= require('./seed'),
	getStockData	= require('./livedata');

//seedDb();
app.set('view engine','ejs'); 
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method')); 
app.use(express.static(__dirname));

app.locals.BtnKeys = {
	'index': ['view ratings','results','start rating stocks','rating'],
	'results': ['back home','index','start rating stocks','rating'],
	'rating': ['back home','index','view ratings','results']
}

mongoose.connect('mongodb://localhost/stock_rating_app',{useNewUrlParser: true, useUnifiedTopology: true})


app.use('/',function(req,res,next){
	app.locals.url = req.url.split('/').pop()
	next()
})

app.listen(3000,function(){
	console.log('stock rating app is runnning')
})

app.get('/',function(req,res){
	res.redirect('/index')
})

app.get('/index',function(req,res){
	res.render('index')
})

app.get('/results',function(req,res){
	Stock.find({},function(err,assets){
		if(err){
			console.log('error finding stocks db')
		} else {
			res.render('results',{assets:assets})
		}
	})
})


app.get('/rating',function(req,res){
	Stock.find({},function(err,assets){
		if(err){
			console.log(err)
		} else {
			res.render('rating',{assets:assets})
		}
	})
})

app.put('/rating',function(req,res){
	Stock.find({},function(err,assets){
		if(err){
			console.log(err)
		} else {
			var indexes = req.body.result.split('beat'),
				current_rating_A = assets[indexes[0]].rating,
				current_rating_B = assets[indexes[1]].rating,
				k = 20, // needs to be changed to be a function of number of 'matches'
				expected_score_A = 1/(1+(Math.pow(10,(current_rating_B-current_rating_A)/400))),
				expected_score_B = 1 - expected_score_A,
				new_rating_A = Math.round(current_rating_A + (k*(1-expected_score_A))),
				new_rating_B = Math.round(current_rating_B + (k*(0-expected_score_B))),
				ratings = [new_rating_A,new_rating_B]; 
			for(var i=0; i<2; i++){
				Stock.findByIdAndUpdate(
					{_id: assets[indexes[i]]._id},
					{rating: ratings[i]},
					function(err,result){
						if (err){
							console.log(err)
						}
				})
			}
			res.redirect('/rating')
		}
	})
})













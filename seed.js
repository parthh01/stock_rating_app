var scraped 	= [],
	request 	= require('request'),
	JSSoup		= require('jssoup').default,
	Stock		= require('./models/stocks'),
	avgRating	= 1500;


function getAssetImage(asset){ // not in use since limit is 100 requests per day 
	var options = {
		url: 'https://www.googleapis.com/customsearch/v1', 
		qs: {
			key : 'AIzaSyBpqR9AEj2uojBumsbUvNJLLCiW_wR_GzM',
			cx: '006806863583789751225:msqikwq12by',
			q: asset + ' logo',
			searchType: 'image'
		}
	}
	request(options,async function(err,res,body){
		if (err){
			console.log('error retrieving asset image')
		} else { 
			await console.log(JSON.parse(body))
		}
	})
}

async function getSeedData(){
	return new Promise(function(resolve,reject){
		request('https://www.slickcharts.com/sp500',async function(err,res,body){
			if (err){
				console.log('error making request to page')
			} else {
				var soup = new JSSoup(body); 
				var rows = soup.findAll('tr');
				for(var i = 1; i < rows.length ; i++){
					var obj = {
							equity : rows[i].contents[1].text,
							ticker : rows[i].contents[2].text,
							image : 'dnf',
							rating : avgRating - parseInt(rows[i].contents[0].text)		
						}
					scraped.push(obj)
				}
			resolve(scraped)
			}
		})
	})
}


async function seedDb(){
	var scraped = await getSeedData()
	Stock.deleteMany({},function(err){
		if(err){
			console.log('error emptying stock db')
		} else {
			console.log('stock db emptied');
			scraped.forEach(seed => {
				Stock.create(seed,function(err,data){
					if(err){
						console.log('error adding seeds to stock db')
					}
				})
			})
			console.log('seeds added to db')
		}
	})
}



module.exports = seedDb; 

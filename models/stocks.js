var mongoose 	= require('mongoose');


var stockSchema = new mongoose.Schema({
	equity: String, 
	ticker: String, 
	image: String, 
	rating: Number, 
})


var Stock = mongoose.model("Stock",stockSchema); 


module.exports = mongoose.model('Stock',stockSchema);

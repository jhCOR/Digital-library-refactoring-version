var databaseModelClass = require('./database');
const databaseModel = databaseModelClass.databaseModel;

class Book extends databaseModel{
	constructor(id,req,res){
		super(req,res);
		this.id = id;
		this.errorMessage;
	}
	
	findByIdAndUpdate(datamodel,option){
		var ID = this.id;
		return new Promise(function(resolve, reject) {
			datamodel.findByIdAndUpdate(ID, option, function(error,result){
				
				if(error){
					reject(error);
				}else{
					resolve(result);
				}
			});
 		});
	}
}

module.exports.Book = Book;
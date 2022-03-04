class databaseModel{
	constructor(req,res){
		this.req=req;
		this.res=res;
		this.database = this.req.app.get('database');
		this.result;
	}
	
	checkAndSkipIfDatabaseNotInit(database){
		if(database.db){
			return function(){};;
		}else{
			return function(res){ printer.errrendering(this.res); return; };
		}
	}
	
	checkAndAlertIfError(error){
		if(error){
			console.error('데이터 베이스 에러 발생 : ' + error.stack);
			
			this.res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        	this.res.write('<p>' + error.stack + '</p>');
        	this.res.end();
			
			return function(){ return; };
		}else{
			return function(){};
		}
	}
	
	returnDataList(datamodel,option){
		return new Promise(function(resolve, reject) {
			datamodel.list(option, function(error,result){
				
				if(error){
					reject(error);
				}else{
					resolve(result);
				}
			});
 		});
	}
	
	saveDataModel(datamodel){
		return new Promise(function(resolve, reject) {
			datamodel.savePost(function(err, result) {
				
				
				if(err){
					reject(err);
				}else{
					resolve(result);
				}
				
			});
 		});
	}

}
module.exports.databaseModel = databaseModel;
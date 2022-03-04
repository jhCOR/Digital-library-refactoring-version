var databaseModelClass = require('./database');
const databaseModel = databaseModelClass.databaseModel;

class User extends databaseModel{
	constructor(email,req,res){
		super(req,res);
		this.userEmail=email;
		this.errorMessage;
	}
	
	retutnErrorMassage(){
		if(this.errorMessage){
			this.res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
			this.res.write(this.errorMessage);
			this.res.end();
			return;
		}
	}
	
	isModifyNameSuccess(err){
		if(err){
			this.errorMessage = '<h2>이름 수정 실패</h2>';
		}else{
			this.res.redirect('/profile');
			this.errorMessage = null;
		}
	}
	
	isUserInDatabase(results){
		if(results == undefined || results.length < 1){
			this.errorMessage = '<h2>사용자를 찾을 수 없습니다.</h2>';
		}else{
			this.errorMessage = null;
		}
	}
	
	isChangedToAdmin(result){
		if(result.admin=="accepted"){
			this.res.redirect("/user/requestlist?page=0&perPage=2");
			this.errorMessage = null;
		}else{
			this.errorMessage = '<h2>권한 설정 실패</h2>'
		}
	}
	
	findUserByEmail(){
		const DATABASE = this.database;
		const EMAIL = this.userEmail;
		return new Promise(function(resolve, reject) {
			DATABASE.UserModel.findByEmail(EMAIL, function(err, results) {
				
				resolve(results);
				if(err){
					reject(err);
				}
				
			});
 		});
	}
}
module.exports.User = User;
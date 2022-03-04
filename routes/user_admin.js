var printer = require("../utils/printer");
var saver = require("../utils/saver");

const ROUTEFUNCTIONPATH="../routeFunc";

var databaseModelClass = require('./class/database');
const databaseModel = databaseModelClass.databaseModel;

class admin extends databaseModel{
	constructor(req,res){
		super(req,res);

	}
	
	findFromBookModel(option){
		return this.database.BookModel.find(option);
	}
}

var adminpage =async function(req, res) {
	console.log('user_admin 모듈 안에 있는 adminpage 호출됨.');

	var database = req.app.get('database');
	var listObject=[];
	var listCount=[];
	
	listObject.push({group:req.user.group});
	listObject.push({num:'1'});
	
	var adminDatabase = new admin(res,req);
	adminDatabase.checkAndSkipIfDatabaseNotInit(adminDatabase.database)();

		var today=new Date();
		if(today.getDay()>14){
			today.setDate(today.getDate()-14);
		}else{
			var minus=14-today.getDate();
			
			var setToday = today.setMonth(today.getMonth()-1);
			var setToday2 = today.setDate(-1);
			
			today.setDate(today.getDate()-minus);
			
		}

		
		adminDatabase.database.UserModel.find({group:req.user.group}).countDocuments().exec(async function(err, count) {

		listCount.push(count);
			await adminDatabase.findFromBookModel({group:req.user.group}).countDocuments().exec(function(err, count) {
			
			// 뷰 템플레이트를 이용하여 렌더링한 후 전송
			listCount.push(count);
				
				adminDatabase.findFromBookModel({num:'1',group:req.user.group}).countDocuments().exec(async function(err, count) {

				// 뷰 템플레이트를 이용하여 렌더링한 후 전송
				await listCount.push(count);
					
					adminDatabase.database.BookModel.find({group:req.user.group}, async function(err, result) {
						
						var context = {
							totalUser:listCount[0],
							totalbook:listCount[1],
							borrowedbook:listCount[2],
							books:result,
							login_success: true, 
							admin:req.user.admin
						};
						
						res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
						await printer.rendering(req,res,'adminPage.ejs',context);
					});
					
				});
			});
		});
	
};

var searchadminpage =async function(req, res) {
	console.log('user_admin 모듈 안에 있는 searchadminpage 호출됨.');
	var searchquery=req.body.search || req.query.search || req.params.search;
	
	var adminPageDatabase = new databaseModel(res,req);
	adminPageDatabase.checkAndSkipIfDatabaseNotInit(adminPageDatabase.database)();
	
	if(searchquery==0||searchquery==1){
		var option = {  num:"1",group: req.user.group, };
		
		adminPageDatabase.database.BookModel.find(option).exec(function(err, result) {
		
		var context = {
			books:result
		};	
		res.send(result);
			
		});

		
	}else if(searchquery==2){
		var option = { group: req.user.group };
		adminPageDatabase.database.UserModel.find(option).exec(function(err, result) {
			

		var context = {
			users:result
		};
						
		res.send(result);
			
		});
		
	}
};
module.exports.adminpage = adminpage;
module.exports.searchadminpage = searchadminpage;
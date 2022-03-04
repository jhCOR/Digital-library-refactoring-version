const ROUTEFUNCTIONPATH="../routeFunc";
var printer = require("../utils/printer");
var saver = require("../utils/saver");
var Entities = require('html-entities').AllHtmlEntities;

var bookModelClass = require('./class/bookClass.js');
const Book = bookModelClass.Book;


var updatepost = function(req, res) {
	console.log('modifyBook 모듈 안에 있는 updatePost 호출됨.');
    // URL 파라미터로 전달됨
	var paramId = req.body.id || req.query.id || req.params.id;

	var database = req.app.get('database');
if (database.db) {
		database.BookModel.load(paramId, function(err, results) {
			if (err) {
                console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);

				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');
				res.write('<p>' + err.stack + '</p>');
				res.end();
                return;
			}
			if (results) {

				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				
				// 뷰 템플레이트를 이용하여 렌더링한 후 전송
				var context = {
					title: '글 수정 ',
					posts: results,
					Entities: Entities
				};
				
				printer.rendering(req,res,'updatepost.ejs',context);	
			} 
		});
	}
};

var saveupdatedpost = function(req, res) {
	console.log('modifyBook 모듈 안에 있는 saveupdatedpost 호출됨.');
	
	var paramId =req.body.id || req.query.id;
	var paramTitle = req.body.title || req.query.title;
    var paramContents = req.body.contents || req.query.contents;
	
	var BookForModify = new Book(paramId, req, res);
	BookForModify.checkAndSkipIfDatabaseNotInit(BookForModify.database)();
	
	try{
		var option = {$set: {title : paramTitle, contents : paramContents, updated_at : Date.now()}};
		BookForModify.findByIdAndUpdate(BookForModify.database.BookModel, option);
	}catch(error){
		BookForModify.checkAndAlertIfError(error)();
	}finally{
		res.redirect('/book/showbook/' + paramId); 
	}
};
module.exports.updatepost = updatepost;
module.exports.saveupdatedpost = saveupdatedpost;
var saver = require("../utils/saver");
var printer = require("../utils/printer");
var showListModule = require('./showList');

var userModelClass = require('./class/userClass.js');
const User = userModelClass.User;

var addHistoryOfBook = async (req, res)=> {
	console.log('HistoryOfBook 모듈 호출됨');

	var paramContents = req.body.contents || req.query.contents||'0';
	var bookInformation = req.body.booktitles || req.query.booktitles;
	var paramTitle = req.body.title || req.query.title||paramContents.substring(0,10);
	var range =  req.body.range || req.query.range || req.params.range;
	var paramWriter =req.user.email;
	
	
	var historyWriter = new User(paramWriter, req,res);
	const DATABASE = historyWriter.database;
	historyWriter.checkAndSkipIfDatabaseNotInit(DATABASE)();
	
	try{
		var results = await historyWriter.findUserByEmail();
		historyWriter.isUserInDatabase(results);
		historyWriter.retutnErrorMassage();
		var userObjectId = Array.isArray(results) ? results[0]._doc._id : results._id;
	
		var Entities = require('html-entities').AllHtmlEntities;
		var entities = new Entities();
		var decodedContents = entities.decode(paramContents); 

		var post = new DATABASE.BookPostModel({
			title: paramTitle,
			contents: paramContents,
			writer: userObjectId,
			bookinfo: bookInformation,
			group:req.user.group,
			range:range,
			writeremail:req.user.email,	
		});

		var BookPostModelResult = await historyWriter.saveDataModel(post);
		return res.redirect('/history/' + post._id); 

	}catch(ERROR){
		historyWriter.checkAndAlertIfError(ERROR)();
	}
};

var showHistory = (req, res)=>{
	var paramId =  req.body.id || req.query.id || req.params.id;
		var database = req.app.get('database');
	
		database.BookPostModel.load(paramId, function (err, results) {

				if (err) {
					console.log('error');
					console.error('게시판 글 조회 중 에러 발생 : ' + err.stack);
					printer.errrendering(res,err);
					return;
				}
				
				if (results) {
					res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });

					var context = {
						title: '내 독서 기록 보기',
						post: results,
						login: req.user.email,
					};
			   
				printer.rendering(req,res,'history/historyOfBook_show.ejs',context);	
				} else {
					res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
					res.write('<h2>글 조회  실패</h2>');
					res.end();
				}
			});
	}
var listHistoryOfBook =  (req, res)=>{
	showListModule.listHistoryOfBook(req, res);
}

var deleteHistoryOfBook = function (req, res) {
    var paramId = req.body.id || req.query.id || req.params.id;
    var database = req.app.get('database');
	console.log("deleteHistoryOfBook");
    if (database.db) {
		database.BookPostModel.load(paramId, function(err, results) {

            if (err) {
                res.writeHead('200', { 'Contett-Type': 'text/html;charset =utf8' });
                res.write('<h2>삭제할 글 조회 중 오류 발생</h2>')
                res.end();
                return;
			}
			
            if (results) {
                results.remove();
                res.redirect('/historyofbook?page=0&perPage=8');
            }
        });
    } else {
        res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
};
module.exports.addHistoryOfBook = addHistoryOfBook;
module.exports.showHistory = showHistory;
module.exports.listHistoryOfBook = listHistoryOfBook;
module.exports.deleteHistoryOfBook = deleteHistoryOfBook;
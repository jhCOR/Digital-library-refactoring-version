const ROUTEFUNCTIONPATH="../routeFunc";
var printer = require("../utils/printer");
var saver = require("../utils/saver");

var userModelClass = require('./class/userClass.js');
const User = userModelClass.User;

var bookModelClass = require('./class/bookClass.js');
const Book = bookModelClass.Book;

var applyBook = function(req, res) {
	console.log('BookRequest 모듈 안에 있는 applyBook 호출됨.');

	var title = req.body.title || req.query.title || req.params.title;
	var author= req.body.author || req.query.author || req.params.author;
	var link= req.body.link || req.query.link || req.params.link;
	var description= req.body.description || req.query.description || req.params.description;

	var context = {
			title: '책 신청',
			bookTitle:title,
			bookAuthor:author,
			bookLink:link,
			bookDescription:description
		};
					
		req.app.render('applyBook.ejs', context, function(err, html) {
			if (err) {
				console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);
				printer.errrendering(res,err);
			    return;
			}
			res.end(html);
		});

};

var requestBook = async function(req, res) {
	console.log('BookRequest 모듈 안에 있는 refactored requestBook 호출됨.');
	var paramTitle = req.body.booktitle || req.query.booktitle;
    var paramContents = req.body.bookdescription || req.query.bookdescription;
	var paramAuthor = req.body.bookauthor || req.query.bookauthor;
	
	if(req.user){
		var GROUP = req.user.group;
		var paramWriter =req.user.email;
	}else{
		var GROUP = '111';
		var paramWriter = 'jh@naver.com';
	}

	var requestor = new User(paramWriter,req,res);
	requestor.checkAndSkipIfDatabaseNotInit(requestor.database)();
	
	try{
		var result = await requestor.findUserByEmail();
		var userObjectId = Array.isArray(result) ? result[0]._doc._id : result._id;
	
		var book = new requestor.database.AppplyBookModel({
			title: paramTitle,
			contents: paramContents,
			user: userObjectId,
			author:paramAuthor,
			group:GROUP,
		});

		var requestedBook = new databaseModel(req,res);
		requestedBook.checkAndSkipIfDatabaseNotInit(requestedBook.database)();


		var AppplyBookModelResult = await requestedBook.saveDataModel(book);//book.savePost() -> requestedBook.saveDataModel(book)

	}catch(error){
		requestor.checkAndAlertIfError(error)();
	}
	requestedBook.database.AppplyBookModel.load(AppplyBookModelResult._id, function (err, results) {
		requestedBook.checkAndAlertIfError(err)();

		var context = {
			title: '신청 완료',
			bookTitle:results._doc.title,
			bookAuthor:results._doc.author,
			bookDescription:results._doc.contents,	
		};

		printer.rendering(req,res,'applyBook.ejs',context);
	});				
};

var acceptRequest = async function(req, res) {
	console.log('BookRequest 모듈 안에 있는 acceptRequest 호출됨.');
	var paramId = req.body.id || req.query.id || req.params.id;
	var bookForAccept = new Book(paramId,req,res);
	bookForAccept.checkAndSkipIfDatabaseNotInit(bookForAccept.database)();
	
	const ACCEPTEDBOOK = '1';
	try{
		
		var option = {$set: {isAccepted : ACCEPTEDBOOK}};
		await bookForAccept.findByIdAndUpdate(bookForAccept.database.AppplyBookModel, option);
	}catch(error){
		bookForAccept.checkAndAlertIfError(error)();
	}

	res.redirect("/book/listapplybook?page=0&perPage=2"); 
};

var arriveRequest = async function(req, res) {
	console.log('BookRequest 모듈 안에 있는 arriveRequest 호출됨.');

	var paramId = req.body.id || req.query.id || req.params.id;
	var bookIfArrived = new Book(paramId,req,res);
	bookIfArrived.checkAndSkipIfDatabaseNotInit(bookIfArrived.database)();
	
	const ARRIVEDBOOK = '1';
	try{
		var option = {$set: {isArrive : ARRIVEDBOOK}};
		await bookIfArrived.findByIdAndUpdate(bookIfArrived.database.AppplyBookModel, option);
	}catch(error){
		bookForAccept.checkAndAlertIfError(error)();
	}

	res.redirect("/book/listapplybook?page=0&perPage=2"); 

};
module.exports.applyBook = applyBook;
module.exports.requestBook = requestBook;
module.exports.acceptRequest = acceptRequest;
module.exports.arriveRequest = arriveRequest;
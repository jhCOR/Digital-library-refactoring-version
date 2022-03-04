var Entities = require('html-entities').AllHtmlEntities;

const ROUTEFUNCTIONPATH = '../routeFunc';
var printer = require('../utils/printer');
var saver = require('../utils/saver');

var Borrow = require(ROUTEFUNCTIONPATH + '/borrow');
var AddReview = require(ROUTEFUNCTIONPATH + '/addReview');
var AddBook = require(ROUTEFUNCTIONPATH + '/addBook');
var ShowBook = require(ROUTEFUNCTIONPATH + '/showBook');

var databaseModelClass = require('./class/database');
const databaseModel = databaseModelClass.databaseModel;

var bookModelClass = require('./class/bookClass.js');
const Book = bookModelClass.Book;

var addbook = (req, res) => {
    console.log('book 모듈 안에 있는 addbook 호출됨.');

    AddBook.addBookFun(req, res, 'addBook');
};

var showbook = (req, res) => {
    console.log('book 모듈 안에 있는 showbook 호출됨.');
    if (req.user) ShowBook.showBookFun(req, res);
    else res.redirect('/login');
};

var borrow = function (req, res) {
    console.log('book 모듈 안에 있는 borrow 호출됨.');
    Borrow.borrowFun(req, res);
};

var addReview = function (req, res) {
    console.log('book 모듈 안에 있는 addReview 호출됨.');
    AddReview.addReviewFun(req, res);
};
var removeReview = function(req, res) {
	console.log('book 모듈 안에 있는 removeReview 호출됨.');
 	var contentId= req.body.content || req.query.content;
	var paramId= req.body.id || req.query.id;
	var reviewId=req.body.delete || req.query.delete;

	var bookForRemoveReview = new Book(reviewId,req,res);
	bookForRemoveReview.checkAndSkipIfDatabaseNotInit(bookForRemoveReview.database)();
	
	try{
		bookForRemoveReview.database.ReviewModel.load(reviewId, async function(error, results) {	         
			bookForRemoveReview.checkAndAlertIfError(error)();

			if (results) {
				results.review[paramId].remove();  
				
				const option = {$set: {review:  results.review}};
				await bookForRemoveReview.findByIdAndUpdate(bookForRemoveReview.database.ReviewModel, option);
	
				res.redirect('/book/showbook/' + contentId);
			}
		});
	}catch(error){
		bookForRemoveReview.checkAndAlertIfError(error)();
	}
}

var reservation = async function (req, res) {
    //예약신청
    console.log('book 모듈 안에 있는 reservation 호출됨.');

    var paramId = req.body.id || req.query.id || req.params.id;
    var reserve = req.user.email;
	
	var bookForReservation = new Book(paramId,req,res);
	bookForReservation.checkAndSkipIfDatabaseNotInit(bookForReservation.database)();
				
	try{
		const option = { $set: { num: '2', reservation: reserve }};
		await bookForReservation.findByIdAndUpdate(bookForReservation.database.BookModel, option);
	}catch(error){
		bookForReservation.checkAndAlertIfError(error)();
	}finally{
		res.redirect('/book/showbook/' + paramId);
	}

};

var giveBack = async function (req, res) {
    console.log('book 모듈 안에 있는 giveBack 호출됨.');

    var paramId = req.body.id || req.query.id || req.params.id;
    var user = req.user.email;

	var bookForGiveBack = new Book(paramId,req,res);
	const DATABASE = bookForGiveBack.database;
	bookForGiveBack.checkAndSkipIfDatabaseNotInit(DATABASE)();
	try{
		const option = {$set: { num: '0' }};
		await bookForGiveBack.findByIdAndUpdate(DATABASE.BookModel, option);
	}catch(error){
		bookForGiveBack.checkAndAlertIfError(error)();
	}

    DATABASE.UserModel.findOne({email:req.user.email}).populate('reservationlist', 'title author updated_at').exec(function (error, results) {
       bookForGiveBack.checkAndAlertIfError(error)();

    DATABASE.UserModel.findByIdAndUpdate(results._id, { $pull: { reservationlist: paramId } }, function (err, results2) {
		bookForGiveBack.checkAndAlertIfError(err)();
     });
   });

        res.redirect('/views/myPage');
};

var search = (req, res) => {
    console.log('book 모듈 안에 있는 search 호출됨.');
    const paramPage = req.body.page || req.query.page ;
    const search = req.body.search || req.query.search;
    const paramPerPage = 8;

	var option = { group: req.user.group, title: new RegExp(search) };
    
    const database = req.app.get('database');

    if (database.db) {
        // 1. 글 리스트
        var options = {
            page: paramPage,
            perPage: paramPerPage,
            criteria: option,
        };

        database.BookModel.searchList(options, (err, results) => {
            if (err) {
                console.error('게시판 글 목록 조회 중 에러 발생 : ' + err.stack);
                printer.errrendering(res, err);

                return;
            }

            if (results) {
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });

                var context = {
                    title: '검색',
                    posts: results,
                    page: parseInt(paramPage),
                    pageCount: Math.ceil(results.length / paramPerPage),
                    perPage: paramPerPage,
                    totalRecords: results.length,
                    size: paramPerPage,
                    searchcontext: search,
					login_success: true,
					admin:req.user.admin 
                };

                printer.rendering(req, res, page, context);
            }
        });
    }
};



var searchGroup = (req, res) => {
    console.log('book 모듈 안에 있는 searchGroup 호출됨.');
    const paramPage = req.body.page || req.query.page;
    const search = req.body.search || req.query.search;
    const paramPerPage = 8;

	var criteria = search ? {group: new RegExp(search)} : {};
	
	var allGroup = new databaseModel(req, res);
	allGroup.checkAndSkipIfDatabaseNotInit(allGroup.database)();

        var options = {
            page: paramPage,
            perPage: paramPerPage,
            criteria: option,
        };

    allGroup.database.UserModel.list(options, (error, results) => {
	allGroup.checkAndAlertIfError(error)();

		if (results) {
			var groups = [];
			var num = 0;

			for (var i = 0; i < results.length; i++) {
				if (!groups.includes(results[i]._doc.group)) {
					groups[num] = results[i]._doc.group;
					num++;
				}
			}

			if(groups.length<1){
				res.send('-');
			}else{
				res.send(groups);
			}
		}
    });
    
};

var deleteBookFun = function (req, res) {
    var paramId = req.body.id || req.query.id || req.params.id;
    var database = req.app.get('database');
	
	var BookForDelete = new databaseModel(req, res);
	BookForDelete.checkAndSkipIfDatabaseNotInit(BookForDelete.database)();

		database.BookModel.load(paramId, function(error, results) {
			BookForDelete.checkAndAlertIfError(error)();

			if (results) {
				results.remove();
				res.redirect('/book/listpost?page=0&perPage=8');
			}
        });
}; 

module.exports.addbook = addbook;
module.exports.showbook = showbook;
module.exports.borrow = borrow;
module.exports.reservation = reservation;
module.exports.addReview = addReview;
module.exports.removeReview = removeReview;
module.exports.giveBack = giveBack;
module.exports.search = search;
module.exports.searchGroup = searchGroup;
module.exports.deleteBookFun = deleteBookFun;
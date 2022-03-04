var saver = require("../utils/saver");
var printer = require("../utils/printer");

var addBookFun=(req, res)=>{

	var paramWriter;
	var paramGroup;
	
	if(req.user){
		paramWriter = req.user.email;
		paramGroup = req.user.group;
	}else{
		 paramWriter = req.body.user.email;
		 paramGroup = "111";
	}
	
	const paramContents = req.body.contents || req.query.contents;
	const paramTitle = req.body.title || req.query.title;
	const paramAuthor = req.body.author || req.query.author;
	const paramIsbn = req.body.isbn || req.query.isbn;
	const paramImg = req.body.img || req.query.img;
	const paramClass= req.body.classification || req.query.classification;
	
	var BookToAdd = new databaseModel(res,req);
	const DATABASE = BookToAdd.database;
	BookToAdd.checkAndSkipIfDatabaseNotInit(BookToAdd.database)();

		if(isTitleOrContentNULL(paramTitle,paramContents)){
			return res.redirect('/book/listpost?page=0&perPage=8'); 
		}
		
		try{

			DATABASE.UserModel.findOne({email:paramWriter}).populate('reservationlist', 'title author updated_at').exec(async function (err, results) {
				
				BookToAdd.checkAndAlertIfError(err)();

				if (isUnknownUser(results)) {
					res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
					res.write('<h2>사용자 [' + paramWriter + ']를 찾을 수 없습니다.</h2>');
					res.end();
					return;
				}
				
				var review = new DATABASE.ReviewModel({
					group:paramGroup,
					isbn:paramIsbn,
				});
				
				await BookToAdd.saveDataModel(review);

				var book = new DATABASE.BookModel({
					title: paramTitle,
					contents: paramContents,
					writer: results._doc._id,
					which : paramWriter,
					author:paramAuthor,
					num: '0',
					group:paramGroup,
					isbn:paramIsbn,
					img:paramImg,
					reviewID:review.id,
					classification:paramClass,
				});
				
				await BookToAdd.saveDataModel(book);
				return res.redirect('/book/showbook/' + book._id); 
			});
			
		}catch(error){
			BookToAdd.checkAndAlertIfError(error)();
		}
}

function isTitleOrContentNULL(paramTitle,paramContents){
	return paramTitle==null||paramContents==null;
}

function isUnknownUser(results){
	return results == undefined || results.length < 1;
}

module.exports.addBookFun = addBookFun;

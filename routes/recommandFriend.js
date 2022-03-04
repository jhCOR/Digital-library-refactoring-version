var databaseModelClass = require('./class/database');
const databaseModel = databaseModelClass.databaseModel;

var sendRecommand = async (req, res) => {
	console.log('book 모듈 안에 있는 sendRecommand 호출됨.');

	var friendEmail = req.body.friend || req.query.friend || req.params.friend;
	var recommandContent = req.body.content || req.query.content || req.params.content;
	var bookID = req.body.bookID || req.query.bookID || req.params.bookID;
	var email = req.body.request || req.query.request || req.params.request;
	
	var link;
	if(email){
		link='친구 추가 요청'
		friendEmail=email;
		recommandContent="친구 추가 요청입니다.";
	}
	var recommandModel = new databaseModel(req, res);
	recommandModel.checkAndSkipIfDatabaseNotInit(recommandModel.database)();
	
			var message = new recommandModel.database.MessageModel({
				from:req.user.email,
				to:friendEmail,
				content:recommandContent,
				bookID:bookID,
				link:link,
			});
	try{
		await recommandModel.saveDataModel(message);
	}catch(error){
		recommandModel.checkAndAlertIfError(error)();
	}

		res.send('전송 완료');

};
module.exports.sendRecommand = sendRecommand;

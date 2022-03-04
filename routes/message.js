var databaseModelClass = require('./class/database');
const databaseModel = databaseModelClass.databaseModel;

class Message extends databaseModel{
	constructor(req,res){
		super(req,res);
		this.NEW = '0';
		this.OLD = '1';
	}
}

var loadmessage = (req, res) => {
    console.log('message 모듈 안에 있는 loadmessage 호출됨.');
	
	var user = req.user.email;
	var loadMessage = new Message(req, res);
	
	loadMessage.checkAndSkipIfDatabaseNotInit(loadMessage.database)();
	loadMessage.database.MessageModel
		.find({to:user,isnew:loadMessage.NEW})
		.sort({'created_at': -1})
		.populate('bookID', 'title contents author')
		.exec(function(err, result) {
		
			loadMessage.checkAndAlertIfError(err)();
			result = result? result: "메세지 없음";
			res.send(result);			
	});
};

var readmessage = (req, res) => {
    console.log('message 모듈 안에 있는 readmessage 호출됨.');
	
	var paramID=req.body.id || req.query.id|| req.params.id;
	var readMessage = new Message(req, res);
	
	readMessage.checkAndSkipIfDatabaseNotInit(readMessage.database)();
	readMessage.database.MessageModel.findByIdAndUpdate(paramID, {$set: {isnew : readMessage.OLD , updated_at : Date.now()}}, function(err,result){
		readMessage.checkAndAlertIfError(err)();
		res.send(result);
	});
};

var deletemessage = (req, res) => {
    console.log('message 모듈 안에 있는 deletemessage 호출됨.');
	
	var paramID=req.body.id || req.query.id|| req.params.id;
	var deleteMessage = new Message(req, res);
	
	deleteMessage.checkAndSkipIfDatabaseNotInit(deleteMessage.database)();
	deleteMessage.database.MessageModel.load(paramID,function (error, result) {
		deleteMessage.checkAndAlertIfError(error)();
			
        if (result) {
        	result.remove();
        }
	});
};

module.exports.loadmessage = loadmessage;
module.exports.readmessage = readmessage;
module.exports.deletemessage = deletemessage;
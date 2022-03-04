var printer = require("../utils/printer");
var saver = require("../utils/saver");
const ROUTEFUNCTIONPATH="../routeFunc";

var databaseModelClass = require('./class/database');
const databaseModel = databaseModelClass.databaseModel;

var userModelClass = require('./class/userClass.js');
const User = userModelClass.User;

var deleteUser = function(req, res) {
	
	var paramWriter =req.user.email;
	var userForDelete = new User(paramWriter,req,res);
	
	userForDelete.checkAndSkipIfDatabaseNotInit(userForDelete.database)();

		userForDelete.database.UserModel.findOne({email:req.user.email}).populate('reservationlist', 'title author updated_at').exec(async function (error, results) {
			userForDelete.checkAndAlertIfError(error)();
			userForDelete.isUserInDatabase(results);
			userForDelete.retutnErrorMassage();

			await results.remove();
			await res.redirect('/logout');
		});
};

var modifyUser = function(req, res) {
	var paramWriter;
	var paramId;
	var changedName = req.body.idmodify || req.query.idmodify;
	
	paramWriter= req.user.email;
	paramId=  req.user._id;
	
	var userForModify = new User(paramId,req,res);
	userForModify.checkAndSkipIfDatabaseNotInit(userForModify.database)();
	
	userForModify.database.UserModel.findByIdAndUpdate(paramId,{$set: {name:changedName}}, function(error, theresult) {
		
		userForModify.checkAndAlertIfError(error)();

		req.session.passport.user.name = changedName;
        req.session.save(function() {
			userForModify.isModifyNameSuccess(error);
			userForModify.retutnErrorMassage();
        });
	});

};

var acceptAdminRequest = function(req, res) {
	console.log('user 모듈 안에 있는 acceptAdminRequest 호출됨.');
	
	var paramId = req.body.id || req.query.id || req.params.id;
	var userForAdmin = new User(paramId,req,res);

		userForAdmin.checkAndSkipIfDatabaseNotInit(userForAdmin.database)();

		userForAdmin.database.UserModel.findByIdAndUpdate(paramId,{$set: {admin : 'accepted'}}, function(error,result){
				
			userForAdmin.checkAndAlertIfError(error)();
			userForAdmin.isChangedToAdmin(result);
			userForAdmin.retutnErrorMassage();
			
		});
};


module.exports.deleteUser = deleteUser;
module.exports.modifyUser = modifyUser;
module.exports.acceptAdminRequest = acceptAdminRequest;
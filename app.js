var express = require('express')
  , http = require('http')
  , path = require('path');

// Express의 미들웨어 불러오기
var bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , static = require('serve-static')
  , errorHandler = require('errorhandler');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

// Session 미들웨어 불러오기
var expressSession = require('express-session');
 
const redis = require('redis');
const RedisStore=require('connect-redis')(expressSession);

var passport = require('passport');
var flash = require('connect-flash');
var multer=require('multer');
var config = require('./config/config');

// 모듈로 분리한 데이터베이스 파일 불러오기
var database = require('./database/database');

// 모듈로 분리한 라우팅 파일 불러오기
var route_loader = require('./routes/route_loader');
var cors=require('cors');
// 익스프레스 객체 생성
var app = express();
 
//===== 뷰 엔진 설정 =====//
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
console.log('뷰 엔진이 ejs로 설정되었습니다.');

console.log('config.server_port : %d', config.server_port);
app.set('port', process.env.PORT || 3000);
 
app.use(express.urlencoded({ extended: true }))

// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())
require('dotenv').config();
// public 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));

// cookie-parser 설정
app.use(cookieParser());
app.use(cookieParser(process.env.COOKIE_SECRET));


app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, 'uploads')
		
    },
  filename: function (req, file, callback) {

	
    var extension = path.extname(file.originalname);
	  
	  callback(null, 'profile_'+req.user._id + extension);
  }
});

var upload = multer({ 
  storage: storage,
  limits: {
  files: 2,
  fileSize: 1024 * 1024 * 1024
}
});

app.post('/user/profile_img', upload.single('photo'), (req, res) => {

	var database = req.app.get('database');
		if (database.db) {
		database.UserModel.findByIdAndUpdate(req.user._id,{$set: {profile_path : req.file.filename}}, function(err,re){
			if (err) {
                console.error('업데이트 중 에러 발생 : ' + err.stack);
                printer.errrendering(res,err);
                
                return;
			}

		});
		
		res.redirect("/profile"); 
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
});
//라우팅 정보를 읽어들여 라우팅 설정

app.use('/book', function (req, res, next) {
	if(req.body.test){
		next();
	}else{
		console.log('Request Type:', req.method);
		if(!req.isAuthenticated()){
			// res.redirect('/login');
				res.render('login.ejs', { message:'로그인 상태가 아닙니다. 로그인을 진행해 주세요.' });
		}else{
			next();
		}
	}
 
});

app.use('/profile', function (req, res, next) {

	if(!req.isAuthenticated()){
		// res.redirect('/login');
			res.render('login.ejs', { message:'로그인 상태가 아닙니다. 로그인을 진행해 주세요.' });
	}else{
		next();
	}
  
});
app.use('/addhistory', function (req, res, next) {

	if(!req.isAuthenticated()){
		// res.redirect('/login');
			res.render('login.ejs', { message:'로그인 상태가 아닙니다. 로그인을 진행해 주세요.' });
	}else{
		next();
	}
  
});
app.use('/user', function (req, res, next) {

	if(!req.isAuthenticated()){
		// res.redirect('/login');
			res.render('login.ejs', { message: '로그인 상태가 아닙니다. 로그인을 진행해 주세요.' });
	}else{
		next();
	}
	
});
app.use('/views/myPage', function (req, res, next) {

	if(!req.isAuthenticated()){
		// res.redirect('/login');
			res.render('login.ejs', { message: '로그인 상태가 아닙니다. 로그인을 진행해 주세요.' });
	}else{
		next();
	}
  
});
app.use('/post', function (req, res, next) {

	if(!req.isAuthenticated()){
		// res.redirect('/login');
			res.render('login.ejs', { message: '로그인 상태가 아닙니다. 로그인을 진행해 주세요.' });
	}else{
		next();
	}
  
 
});

var router = express.Router();
route_loader.init(app, router);
router.get('/session/set/:value', function(req, res) {
    req.session.redSession = req.params.value;
    res.send('session written in Redis successfully');
});

app.get('/session/get/', function(req, res) {
    if(req.session.redSession)
        res.send('the session value stored in Redis is: ' + req.session.redSess);
    else
        res.send("no session value stored in Redis ");
});
// 패스포트 설정
var configPassport = require('./config/passport');
configPassport(app, passport);

// 패스포트 라우팅 설정
var userPassport = require('./routes/user_passport');
userPassport(router, passport);

var naverapi = require('./routes/naverAPI');
naverapi(router, passport);

// Layout 관련 라우터 -- 2021.07.11.
var renderRouter = require('./routes/route_loader');
var router = express.Router();
route_loader.init(app, router);

//===== 404 에러 페이지 처리 =====//
var errorHandler = expressErrorHandler({
 static: {
   '404': './public/404.html'
 }
});

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );

app.use((err, req, res, next) => { // 에러 처리 부분
  console.error("E:"+err.stack); // 에러 메시지 표시
  res.status(500).send('서버 에러!'); // 500 상태 표시 후 에러 메시지 전송
});

//확인되지 않은 예외 처리 - 서버 프로세스 종료하지 않고 유지함
process.on('uncaughtException', function (err) {
	console.log('uncaughtException 발생함 : ' + err);
	console.log('서버 프로세스 종료하지 않고 유지함.');
	
	console.log(err.stack);
});


process.on('SIGTERM', function () {
    console.log("프로세스가 종료됩니다.");
    app.close();
});

app.on('close', function () {
	console.log("Express 서버 객체가 종료됩니다.");
	if (database.db) {
		database.db.close();
	}
});

// 시작된 서버 객체를 리턴받도록 합니다. 
var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));

	// 데이터베이스 초기화
	database.init(app, config);
   
});


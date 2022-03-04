const ROUTEFUNCTIONPATH = '../routeFunc';
var AddBook = require(ROUTEFUNCTIONPATH + '/addBook');
var user = require('./user.js');

var request = require('request');
describe('socket.io test', () => {

    beforeAll(() => {
	
    });

    afterAll(() => {
     
    });

	// test('addBook if user request', (done) => {

		// const options = {
		//   uri:'https://web-digitalofpages-k-atwuk.run.goorm.io/book/addbook', 
		//   method: 'POST',
		// 	 json: true,
	
		//   body: {
		// 	test:true,
		//   user:{email:"jh@naver.com"},
		//   contents:'신청한 이유',
		//   title:'신청할 책 제목',
		//   author:'신청 책 저자', 
		//   isbn:'책isbn',
		//   img:'이미지 경로',
		//   classification:'책 분류'
		//   }
			
		// }
		// request.post(options, function(err,httpResponse,body){ 
		// console.log(err)
		// 	const uri = httpResponse.headers.location;
		// console.log(httpResponse.headers.location);
		// 	var sliceAndExtractId = uri.split('/')[3];
			
			
			
		// 	if(err==null&&sliceAndExtractId!=null){
		// 		done();
		// 	}
			
			
		// })
		
		
		// });
 // test('make user administor', (done) => {

 // const options = {
 // uri:'https://web-digitalofpages-k-atwuk.run.goorm.io/user/acceptAdminRequest/6168054cf75e5b2a53f1af67', 
 // method: 'GET',
 // followRedirect :false//이게 있어야 location이 나옴
 // }

 // request.get(options, function(err,httpResponse,body){ 
 // console.log(err);

 // const uri = httpResponse.headers.location;
 // console.log(uri);
 // if(uri=='/user/requestlist?page=0&perPage=2'){
 // done();
 // }
 // })
 // });
 test('request', (done) => {
 const options = {
 uri:'https://web-digitalofpages-k-atwuk.run.goorm.io/requestBook', 
 method: 'POST',
 json: true,
 followRedirect :false,//이게 있어야 location이 나옴
 body: {
 test:true,
 booktitle:"제목",
 bookdescription:'설명',
 bookauthor:'저자',
 }
			
 }
 request.post(options, function(err,httpResponse,body){ 
 console.log(err);

 if(body){
 done();
 }
 })
		

 });

});

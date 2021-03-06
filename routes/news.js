var loadNews =async function (req, res) {
    console.log('news 모듈 안에 있는 loadNews 호출됨.');

    var paramPage = req.body.page || req.query.page;
    var paramPerPage = 8;
	var range=req.body.range || req.query.range;
    var database = req.app.get('database');
	var options;

    if (database.db) {
		
       	var ids=[]; 
		if(req.user){
			
		
			for(var i=0;i<req.user.friends.length;i++){
				ids.push({writeremail:req.user.friends[i]});
			}
				console.log(ids);
			if( req.user.group=='root_group'){
				options= {$or: [{range:"전체공개" }, { range:"그룹공개"}]};
			}else{
				if(ids.length>0){
					options= {group: req.user.group, $or: [{range:"전체공개" }, { range:"그룹공개"}], $or: ids};
				}else{
					options= {group: req.user.group, $or: [{range:"전체공개" }]};
				}
			}

			var options = {
				page: paramPage,
				perPage: paramPerPage,
				criteria: options,
			};

			database.BookPostModel.list(options, function (err, listresults) {
				if (err) {
					console.error('게시판 글 목록 조회 중 에러 발생 : ' + err.stack);
					printer.errrendering(res, err);
					return;
			}
				database.BookPostModel.find(options).count().exec(function(err, count) {
					if (listresults) {

						var context = {
							posts: listresults,
							page: parseInt(paramPage),
							pageCount: Math.ceil(count / paramPerPage),
							perPage: paramPerPage,
							totalRecords: count,
							size: paramPerPage,
						};

						res.send(context);
						
						} else {
							res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
							res.write('<h2>글 목록 조회  실패</h2>');
							res.end();
						}
					});

				});
      		}
    } else {
        printer.errrendering(res);
    }
};
module.exports.loadNews = loadNews;

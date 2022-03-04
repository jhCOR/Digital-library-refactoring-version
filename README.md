## 주요 클래스 :bell:
 - databaseModel(database.js)
    - checkAndSkipIfDatabaseNotInit : 데이터베이스가 초기화되었는지 확인. 초기화되지 않았다면 오류 표시
    - checkAndAlertIfError : 데이터 베이스 입출력시 오류 발생 감시 및 오류 내용 출력
    - saveDataModel : 데이터 테이블 저장
 - User(userClass.js)
    - retutnErrorMassage : 다양한 에러 메세지 표시 메서드
    - isUserInDatabase : 유저 필터링 시 데이터베이스에 해당 유저가 있는지 확인하는 메서드
    - isModifyNameSuccess : 데이터 항목 중 이름의 변경 감지 메서드
    - isChangedToAdmin : 데이터 항목 중 관리자 항목의 변경 감지 메서드
    - findUserByEmail : 이메일로 데이터 필터링(주로 유저 검색이 이메일로 검색하므로 클래스 메서드로 제작)

## master branch :
 - 리펙토링 버전

### Server(back-end)

 <table> 
  <td>
   <div align="center"><img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white"/><br>Node.js</div>
  </td>
  <td>
   <div align="center"> <img src="https://img.shields.io/badge/mongoDB-003545?style=for-the-badge&logo=mongoDB&logoColor=white"><br>MongoDB</div>
  </td>
  <td>
   <div align="center"> <img src="https://img.shields.io/badge/express-339933?style=for-the-badge&logo=express&logoColor=white"><br>Express</div>
  </td>
</table>

### Front-end
 <table>
  <td>
   <div align="center"><img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=HTML5&logoColor=white"/> <br>HTML5</div>
  </td>
  <td>
   <div align="center"> <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=CSS3&logoColor=white"/><br>CSS3</div>
  </td>
  <td>
   <div align="center"> <img src="https://img.shields.io/badge/ejs-4FC08D?style=for-the-badge&logo=ejs&logoColor=white"><br>ejs</div>
  </td>
   <td>
    <div align="center"> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=white"/><br>JavaScript</div>
  </td>
  <td>
   <div align="center"><img src="https://img.shields.io/badge/bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white"><br>bootstrap</div>
  </td>
  <td>
   <div align="center"><img src="https://img.shields.io/badge/vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white"><br>vue.js</div>
  </td>  
 <td>
   <div align="center"><img src="https://img.shields.io/badge/semantic-4FC08D?style=for-the-badge&logo=semantic&logoColor=white"><br>semantic</div>
  </td>
</table>



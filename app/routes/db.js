var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'quiz_db',
  port     : '3306',
  user     : 'toshwm',
  password : 'tltmxpaznlwm',
  database : 'quiz_db',
  dateStrings : 'date'
});

connection.connect((err) => {
  if (err) {
    console.error('MySQL 연결 실패:', err);
    process.exit(1);  // 연결 실패 시 종료
  }

  console.log('MySQL 연결 성공');
});

module.exports = connection;
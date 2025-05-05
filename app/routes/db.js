var mysql      = require('mysql2');
var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  port     : process.env.DB_PORT,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_DATABASE,
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

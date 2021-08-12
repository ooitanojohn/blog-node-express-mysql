//expressモジュールを使えるように設定
const express = require('express');
// mysqlモジュールを使えるように
const mysql = require('mysql');
//expressモジュールを利用しアプリケーションオブジェクトappを作成
const app = express();

// publicフォルダ読み込み(viewファイル読み込み時,publicからの相対パス)
app.use(express.static('public'));
// フォームの値を受け取るために必要な定型文
app.use(express.urlencoded({ extended: false }));

// sql接続
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'list_app'
});
// sql接続エラー時
connection.connect((err) => {
    if (err) {
        console.log('error connecting: ' + err.stack);
        return;
    }
    console.log('success');
});

//********************************************************
// ルーティング
//********************************************************
// /top画面
app.get('/', (req, res) => {
    connection.query(
        'SELECT * FROM users',
        (error, results) => {
            console.log(results);
            res.render('top.ejs');
        }
    );
});
// メモ一覧画面
app.get('/index', (req, res) => {
    connection.query(
        'SELECT * FROM items',
        (error, results) => {
            res.render('index.ejs', { items: results });
        }
    );
});
// フォーム入力画面
app.get('/new', (req, res) => {
    res.render('new.ejs');
});
// 登録処理
app.post('/create', (req, res) => {
    // 登録sql実行
    connection.query(
        'INSERT INTO items (name) VALUES (?)', // 受け取り値=?
        [req.body.itemName],
        // 1=falseReturn 2=
        (error, results) => {
            res.redirect('/index');
        }
    );
});
// 削除処理
app.post('/delete/:id', (req, res) => {
    connection.query(
        'delete from items where id = (?)',
        [req.params.id],
        (error, result) => {
            res.redirect('/index');
        })
})
//サーバーを起動したら、リクエストを3000番ポートで待ち受ける設定。
app.listen(3000);
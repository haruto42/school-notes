//Nodo.jsの準備
const express = require('express');
const app = express();
//piblicを飾り付けようファイルとして使う設定。
app.use(express.static('public'));
//ejsが入っているファイルの接続。
app.set('view engine', 'ejs');
app.set('views', './views');
//セッション(サーバーメモリー)の準備
const session = require('express-session');
//セッションの設定
app.use(session({
    secret: 'haruto8610',  // セッションの暗号化キー（適当に変えてOK）
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 } // クッキーの有効期限を1時間に設定
}));
app.use(express.json());
//MySQLの準備
const mysql = require('mysql2');
app.use(express.urlencoded({ extended: true })); // フォームデータの受け取り
// MySQL接続設定
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // 自分のMySQLユーザー
    password: '966861',// パスワード
    database: 'class_app'
});
// 接続チェック
connection.connect(err => {
    if (err) {
        console.error('MySQL接続失敗:', err);
        return;
    }
    console.log('MySQL接続成功');
});
//ポート設定
const port = 3000
//こっからプログラム！！

///reset
app.get("/",(req,res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});
///login
app.get("/login",(req,res) => {
    res.render("login")
});
app.post("/login", (req, res) => {
    const { user, pass } = req.body;
    //ターミナルに表示
    console.log('ユーザー:', user);
    console.log('パスワード:', pass);
    // SQLの判定コード
    const sql = 'SELECT * FROM users WHERE user = ? AND password = ?';
    connection.query(sql, [user, pass], (err, results) => {
        if (err) {
            console.error('クエリエラー:', err);
            return res.status(500).send('サーバーエラー');
        }
        
        if (results.length > 0) {
            console.log('ログイン成功！');
            req.session.user = user;
            res.redirect("/home"); // 認証成功→ホームへリダイレクト
        } else {
            console.log('ユーザー名またはパスワードが違います');
            res.send('ユーザー名またはパスワードが違います');
        }
    });
});
///setting
app.get("/setting",(req,res) => {
    res.render("setting")
})
app.post('/setting', (req, res) => {
    const { user, password, password1, password2 } = req.body;

    if (!user || !password || !password1 || !password2) {
        return res.send('すべての項目を入力してください');
    }

    if (password1 !== password2) {
        return res.send('新しいパスワードと確認用パスワードが一致しません');
    }

    // ユーザー名とパスワードの確認
    const sql = 'SELECT * FROM users WHERE user = ? AND password = ?';
    connection.query(sql, [req.session.user, password], (err, results) => {
        if (err) {
            console.error('データベースエラー:', err);
            return res.status(500).send('サーバーエラー');
        }

        if (results.length > 0) {
            // ユーザーが認証された場合、パスワードを変更
            const updateSql = 'UPDATE users SET user = ?, password = ? WHERE user = ?';
            connection.query(updateSql, [user, password1, req.session.user], (err, result) => {
                if (err) {
                    console.error('データベースエラー:', err);
                    return res.status(500).send('サーバーエラー');
                }
                req.session.user = user; // セッションのユーザー名を更新
                res.redirect('/home'); // 設定後、ホームページへリダイレクト
            });
        } else {
            return res.send('現在のパスワードが間違っています');
        }
    });
});
///home
app.get("/home", (req, res) => {
    if (!req.session.user) {
        //ログインしていなければ
        console.log('未ログイン！リダイレクト');
        return res.redirect('/login');
    } else {
        //ログインしていなければでなければ
        console.log('ログイン済み！ホームを表示',req.session.user);
        console.log('セッション情報:', req.session);
        //res.send("<h1>ホーム</h1>");
        res.render("home", {user:req.session.user});
    }
});
///logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});
///inquiry
app.get('/inquiry',(req,res) => {
    res.render('inquiry')
});
app.post('/inquiry',(req,res) => {
    const claim = req.body.claim;
    const user = req.session.user;
    console.log(user,claim);
    const sql = 'insert into claim (user,claim) values (?,?);'
    connection.query(sql, [user, claim], (err, results) => {
        if (err) {
            console.error('エラー:', err);
            return;
        }
        console.log('データが挿入されました:', results);
        res.redirect('/home')
    });
});

//こっからサーバー関連。

app.listen(port,() => {
    console.log(`サーバーが http://localhost:${port} で起動中！`);
});
document.getElementById("button").addEventListener("click", function() {
    let inputmessage = document.getElementById("message");  // id で textarea(メッセージ)を取得
    let message = inputmessage.value;  // 取得内容をmessageに代入
    let inputtouser = document.getElementById("touser");  // id で input(相手) を取得
    let touser = inputtouser.value;  // 取得内容をtouserに代入
    if(touser === "＠"||touser === "@"){
        const ok = confirm("全員に送信されます。本当に送信しますか？");
        if (ok) {
            // OKが押されたときの処理
            console.log(message);
            console.log(touser);
        } else {
            // キャンセルが押されたときの処理
            console.log("no")
        }   

    }else{
        console.log(message);
        console.log(touser);
    }
});
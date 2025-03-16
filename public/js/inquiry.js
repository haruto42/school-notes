document.getElementById("send").addEventListener("click", function() {
    let inputinquiry = document.getElementById("claim");  // id で textarea(クレーム)を取得
    let inquiry = inputinquiry.value;  // 取得内容をinquiryに代入
        const ok = confirm("これは本当にクレームですか？ただの悪口ではありませんか？冷静になってもう一度考え直してください。本当に送信しますか？");
        if (ok) {
            // OKが押されたときの処理
            console.log(inquiry);
        } else {
            // キャンセルが押されたときの処理
            console.log("no")
        }   
});
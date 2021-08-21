// ==UserScript==
// @name         Youkoya Charactor Utilizer
// @namespace    Youkoya Charactor Utilizer
// @version      0.2
// @description  Tools to utilize the charactor sheet page of Youkoya.
// @author       Toshihito Kudo
// @include      https://charasheet.vampire-blood.net/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// ==/UserScript==
// 0.1 initial release
// 0.2 Add charactor memo

(function() {
    'use strict';

    // ゆうやけこやけでのみ反応するスクリプト
    if ($('.breadcrumb').html().indexOf("ゆうやけこやけ") != -1){
        // ボタンを作成
        $(".maincontent").prepend(`<button id="ExtractChara" type="button">ココフォリア駒出力</button>`);
        // コピー時に出力する文字列を隠して登録
        $("#ExtractChara").after(`<p id="js-copy_note" class="copy_note">コピーできました！</p>`);
        $("#js-copy_note").css({"display": "none"});
        // ボタン押下時の処理
        $('#ExtractChara').on('click', function(){
            // パラメータ取得
            //const ShuzokuID = $("#V_shuzoku_id").val();
            const ShuzokuNAME = $("#shuzoku_name").val();
            const Henge = $("#V_NC1").val();
            const Kemono = $("#V_NC2").val();
            const Otona = $("#V_NC3").val();
            const Kodomo = $("#V_NC4").val();
            const Hushigi = $("#NP5").val();
            const Omoi = $("#NP6").val();
            const PC_NAME = $("#pc_name").val();
            const PC_AGE = $("#age").val();
            // キャラクターメモ作成
            let MEMO = "■パーソナルデータ・経歴■\\n";
            MEMO += "名前：" + PC_NAME + "\\n";
            MEMO += "正体：" + ShuzokuNAME + "\\n";
            MEMO += "年齢：" + PC_AGE + "\\n\\n■能力と弱点■\\n";
            // 特技リスト取得
            for (var r = 0; r<$("#Table_power tr th input").length; r++) {
                MEMO += "[" + $("#Table_power tr th input").slice(r).val() + "]";
                for (var i = 0; i<3; i++) {
                    if (i==0) {
                        MEMO += $("#Table_power tr td input").slice(r*4+i).val();
                    } else if (i==1) {
                        MEMO += " (" + $("#Table_power tr td input").slice(r*4+i).val() + ") :";
                    } else if (i==2) {
                        MEMO += $("#Table_power tr td input").slice(r*4+i).val() +"\\n";
                    }
                }
            }
            MEMO += "\\n■能力値■\\n";
            MEMO += "へんげ： (" + Henge + ") = 不思議な力、変化たちのこと\\n";
            MEMO += "けもの： (" + Kemono + ") = 走る、感じる、隠れる\\n";
            MEMO += "おとな： (" + Otona + ") = 機械を使う、知識、気配り\\n";
            MEMO += "こども： (" + Kodomo + ") = 遊ぶ、甘える、守ってもらう";
            // URL作成
            let CharaURL = '{"kind":"character","data":{"name":"';
            CharaURL += PC_NAME;
            CharaURL += '","memo":"' + MEMO;
            CharaURL += '","externalUrl":"' + location.href;
            CharaURL += '","status":[{"label":"夢"},'
            CharaURL += '{"label":"ふしぎ","value":' + Hushigi + '},'
            CharaURL += '{"label":"想い","value":' + Omoi + '}]}}'
            // テキストエリアの作成
            const $textarea = $('<textarea></textarea>');
            // テキストエリアに文章を挿入
            $textarea.text(CharaURL);
            //　テキストエリアを挿入
            $(this).append($textarea);
            //　テキストエリアを選択
            $textarea.select();
            // コピー
            document.execCommand('copy');
            // テキストエリアの削除
            $textarea.remove();
            // アラート文の表示
            $('#js-copy_note').show().delay(2000).fadeOut(400);
        });
    }
})();

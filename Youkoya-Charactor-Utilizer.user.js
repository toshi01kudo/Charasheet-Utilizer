// ==UserScript==
// @name         Youkoya Charactor Utilizer
// @namespace    Youkoya Charactor Utilizer
// @version      0.1
// @description  Tools to utilize the charactor sheet page of Youkoya.
// @author       Toshihito Kudo
// @include      https://charasheet.vampire-blood.net/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// ==/UserScript==

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
            //const ShuzokuNAME = $("#shuzoku_name").val();
            //const Henge = $("#V_NC1").val();
            //const Kemono = $("#V_NC2").val();
            //const Otona = $("#V_NC3").val();
            //const Kodomo = $("#V_NC4").val();
            const Hushigi = $("#NP5").val();
            const Omoi = $("#NP6").val();
            const PC_NAME = $("#pc_name").val();
            // URL作成
            let CharaURL = '{"kind":"character","data":{"name":"';
            CharaURL += PC_NAME;
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

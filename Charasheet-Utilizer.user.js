// ==UserScript==
// @name         Charasheet-Utilizer
// @namespace    Charasheet-Utilizer
// @version      1.4
// @description  Tools to utilize the character sheet at Character Hokanjo.
// @author       Toshihito Kudo
// @match        https://charasheet.vampire-blood.net/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// ==/UserScript==
// 1.0 Add optional characters
// 1.1 Rename the file name to apply various system.
// 1.2 Apply constructor.
// 1.3 Add Furusato komichi.
// 1.4 Modify skills descriptions.

(function() {
    'use strict';

    // ゆうやけこやけでのみ反応するスクリプト
    if ($('.breadcrumb').html().indexOf("ゆうやけこやけ") != -1){
        //// ココフォリア駒出力機能 ////
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
            for (let r = 0; r<$("#Table_power tr th input").length; r++) {
                MEMO += "[" + $("#Table_power tr th input").slice(r).val() + "]";
                for (let i = 0; i<3; i++) {
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

        //// 種族追加 ////

        // 追加種族の基本特技
        const henge_const = [
            {
                'ID': 8,
                'name': '道怪',
                'skills': [
                    ["やみよ", 4, "夜のみ。この場面が終わるまで、闇の中ではへんげ+2","38"],
                    ["ばったり", 6, "「道を歩いている」相手さえいれば、登場していない場面でも登場できる。必ずびっくりさせたかどうかを判定する","38"],
                    ["おくりあし", 6, "場面が変わるまで道怪が見えなくなる。道怪自身も相手に触れたり追いついたりできない。追いかけられている相手は、おとなが0になる","38"],
                    ["まよいみち", 10, "夜か夕方のみ使用可能。場面が変わるか望んで解除するまで、相手を夜道に迷わせ、目的の場所に着けなくする。人数分のふしぎを支払えば複数相手に使用可能","38"],
                    ["かくれざと", 12, "もののけの里「隠れ里」へ入る。選んだ誰とでも同意なしに一緒に行ける。抵抗するなら、道怪の【へんげ】と相手の任意の能力値で判定。もののけは隠れ里を自由に出入りできるが、人はもののけと一緒でないと出入りできない","38"],
                    ["みちおくり", 12, "つながりのある相手（好きな人数）へ、明かりや音で進むべき道を教える。ただし、町の外などに行った場合、戻ってくるにはまた、この ［特技］を使わなくてはいけません。","38"]
                ]
            },
            {
                'ID': 9,
                'name': '鬼',
                'skills': [
                    ["ちからもち", 0, "力の強さで判定時に【けもの】が2倍。ただし、【想い】で増やした分は2倍にならない","44"],
                    ["かみなり", 8, "同じ場面にいる鬼以外の全員は、おとなが4以上ないと悲嗚をあげて逃げだす","44"],
                    ["かなぼう", 8, "場面が変わるまで大きくて重い鬼の金棒を手の中に作る。人間の姿に化けた時には、この金棒はパット、竹刀、杖、払い串などの棒型の道具に変えられる","44"],
                    ["かくれざと", 12, "もののけの里「隠れ里」へ入る。選んだ誰とでも同意なしに一緒に行ける。抵抗するなら、【へんげ】で対象の任意の能力値で対決。もののけは隠れ里を自由に出入りできるが、人はもののけと一緒でないと出入りできない","44"],
                    ["おにうつし", 10, "他のもののけが使った ［特技］をまねて使います。同じ［場面］で他のもののけが使った ［特技］をそっくりそのまま、この ［特技］で使うことができます。ただし、判定に使う能力値や［つながり］ などの条件は鬼自身のものを使います。","44"],
                    ["ひゃっきやこう", 30, "町中のもののけたちを呼んで大行列を作ります。行列は［場面］が変わるまで続き、参加している全てのもののけは、 ［特技］を全て半分の ［ふしぎ］で使うことができます。 ただし、この［特技］ は夜の［場面］にしか使えません。 この ［特技】は、兎の 〈もちつき〉 など、他のキャラクターに ［ふしぎ］や ［想い］を分け与える効果のある ［特技］とは同時に使えません。","44"]
                ]
            },
            {
                'ID': 10,
                'name': '河童',
                'skills': [
                    ["うおことば", 0, "町の川や池に住んでいる生き物と自由に会話できる。また、河童が傷つけない根り、彼らも河童を傷つけない。ただし、たまたま外からやってきた魚などは対象外","50"],
                    ["およぎ", 2, "場面が変わるまで水の中を自由に泳げる。河童自身の2倍までの大きさのものなら持って泳げる。また、水辺で逃げたり、ものを探したりする時に能力値+2","50"],
                    ["つかまえる", 4, "長く伸びる手や舌で、離れた相手や物を捕らえる。手が本来の2倍の長さがあるものとして扱う。また、この ［特技］で突然捕らえられると、たとえもののけでも［びっくり］させられる （河童の【へんげ】で判定）","50"],
                    ["いきつぎ", 8, "つながりを持った人間や仲間の変化に使用し、対象は場面が終わるまで想いかふしぎ2点を代償におよぎを使用できる","50"],
                    ["かくれざと", 12, "もののけの里「隠れ里」へ入る。選んだ誰とでも同意なしに一緒に行ける。抵抗するなら、【へんげ】で対象の任意の能力値で対決。もののけは隠れ里を自由に出入りできるが、人はもののけと一緒でないと出入りできない","50"],
                    ["みずのみち", 16, "町の中で河童が浸かれるくらいの水がある場所ならどこにでも、水から水へと瞬間的に移動する。同じ場面にいるつながりのある相手を同意があれば好きなだけ連れて行ける","50"]
                ]
            },
            {
                'ID': 11,
                'name': '幽霊',
                'skills': [
                    ["ふわふわ", 4, "場面が変わるまでゆっくりと空を飛べる。物を探す際などに能力値+2","56"],
                    ["かべぬけ", 4, "まったく隙問のない場所にでも出入りできる","56"],
                    ["ことことかたかた", 4, "人の手で作られた品物を、幽霊のけもので動かせるならいくつでも、動かしたり浮かせたりする。初めてこの様子を見た相手は、能力値4で［びっくり］する","56"],
                    ["すがたうつし", 8, "写真やテレビに姿を映す。テレビやビデオの中では自由に動ける。また、2 倍のコストを支払えば、望む相手に電話をかけられる","56"],
                    ["おもいのいと", 6, "つながりを持った相手がいる場所へ登場できる","56"],
                    ["とりつき", 6, "場面が変わるか望んで解除するまで、つながりを持った相手以外の目には見えなくなる。ただし、幽霊より［へんげ］の高い相手なら、そこに幽霊がいることに気づく","56"]
                ]
            },
            {
                'ID': 12,
                'name': 'マレビト',
                'skills': [
                    ["であい", 0, "［出会い］で、強さ 2 の ［つながり］を与えられる","62"],
                    ["ただいま", 6, "語り手に相手とのいきさつを伝えることが条件。町に5 年以上住んでいる初対面の相手 1 人と以前に出会っていたことにして、［出会い］で相手と結ぶ［つながり］を+1","62"],
                    ["そらのみち", 8, "足での移動と同じスピードで空中を歩ける。特に何かから逃げる時には、能力値を+3。マレビトと手をつないでいる相手（最大2人）にも作用する","62"],
                    ["どこかとおく", 8, "町の中と町の外の間を一瞬で移動する。町の中の間は行けない。同じ場面にいるつながりを持つ相手も一緒に移動できる","62"],
                    ["ごめんなさい", 8, "ちゃんと謝ることが条件。致命的な出来第でない限り、ほとんどのいさかいや失敗を謝ることで、許してもらえる","62"],
                    ["さようなら", 24, "セッション最後の［場面］でのみ使用可能。町中からマレビトがいた記憶を消して、最初から町に来なかったことにする。【こども】と【つながり】の強さを足した数値がマレビトの【へんげ】より低い町の全員が、マレビトのことを忘れる。町の住人全員とマレビトが 10 点の［夢］を受け取る","62"]
                ]
            },
            {
                'ID': 13,
                'name': '付喪神',
                'skills': [
                    ["がらくた", 0, "正体のままでも誰も気にしない。ただし、正体の道具として不自然な動き方や音声を発しない場合のみ","68"],
                    ["つかわれるもの", 3, "道具として使われることで、他の誰かを助ける。自身の ［おとな］を、そのキャラクターの能力値に加算できる。判定するキャラクター自身の【想い】と重ねて使用可能","68"],
                    ["どうぐがたり", 6, "品物がかつてどう使われていたか、素性を知る。持ち主などもわかる","68"],
                    ["うせものさがし", "8～", "品物を見つける。品物に関する情報の詳しさで、支払う【ふしぎ】が変わる。その品物を写した画像など、かなり詳しい情報があれば8 点、漠然とした噂だと、12点以上。具体的な数字は語り手が決定","68"],
                    ["きざし", 16, "PCが何もしなかった場合に起こる未来について、 PLから語り手に質問できる","68"],
                    ["ふしぎのしな", 0, "［すごいふしぎ］に使う【ふしぎ】または【想い】のいずれかを、2 倍として数えて加算できる","68"]
                ]
            },
            {
                'ID': 14,
                'name': '蜘蛛',
                'skills': [
                    ["くものこ", 4, "場面が変わるまで、ちいさな普通の蜘蛛に化ける。姿を見られても［びっくり］されない。また、隠れたりする時には［けもの］を+2", "80"],
                    ["たどりいと", 4, "セッション終了まで、相手の衣服などに糸をつけておき、離れていてもその言動や居場所がわかる", "80"],
                    ["うけあみ", 6, "場面が変わるまで網を空中に張り巡らせる。網は人2 人の重さを支えることができる", "80"],
                    ["さだめ", 10, "1セッションで1回のみ。同じ［場面］で誰かが判定した際、判定の成功や失敗、その結果の程度を、望み通りに決められる", "80"],
                    ["がんじがらめ", 8, "相手を糸で絡めとり 、逃げられないようにする。【へんげ】が相手の【けもの】を上回れば、相手は【けもの】を使うような行動ができない。ただし、【特技】は［場面］から退場するもの以外は使える", "80"],
                    ["くものす", 20, "町のあらゆる場所とつながった不思議な場所「蜘蛛の巣」に出入りする。「蜘蛛の巣」は蜘蛛と、蜘蛛が ［つながり］を持つ者のみ出入り可能。その［場面］の場所を 「蜘蛛の巣」に変える。どんな［特技］を使っても、外から中の様子を覗いたり、勝手に入ったりはできない", "80"]
                ]
            },
            {
                'ID': 15,
                'name': '蛇',
                'skills': [
                    ["こあくま", 0, "異性のキャラクター（語り手が許可するなら同性も）との［出会い］で相手からの ［つながり］を+1。また、相手の持つ ［つながり］の内容は蛇が決められる。", "84"],
                    ["うつろい", 4, "場面が変わるか、再度〈うつろい〉を使うまで、一瞬で蛇自身の人間の姿における外見年齢を自由に変える", "84"],
                    ["まきつき", 6, "場面が変わるまで、へんげで対象のけものと対決し、蛇のいる場所から動くことができなくする", "84"],
                    ["へびあな", 10, "場面の途中でも関係なく、好きな時間と場所に登場したり、退場したりできる。たとえ同じ時問に別の［場面］で違うことをしていたとしても、かまいません", "84"],
                    ["ときのらせん", 20, "へんげで対決し、相手の過去の出来事や知識の全てを続み取れる。ただし、読み取ったことは他に伝えられない（知った上での行動は取れる）", "84"],
                    ["すなどけい", 20, "場面が変わるか、再度〈すなどけい〉を使うまで、相手の体の年齢を相手の望むもの変える", "84"]
                ]
            },
            {
                'ID': 16,
                'name': '百足',
                'skills': [
                    ["はいのぼり", 0, "壁や天井を普通の地面のように歩ける。よほど滑りやすい場所でなければ、けもので判定する必要がない", "88"],
                    ["げじげじ", 4, "場面が変わるまで、ちいさな普通のムカデに化ける。姿を見られても［びっくり］されない。また、隠れたりする時には［けもの］を+2", "88"],
                    ["すきまぬけ", 4, "わずかな隙間から、いろいろな場所に出入りできる", "88"],
                    ["からみつき", 8, "けもので対象のおとなと対決。相手は言葉を話す以外は動くことができない", "88"],
                    ["わきわき", 8, "へんげで対象のおとなと対決し、状況に関係なく相手を大声で笑わせる。目に見える範囲の相手になら自由に使える", "88"],
                    ["わけみ", 10, "同時に二つの［場面］に存在できる。すでに処理した［場面］で知ったことは、もう一方のムカデも知っている", "88"]
                ]
            },
            {
                'ID': 17,
                'name': '木霊',
                'skills': [
                    ["やまびこ", 2, "声や森の物音をまねできる。見破るには、【へんげ】で対決", "92"],
                    ["もりのこえ", 12, "森の中のあらゆる情報や噂を集める。情報が常に正しいとは限らない", "92"],
                    ["しずく", 2, "1セッションに1回のみ、朝・昼のみ使用可能。朝露や蜜を、相手に与え、木霊が支払った【ふしぎ】の2 倍の【想い】を得る", "92"],
                    ["ぐるぐる", 8, "へんげで対象のけものと対決し、「正体」、「化けた姿」のいずれかから根などを伸ばし、離れた相手を捕まえられる。相手は［けもの］を使う行動はできない。ただし、【特技】は［場面］から退場する効果があるもの以外、使える", "92"],
                    ["ゆったり", 6, "びっくりしたり喧嘩に負けた相手を落ち着かせる。人数分の［ふしぎ］を支払えば、複数の相手にも同時に使える", "92"],
                    ["このはみち", 10, "同じ種類の植物がいるところなら、町の中のどこにでも、一瞬で姿を現せる。〈おおきなき〉の場合、現れた場所にいる同じ種類の植物を、［場面］終了まで「正体」として扱える。同じ［場面］の［つながり］のある相手を、同意があれば好きなだけ連れていける", "92"]
                ]
            },
            {
                'ID': 18,
                'name': '狼',
                'skills': [
                    ["なわばり", 0, "「なわばり」では必要なふしぎが半分（切り上げ）で、特技を使用可能。※「なわばり」は 1 つの町の外に 1 箇所のみ。最初に語り手と相談", "96"],
                    ["まもりがみ", 6, "場面あたり1回まで。場面が変わるまで、（自分を含めた）対象を指定し、その対象に対し、隠れて覗いたり、後をつけてたり 、【特技】を使ってきたりした相手を、何の判定もなく見破る。【特技】の内容もわかる", "96"],
                    ["のがくれ", 6, "草がそれなりに茂っていることが条件。茂みや草むら等に、完全に隠れる。隠れた狼を見つけるには、へんげで対決し、3より多く上回る必要あり。ただし、山や森では、その土地の土地神様には簡単に見破られる", "96"],
                    ["みがわり", 8, "誰かが何か危険な目に合いそうなとき身代わりになる。当然ダメージは受ける。使用時に登場していなくても構わない", "96"],
                    ["とおぼえ", 20, "1セッションに1回のみ。もののけを含む町の住人すぺてに対し、びっくりさせる。朝～昼なら ［けもの］、夕方なら「けもの+ 1」、夜なら 「けもの+ 2 」。ただし、気絶しない。もし、狼がこの【特技】で町にあまりにも迷惑をかけた場合、語り手は「町からの ［つながり］」を減らしてもよい", "96"],
                    ["けものよび", 30, "町中の動物たちを呼び寄せる", "96"]
                ]
            },
            {
                'ID': 19,
                'name': '亀',
                'skills': [
                    ["うおことば", 0, "町の川や池に住んでいる生き物と自由に会話できる。また、河童が傷つけない根り、彼らも河童を傷つけない。ただし、たまたま外からやってきた魚などは対象外", "102"],
                    ["およぎ", 2, "場面が変わるまで水の中を自由に泳げる。河童自身の2倍までの大きさのものなら持って泳げる。また、水辺で逃げたり、ものを探したりする時に能力値+2", "102"],
                    ["いきつぎ", 8, "つながりを持った人間や仲間の変化に使用し、対象は場面が終わるまで想いかふしぎ2点を代償におよぎを使用できる", "102"],
                    ["かくれざと", 12, "もののけの里「隠れ里」へ入る。選んだ誰とでも同意なしに一緒に行ける。抵抗するなら、道怪の【へんげ】と相手の任意の能力値で判定。もののけは隠れ里を自由に出入りできるが、人はもののけと一緒でないと出入りできない", "102"],
                    ["ときのらせん", 20, "へんげで対決し、相手の過去の出来事や知識の全てを続み取れる。ただし、読み取ったことは他に伝えられない（知った上での行動は取れる）", "102"],
                    ["すなどけい", 20, "場面が変わるか、再度〈すなどけい〉を使うまで、相手の体の年齢を相手の望むもの変える", "102"]
                ]
            },
            {
                'ID': 20,
                'name': '鶴',
                'skills': [
                    ["つばさ", 2, "翼が出ている時のみ使用可能。場面が変わるまで自身より小さいものを持って空を飛べる。また逃げるときや物を探すときに使うことで能力値+2", "106"],
                    ["つばさをあげる", 8, "つながりを持った人間や仲間の変化に使用し、対象は場面が終わるまで想いかふしぎ２点を代償につばさを使用できる", "106"],
                    ["はねまくら", 12, "翼を出している時、物語ごとに１回使用可能。対象から自身へのつながりを+1", "106"],
                    ["しらせばね", 4, "セッション終了まで、相手の衣服などに自分の羽根をつけておき、離れていてもその言動や居場所がわかる", "106"],
                    ["おおきなつばさ", 6, "場面が変わるまで、人2人の重さを翼で支えることができる", "106"],
                    ["さだめ", 10, "1セッションで1回のみ。同じ［場面］で誰かが判定した際、判定の成功や失敗、その結果の程度を、望み通りに決められる", "106"]
                ]
            },
            {
                'ID': 21,
                'name': '石霊',
                'skills': [
                    ["ふるいわ", 6, "[出会い]で相手と結ぶ【つながり】を2強くできる。ただし、1セッションに1回だけ", "38"],
                    ["ずっしり", 8, "体を岩のようにできる。ただし、自分からは一歩も動けない", "38"],
                    ["えんむすび", 4, "相手から石霊への【つながり】を1弱める代わりに、同じ[場面]に出ている誰か別の相手への【つながり】を1強めることができる", "38"],
                    ["へっちゃら", 0, "びっくりしても平然と見せられる。ただし、石霊のことをよく見ていた相手は【おとな】で判定しあって、【びっくり】していると見破るかもしれない", "38"],
                    ["すってんころり", 6, "【へんげ】で相手を上回ると相手を転ばすことができる。ケガはしない", "38"],
                    ["かなめいし", 20, "土地の鎮守として、災害から町を守る。[場面]が変わるまで続く", "38"]
                ]
            },
            {
                'ID': 22,
                'name': '天狗',
                'skills': [
                    ["こあくま", 0, "異性のキャラクター（語り手が許可するなら同性も）との［出会い］で相手からの ［つながり］を+1。また、相手の持つ ［つながり］の内容は蛇が決められる", "42"],
                    ["つばさ", 2, "空を飛べる。自身より小さいものなら持って飛べる。逃げたり、ものを探したりするときに能力値を2増やせる。ただし、完全な人間の時には使えない", "42"],
                    ["はねうちわ", 4, "風を思うままに吹かせる。強い風も出せるが、重い物は動かせない", "42"],
                    ["そらきだおし", 6, "声や森の物音をまねできる。見破るには【へんげ】で対決。へんげで対象の任意の能力値と対決し、轟音で[びっくり]させることもできる", "42"],
                    ["まっくら", 12, "辺りを夜のように暗くし、夜として扱う。【こども】が3以上の人は、【こども】以外の能力値を0とする（もののけは影響なし）。[場面]が終わるまで続く。鬱蒼と木が茂るところでのみ使える", "42"],
                    ["かみかくし", 16, "もののけの里「隠れ里」へ入る。選んだ誰とでも同意なしに一緒に行ける。抵抗するなら、【へんげ】で対象の任意の能力値で対決。もののけは隠れ里を自由に出入りできるが、人はもののけと一緒でないと出入りできない", "42"]
                ]
            },
            {
                'ID': 23,
                'name': '龍',
                'skills': [
                    ["あまかける", 2, "完全な人間の時には使用不可。場面が変わるまで自身より小さいものを持って空を飛べる。また逃げるときや物を探すときに使うことで能力値+2", "46"],
                    ["にじいろのうろこ", 8, "人間に特別な鱗を送る。自身と仲間の【特技】を1つ鱗に込めて、人間も使えるようにする", "46"],
                    ["おひさま", 4, "どんな場所でも太陽の光が差し込み、その場を照らす。ただし、夜は使えない", "46"],
                    ["にわかあめ", 20, "突然空が雲で覆われて、場面が変わるまで土砂降りの雨を降らせる", "46"],
                    ["みずのかみ", 24, "場面が変わるまで水の流れを操る。水をなくすことはできない", "46"],
                    ["りゅうじん", 24, "体長15m以上の巨大な龍に変身する。【けもの】と【へんげ】が10増える。ただし、町からの【つながり】が1減る", "46"]
                ]
            },
            {
                'ID': 24,
                'name': '牛',
                'skills': [
                    ["べこ", 0, "動物状態で人間に見られても不審がられたりびっくりされたりしない", "50"],
                    ["ちからもち", 0, "力の強さで判定時に【けもの】が2倍。ただし、【想い】で増やした分は2倍にならない", "50"],
                    ["ちからしごと", 2, "人間の力仕事の手伝いができる。人間の誰かが【けもの】で判定時に、牛の【けもの】を足せる", "50"],
                    ["なでなで", 6, "対象に撫でてもらうことが条件。対象からのつながりの強さと同じ数の想いを得る", "50"],
                    ["だいじょうぶ", 6, "びっくりしたり喧嘩に負けた相手を元気づける", "50"],
                    ["みがわり", 8, "誰かが何か危険な目に合いそうなとき身代わりになる。当然ダメージは受ける。使用時に登場していなくても構わない", "50"]
                ]
            },
            {
                'ID': 25,
                'name': '氏神様',
                'skills': [
                    ["おやしろ", 0, "セッションが終わるまで1万円分の「本物のお金」持っている", "56"],
                    ["おつげ", 6, "同じ[場面]で寝ている相手に夢を見させ、正夢と信じさせる。氏神様の【へんげ】と相手の【おとな】を比べて高ければ、行動に影響を与える", "56"],
                    ["ふわふわ", 4, "浮遊するようにゆっくり空を飛ぶ。ものを探す際などに能力値を2増やす", "56"],
                    ["ごりやく", "1～", "氏神様が支払った【ふしぎ】と同じだけ相手は【想い】を得る。人数分の【ふしぎ】を払えば、複数名対象でも可。氏神様の住む町にいるキャラクターのみ", "56"],
                    ["やすらぎ", 6, "相手を安心させる。[びっくり]やケンカで負けたキャラクターを元気づけて、その状態から開放する", "56"],
                    ["まもりがみ", 0, "町で生まれ育った人（獣やもののけは含まない）との[出会い]で、強さ2で相手への【つながり】を持てる", "56"]
                ]
            }
        ]
        // プルダウン項目の文章作成
        let optgroup_text = ''
        for (let t = 0; t<henge_const.length; t++) {
            if (t == 0) {
                optgroup_text += `<optgroup label="よいやみこみち">`;
            } else if (henge_const[t].ID == 21) {
                optgroup_text += `<optgroup label="ふるさとこみち">`;
            }
            optgroup_text += '<option value="' + henge_const[t].ID +'">'+henge_const[t].name+'</option>';
            if (henge_const[t].ID == 20) {
                optgroup_text += `</optgroup>`;
            } else if (henge_const[t].ID == 25) {
                optgroup_text += `</optgroup>`;
            }
        }
        // プルダウン追加
        $("#shuzoku_id optgroup").after(optgroup_text);
        // 特技リスト変更
        //セレクトボックスが切り替わったら発動
        $('select#shuzoku_id').change(function() {
            if ($("#V_shuzoku_id").val() >= 8) {
                // 種族IDが一致した項目を取得
                let match_henge = henge_const.find(element => element.ID == $("#V_shuzoku_id").val());
                // 自由入力の正体名に裏で入力することで、ココフォリアボタン用に値を出力
                $("#shuzoku_name").val(match_henge.name);
                // 特技を自動入力
                for (let r = 0; r<6; r++) {
                    for (let i = 0; i<4; i++) {
                        $("#Table_power tr td input").slice(r*4+i,r*4+i+1).val(match_henge.skills[r][i]);
                    }
                }
            }
        });
    }
})();

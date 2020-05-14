var document = document,
  ability_list = {
    "common": {"dousatsu": ["洞察", "{ADP}"], "sneaking": ["スニーキング", "{ADP}"],
               "chikeijunnou": ["地形順応", "{ADP}"], "bunseki": ["分析", "{ADP}"],
               "hayawaza": ["早業", "{AGI}"], "kikenyochi": ["危険予知", "{AGI}"],
               "hobaku": ["捕縛", "{AGI}"], "kaihi": ["回避", "{AGI}"],
               "kirokujyutsu": ["記録術", "{TEC}"], "mekiki": ["目利き", "{TEC}"],
               "kikaikousaku": ["機械工作", "{TEC}"], "iryou": ["医療", "{TEC}"],
               "soujyuu": ["操縦", "{FOR}"], "knockout": ["ノックアウト", "{FOR}"],
               "toppa": ["突破", "{FOR}"], "kinsetsukougeki": ["近接攻撃", "{FOR}"],
               "taijyutsu": ["体術", "{STL}"], "glider": ["グライダー", "{STL}"],
               "kakuran": ["撹乱", "{STL}"], "enkyorikougeki": ["遠距離攻撃", "{STL}"],
               "dennou": ["電脳", "{CRF}"], "iikurume": ["言いくるめ", "{CRF}"],
               "kaidoku": ["解読", "{CRF}"], "ryakudatsu": ["略奪", "{CRF}"]},
    "phantom": {"hensou": ["変装", "{ADP}"], "hengenjizai": ["変幻自在", "{ADP}"],
                "gitai": ["擬態", "{ADP}"], "chouyaku": ["跳躍", "{STL}"],
                "wireaction": ["ワイヤーアクション", "(({ADP}+{STL})/2)"], "decoy": ["デコイ", "(({ADP}+{STL})/2)"]},
    "ghost": {"inpei": ["隠蔽", "{TEC}"], "shunsoku": ["瞬足", "{AGI}"],
              "onmitsu": ["隠密", "{AGI}"], "yamidobari": ["闇帳", "{TEC}"],
              "yuureiaruki": ["幽霊歩き", "(({AGI}+{TEC})/2)"], "sippuukyaku": ["疾風脚", "(({AGI}+{TEC})/2)"]},
    "magic": {"komadukai": ["小間使い", "{TEC}"], "swap": ["スワップ", "{CRF}"],
              "illusion": ["イリュージョン", "(({TEC}+{CRF})/2)"], "mimic": ["ミミック", "{TEC}"],
              "shadow": ["シャドウ", "(({TEC}+{CRF})/2)"], "speedcontrol": ["スピードコントロール", "(({TEC}+{CRF})/2)"]},
    "jack": {"iatsu": ["威圧", "{FOR}"], "mikiri": ["見切り", "(({FOR}+{ADP})/2)"],
             "kenjyutsu": ["剣術", "{(({FOR}+{ADP})/2)}"], "uchikowashi": ["打ち壊し", "{FOR}"],
             "issen": ["一閃", "{ADP}"], "smash": ["スマッシュ", "{FOR}"]},
    "comet": {"speedgun": ["スピードガン", "{AGI}"], "flipjump": ["フリップジャンプ", "{STL}"],
              "quickstep": ["クイックステップ", "{STL}"], "rengeki": ["連撃", "(({STL}+{AGI})/2)"],
              "nichoujyuu": ["二丁銃", "(({STL}+{AGI})/2)"], "hakugeki": ["迫撃", "(({STL}+{AGI})/2)"]},
    "spider": {"gizou": ["偽造", "{CRF}"], "sliptrap": ["スリップトラップ", "(({CRF}+{FOR})/2)"],
               "saiminjyutsu": ["催眠術", "{FOR}"], "captureweb": ["キャプチャーウェブ", "(({CRF}+{FOR})/2)"],
               "kanpa": ["看破", "{CRF}"], "thunderbolt": ["サンダーボルト", "(({CRF}+{FOR})/2)"]}
  };

function setDefaultStatus() {
  var status = {
      "phantom": [5, 10, 6, 4, 6, 8, 6],
      "ghost": [4, 6, 10, 8, 4, 7, 6],
      "magic": [5, 6, 4, 10, 6, 6, 8],
      "jack": [6, 8, 6, 5, 10, 6, 4],
      "comet": [5, 4, 8, 6, 7, 10, 5],
      "spider": [5, 6, 5, 7, 8, 4, 10]
    },
    phantomism_list = Object.keys(status),
    phantomism = document.getElementById("phantomism").value,
    index = 0;
  if (phantomism !== "") {
    document.getElementById("default_vit").value = status[phantomism][0];
    document.getElementById("default_adp").value = status[phantomism][1];
    document.getElementById("default_agi").value = status[phantomism][2];
    document.getElementById("default_tec").value = status[phantomism][3];
    document.getElementById("default_for").value = status[phantomism][4];
    document.getElementById("default_stl").value = status[phantomism][5];
    document.getElementById("default_crf").value = status[phantomism][6];
  } else {
    document.getElementById("default_vit").value = 0;
    document.getElementById("default_adp").value = 0;
    document.getElementById("default_agi").value = 0;
    document.getElementById("default_tec").value = 0;
    document.getElementById("default_for").value = 0;
    document.getElementById("default_stl").value = 0;
    document.getElementById("default_crf").value = 0;
  }
  calcStatus();
  // 特化技能の表示、非表示
  for (index = 0; index < 6; index++) {
    if (phantomism === phantomism_list[index]) {
      document.getElementsByClassName(phantomism_list[index])[0].classList.remove("hidden");
    } else {
      document.getElementsByClassName(phantomism_list[index])[0].classList.add("hidden");
    }
  }
}

function calcStatus() {
  // [VIT, ADP, AGI, TEC, FOR, STL, CRF]
  var defaults = [document.getElementById("default_vit").value,
                  document.getElementById("default_adp").value,
                  document.getElementById("default_agi").value,
                  document.getElementById("default_tec").value,
                  document.getElementById("default_for").value,
                  document.getElementById("default_stl").value,
                  document.getElementById("default_crf").value],

    adds = [document.getElementById("add_vit"),
            document.getElementById("add_adp"),
            document.getElementById("add_agi"),
            document.getElementById("add_tec"),
            document.getElementById("add_for"),
            document.getElementById("add_stl"),
            document.getElementById("add_crf")],

    sums = [document.getElementById("sum_vit"),
            document.getElementById("sum_adp"),
            document.getElementById("sum_agi"),
            document.getElementById("sum_tec"),
            document.getElementById("sum_for"),
            document.getElementById("sum_stl"),
            document.getElementById("sum_crf")],
    index = 0,
    alladds = 0,
    point_left = 20,
    temp;

  // 追加分のバリデーション 
  for (index = 0; index < 7; index++) {
    alladds += parseInt(adds[index].value);
    if (adds[index].value < 0) {
      adds[index].style.backgroundColor = "#fcc";
    } else {
      adds[index].style.backgroundColor = "#fff";
    }
  }

  // 残りの追加値を計算
  point_left -= alladds;
  document.getElementById("point_left").textContent = "残り " + point_left;
  if (point_left < 0) {
    document.getElementById("point_left").style.color = "#f00";
  } else {
    document.getElementById("point_left").style.color = "#000";
  }

  // 合計値計算
  for (index = 0; index < 7; index++) {
    temp = parseInt(defaults[index]) + parseInt(adds[index].value);
    if (index === 0 && temp > 10) {
      sums[index].style.backgroundColor = "#fcc";
    } else if (temp > 18) {
      sums[index].style.backgroundColor = "#fcc";
    } else {
      sums[index].style.backgroundColor = "#fff";
    }
    sums[index].value = temp;
  }
}

function makeCharacterXML() {
  var adds = [document.getElementById("add_vit"),
            document.getElementById("add_adp"),
            document.getElementById("add_agi"),
            document.getElementById("add_tec"),
            document.getElementById("add_for"),
            document.getElementById("add_stl"),
            document.getElementById("add_crf")],
    sums = [document.getElementById("sum_vit"),
            document.getElementById("sum_adp"),
            document.getElementById("sum_agi"),
            document.getElementById("sum_tec"),
            document.getElementById("sum_for"),
            document.getElementById("sum_stl"),
            document.getElementById("sum_crf")],
    phantomism = document.getElementById("phantomism").value,
    index = 0,
    alladds = 0,
    abilities = {},
    temp_list,
    msg = "";

  if (phantomism === "") {
    msg += "PHANTOMISMを選択してください。<br />";
  }
  // パラメータチェック 20点割り振っているか
  for (index = 0; index < 7; index++) {
    alladds += parseInt(adds[index].value);
    if (adds[index].value < 0) {
      msg += "ステータスの追加分にマイナスのものがあります。<br />";
    }
  }
  for (index = 0; index < 7; index++) {
    if (index === 0 && sums[index].value > 10) {
      msg += "VITの合計値は10を超えてはいけません。<br />";
    } else if (sums[index].value > 18) {
      msg += "ステータスの合計値は18を超えてはいけません。<br />";
    }
  }
  if (alladds > 20) {
    msg += "ステータスの追加値が多すぎます。<br />";
  } else if (alladds < 20) {
    msg += "ステータスの追加値が少なすぎます。<br />";
  }

  // 技能7つ取ってるか
  temp_list = Object.keys(ability_list["common"]);
  for (index = 0; index < 24; index++) {
    if (document.getElementById(temp_list[index]).checked) {
      abilities[temp_list[index]] = ability_list["common"][temp_list[index]];
    }
  }

  if (phantomism !== "") {
    temp_list = Object.keys(ability_list[phantomism]);
    for (index = 0; index < 6; index++) {
      if (document.getElementById(temp_list[index]).checked) {
        abilities[temp_list[index]] = ability_list[phantomism][temp_list[index]];
      }
    }
  }
  if (Object.keys(abilities).length > 7) {
    msg += "習得技能が多すぎます。通常攻撃を除いて7つまでです。<br />";
  } else if (Object.keys(abilities).length < 7) {
    msg += "習得技能が少なすぎます。通常攻撃を除いて7つ取得してください。<br />";
  }

  // 技能の成長にマイナスがないか
  for (index = 0; index < Object.keys(abilities).length; index++) {
    if (document.getElementById(Object.keys(abilities)[index] + "_grow").value < 0) {
      msg += "技能の成長がマイナスの所があります。<br />";
    }
  }

  // データ生成前のチェック
  if (msg !== "") {
    document.getElementById("message").innerHTML = msg;
  } else {
    document.getElementById("message").innerHTML = "";
    alert("キャラクターデータOK.");
    // TODO XML生成処理
  }
}

var document = document,
  patternString = /"|'|<|>|&/g,
  // phantomism_ability_dict ... ファントミズム->技能ID->[技能名, チャットパレット, 使用タイミング]
  phantomism_ability_dict = {
    "common": {"dousatsu": ["洞察", ["ADP"], "調査"], "sneaking": ["スニーキング", ["ADP"], "調査"],
               "chikeijyunnou": ["地形順応", ["ADP"], "調査"], "bunseki": ["分析", ["ADP"], "チェス"],
               "mighty" : ["マイティ", ["ADP"], "チェス,例外"],
               "hayawaza": ["早業", ["AGI"], "調査"], "kikenyochi": ["危険予知", ["AGI"], "調査"],
               "hobaku": ["捕縛", ["AGI"], "調査,チェス,攻撃"], "kaihi": ["回避", ["AGI"], "チェス,例外"],
               "moonstep": ["ムーンステップ", ["AGI"], "チェス,移動前"],
               "kirokujyutsu": ["記録術", ["TEC"], "調査"], "mekiki": ["目利き", ["TEC"], "調査,チェス"],
               "kikaikousaku": ["機械工作", ["TEC"], "調査"], "iryou": ["医療", ["TEC"], "チェス"],
               "venom": ["ベノム", ["TEC"], "チェス"],
               "soujyuu": ["操縦", ["FOR"], "調査"], "knockout": ["ノックアウト", ["FOR"], "調査,チェス,攻撃"],
               "toppa": ["突破", ["FOR"], "調査"], "kinsetsukougeki": ["近接攻撃", ["FOR"], "チェス,攻撃"],
               "survive": ["サバイブ", ["FOR"], "チェス,例外"],
               "taijyutsu": ["体術", ["STL"], "調査"], "glider": ["グライダー", ["STL"], "調査,チェス,例外"],
               "kakuran": ["撹乱", ["STL"], "調査"], "enkyorikougeki": ["遠距離攻撃", ["STL"], "チェス,攻撃"],
               "flashgun": ["フラッシュガン", ["STL"], "チェス"],
               "dennou": ["電脳", ["CRF"], "調査"], "iikurume": ["言いくるめ", ["CRF"], "調査"],
               "kaidoku": ["解読", ["CRF"], "調査"], "ryakudatsu": ["略奪", ["CRF"], "チェス"],
               "tactician": ["タクティシャン", ["CRF"], "チェス,移動前"]},
    "phantom": {"hensou": ["変装", ["ADP"], "調査"], "hengenjizai": ["変幻自在", ["ADP"], "チェス"],
                "gitai": ["擬態", ["ADP"], "調査,チェス"], "chouyaku": ["跳躍", ["STL"], "チェス,例外"],
                "wireaction": ["ワイヤーアクション", ["ADP","STL"], "調査,チェス,例外"], "decoy": ["デコイ", ["ADP","STL"], "チェス"]},
    "ghost": {"inpei": ["隠蔽", ["TEC"], "調査"], "shunsoku": ["瞬足", ["AGI"], "チェス,移動前,例外"],
              "onmitsu": ["隠密", ["AGI"], "調査,チェス,移動前"], "yamitobari": ["闇帳", ["TEC"], "チェス,移動前"],
              "yuureiaruki": ["幽霊歩き", ["AGI","TEC"], "チェス,移動前,例外"], "sippuukyaku": ["疾風脚", ["AGI","TEC"], "チェス,攻撃"]},
    "magic": {"komadukai": ["小間使い", ["TEC"], "調査"], "swap": ["スワップ", ["CRF"], "チェス"],
              "illusion": ["イリュージョン", ["TEC","CRF"], "調査"], "mimic": ["ミミック", ["TEC"], "チェス"],
              "shadow": ["シャドウ", ["TEC","CRF"], "チェス,移動前,例外"], "speedcontrol": ["スピードコントロール", ["TEC","CRF"], "チェス,例外"]},
    "jack": {"iatsu": ["威圧", ["FOR"], "調査"], "mikiri": ["見切り", ["FOR","ADP"], "チェス,攻撃,例外"],
             "kenjyutsu": ["剣術", ["FOR","ADP"], "チェス,攻撃"], "uchikowashi": ["打ち壊し", ["FOR"], "チェス"],
             "issen": ["一閃", ["ADP"], "チェス,攻撃"], "smash": ["スマッシュ", ["FOR"], "チェス,攻撃"]},
    "comet": {"speedgun": ["スピードガン", ["AGI"], "調査,チェス"], "flipjump": ["フリップジャンプ", ["STL"], "チェス,移動前,例外"],
              "quickstep": ["クイックステップ", ["STL"], "チェス,例外"], "rengeki": ["連撃", ["STL","AGI"], "チェス,攻撃,例外"],
              "nichoujyuu": ["二丁銃", ["STL","AGI"], "チェス,攻撃"], "hakugeki": ["迫撃", ["STL","AGI"], "チェス,攻撃,例外"]},
    "spider": {"gizou": ["偽造", ["CRF"], "調査"], "sliptrap": ["スリップトラップ", ["CRF","FOR"], "チェス"],
               "saiminjyutsu": ["催眠術", ["FOR"], "調査"], "captureweb": ["キャプチャーウェブ", ["CRF","FOR"], "チェス"],
               "kanpa": ["看破", ["CRF"], "調査,チェス"], "thunderbolt": ["サンダーボルト", ["CRF","FOR"], "チェス"]},
    "retro": {"yokokujyou" : ["予告状", ["STL","TEC"], "調査"], "miryou" : ["魅了", ["STL"], "調査"],
              "balloon" : ["バルーン", ["STL","TEC"], "調査,チェス,移動前,例外"], "ropeandhook": ["ロープ&amp;フック", ["STL","TEC"], "チェス,移動後,例外"],
              "spotlight" : ["スポットライト", ["STL"], "チェス"], "timebomb" : ["タイムボム", ["TEC"], "チェス"]},
    "ayakashi" : {"ayakashinokai" : ["アヤカシの怪", ["ADP"], "チェス"], "yotaka" : ["ヘンゲ：夜鷹", ["ADP","TEC"], "調査"],
                  "karasutengu" : ["ヘンゲ：烏天狗", ["ADP","AGI"], "チェス,移動後,例外"],
                  "hakujya" : ["ヘンゲ：白蛇", ["ADP","STL"], "チェス,攻撃"],
                  "nue" : ["ヘンゲ：鵺", ["ADP","FOR"], "チェス"],
                 "kyuubi": ["ヘンゲ：九尾", ["ADP","CRF"], "チェス,移動前,例外"]},
    "gamble" : {"thrillaction" : ["スリルアクション", ["CRF","TEC"], "調査,チェス,例外"],
                "wanderer" : ["ワンダラー", ["CRF","FOR"], "調査,チェス"],
                "ikasama" : ["イカサマ", ["CRF"], "チェス,例外"], "trickshot" : ["トリックショット", ["TEC"], "チェス"],
                "doubleedgesword" : ["ダブルエッジソード", ["FOR"], "チェス"], "kirihuda" : ["切り札", ["CRF"], "チェス,例外"]}
  },
  ability_id_dict = {
        "洞察" : "dousatsu", "スニーキング" : "sneaking", "地形順応" : "chikeijyunnou", "分析" : "bunseki", "マイティ" : "mighty",
        "早業" : "hayawaza", "危険予知" : "kikenyochi", "捕縛" : "hobaku", "回避" : "kaihi", "ムーンステップ" : "moonstep",
        "記録術" : "kirokujyutsu", "目利き" : "mekiki", "機械工作" : "kikaikousaku", "医療" : "iryou", "ベノム" : "venom",
        "操縦" : "soujyuu", "ノックアウト" : "knockout", "突破" : "toppa", "近接攻撃" : "kinsetsukougeki", "サバイブ": "survive",
        "体術" : "taijyutsu", "グライダー" : "glider", "撹乱" : "kakuran", "遠距離攻撃" : "enkyorikougeki", "フラッシュガン" : "flashgun",
        "電脳" : "dennou", "言いくるめ" : "iikurume", "解読" : "kaidoku", "略奪" : "ryakudatsu", "タクティシャン" : "tactician",
          "変装" : "hensou", "変幻自在" : "hengenjizai", "擬態" : "gitai",
          "跳躍" : "chouyaku", "ワイヤーアクション" : "wireaction", "デコイ" : "decoy",
          "隠蔽" : "inpei", "瞬足" : "shunsoku", "隠密" : "onmitsu",
          "闇帳" : "yamitobari", "幽霊歩き" : "yuureiaruki", "疾風脚" : "sippuukyaku",
          "小間使い" : "komadukai", "スワップ" : "swap", "イリュージョン" : "illusion",
          "ミミック" : "mimic", "シャドウ" : "shadow", "スピードコントロール" : "speedcontrol",
          "威圧" : "iatsu", "見切り" : "mikiri", "剣術" : "kenjyutsu",
          "打ち壊し" : "uchikowashi", "一閃" : "issen", "スマッシュ" : "smash",
          "スピードガン" : "speedgun", "フリップジャンプ" : "flipjump", "クイックステップ" : "quickstep",
          "連撃" : "rengeki", "二丁銃" : "nichoujyuu", "迫撃" : "hakugeki",
          "偽造" : "gizou", "スリップトラップ" : "sliptrap", "催眠術" : "saiminjyutsu",
          "キャプチャーウェブ" : "captureweb", "看破" : "kanpa", "サンダーボルト" : "thunderbolt",
          "予告状" : "yokokujyou", "魅了" : "miryou", "バルーン" : "balloon",
          "ロープ&amp;フック" : "ropeandhook", "ロープ&フック": "ropeandhook" ,"スポットライト" : "spotlight", "タイムボム" : "timebomb",
          "アヤカシの怪" : "ayakashinokai", "ヘンゲ：夜鷹" : "yotaka", "ヘンゲ：九尾" : "kyuubi",
          "ヘンゲ：烏天狗" : "karasutengu", "ヘンゲ：鵺" : "nue", "ヘンゲ：白蛇" : "hakujya",
          "スリルアクション" : "thrillaction", "ワンダラー" : "wanderer", "イカサマ" : "ikasama",
          "トリックショット" : "trickshot", "ダブルエッジソード" : "doubleedgesword", "切り札": "kirihuda"
    };

// Utitlity
function escapeString() {
  if (arguments[0] === "\"") {
    return "&quot;";
  } else if (arguments[0] === "\'") {
    return "&apos;";
  } else if (arguments[0] === "<") {
    return "&lt;";
  } else if (arguments[0] === ">") {
    return "&gt;";
  } else if (arguments[0] === "&") {
    return "&amp;";
  }
}

function clearAllInput() {
  var abilist = Object.keys(phantomism_ability_dict),
      temp_abilist,
      index, subindex;

  document.getElementById("character_name").value = "";
  document.getElementById("veteran").checked = false;
  document.getElementById("character_age").value = "";
  document.getElementById("character_gender").value = "";
  document.getElementById("character_home").value = "";
  document.getElementById("character_job").value = "";
  document.getElementById("character_honor").value = "";
  document.getElementById("phantomism").value = "";

  document.getElementById("memo").innerHTML = "";

  document.getElementById("add_vit").value = 0
  document.getElementById("default_vit").value = 0;
  document.getElementById("add_adp").value = 0;
  document.getElementById("default_adp").value = 0;
  document.getElementById("add_agi").value = 0;
  document.getElementById("default_agi").value = 0;
  document.getElementById("add_tec").value = 0;
  document.getElementById("default_tec").value = 0;
  document.getElementById("add_for").value = 0;
  document.getElementById("default_for").value = 0;
  document.getElementById("add_stl").value = 0;
  document.getElementById("default_stl").value = 0;
  document.getElementById("add_crf").value = 0;
  document.getElementById("default_crf").value = 0;
  calcStatus();

  for(index = 0 ; index < abilist.length; index++) {
    temp_abilist = Object.keys(phantomism_ability_dict[abilist[index]]);
    for(subindex = 0; subindex < temp_abilist.length; subindex++) {
      document.getElementById(temp_abilist[subindex]).checked = false;
      document.getElementById(temp_abilist[subindex]+"_grow").value = "";
    }
  }
}

function clearAbilities(){
  var abilist = Object.keys(phantomism_ability_dict),
      temp_abilist,
      index, subindex;

  for(index = 0 ; index < abilist.length; index++) {
    temp_abilist = Object.keys(phantomism_ability_dict[abilist[index]]);
    for(subindex = 0; subindex < temp_abilist.length; subindex++) {
      document.getElementById(temp_abilist[subindex]).checked = false;
      document.getElementById(temp_abilist[subindex]+"_grow").value = "";
    }
  }
}

function calcJudgeValue(status_dict, judge_status_list){
  var judge_value = 0;
  judge_status_list.forEach(function(status){
    judge_value += parseInt(status_dict[status]);
  });
  return Math.floor(judge_value / judge_status_list.length);
}

// Handler
function uploadCharacter(inputElem) {
  var file,
      reader,
      parser,
      xml;

  file = inputElem.files[0];
  reader = new FileReader();
  parser = new DOMParser();

  reader.onload = function() {
    xml = parser.parseFromString(reader.result, "text/xml");
    try {
      setUploadedData(xml);
    } catch (e) {
      alert("ファイルの形式が不正か、ファイルが壊れています。");
      console.log(e);
    }

  }

  reader.readAsText(file);
}

function setUploadedData(xml) {
  var possible_abilities = 7,
      honor_and_veteran,
      index;

  // 初期化
  clearAllInput();

  // 基本情報
  document.getElementById("character_name").value = xml.getElementsByName("name")[0].innerHTML;
  document.getElementById("character_age").value = xml.getElementsByName("Age")[0].innerHTML;
  document.getElementById("character_gender").value = xml.getElementsByName("Gender")[0].innerHTML;
  document.getElementById("character_home").value = xml.getElementsByName("Home")[0].innerHTML;
  document.getElementById("character_job").value = xml.getElementsByName("Job")[0].innerHTML;
  if(xml.getElementsByName("Honor")[0]){
    honor_and_veteran = xml.getElementsByName("Honor")[0].innerHTML;
    document.getElementById("veteran").checked = (honor_and_veteran.lastIndexOf("V") != -1) ? true : false;
    document.getElementById("character_honor").value = honor_and_veteran.replace(/[^0-9]/g, "");;
  }
  document.getElementById("phantomism").value = xml.getElementsByName("PHANTOMISM")[0].innerHTML.toLowerCase();
  setDefaultStatus();
  document.getElementById("memo").innerHTML = xml.getElementsByName("メモ")[0].innerHTML;

  // ステータス
  document.getElementById("add_vit").value = parseInt(xml.getElementsByName("VIT")[0].innerHTML) - document.getElementById("default_vit").value;
  document.getElementById("add_adp").value = parseInt(xml.getElementsByName("ADP")[0].innerHTML) - document.getElementById("default_adp").value;
  document.getElementById("add_agi").value = parseInt(xml.getElementsByName("AGI")[0].innerHTML) - document.getElementById("default_agi").value;
  document.getElementById("add_tec").value = parseInt(xml.getElementsByName("TEC")[0].innerHTML) - document.getElementById("default_tec").value;
  document.getElementById("add_for").value = parseInt(xml.getElementsByName("FOR")[0].innerHTML) - document.getElementById("default_for").value;
  document.getElementById("add_stl").value = parseInt(xml.getElementsByName("STL")[0].innerHTML) - document.getElementById("default_stl").value;
  document.getElementById("add_crf").value = parseInt(xml.getElementsByName("CRF")[0].innerHTML) - document.getElementById("default_crf").value;
  calcStatus();

  // 技能
  for(index = 1; index < possible_abilities+1; index++){
    document.getElementById(ability_id_dict[xml.getElementsByName("技能")[0].children[index].innerHTML.match(/[^+]+/)[0]]).checked = true;
  }

  // 成長
  if(!xml.getElementsByName("成長")[0]) return;
  for(index = 0 ; index < xml.getElementsByName("成長")[0].children.length; index++) {
    document.getElementById(ability_id_dict[xml.getElementsByName("成長")[0].children[index].getAttribute("name")] + "_grow").value = xml.getElementsByName("成長")[0].children[index].innerHTML.match(/\d+/)[0];
  }

  showLearnedAbilities();
}

function setVeteran() {
  var adds = [document.getElementById("add_vit"),
            document.getElementById("add_adp"),
            document.getElementById("add_agi"),
            document.getElementById("add_tec"),
            document.getElementById("add_for"),
            document.getElementById("add_stl"),
            document.getElementById("add_crf")],
      phantomism = document.getElementById("phantomism").value,
      max_point = (phantomism === "liberal") ? 25 : 20,
      veteran = document.getElementById("veteran"),
      max_additional = (veteran.checked) ? 5: 0,
      alladds = 0,
      index, point_left;

  for (index = 0; index < adds.length; index++) {
    alladds += parseInt(adds[index].value);
  }

  point_left = max_point + max_additional - alladds

  if (isNaN(point_left)) {
    document.getElementById("point_left").textContent = "空欄があります";
  } else if (point_left > 0 && max_additional >= point_left ){
    document.getElementById("point_left").textContent = "残り " + point_left + "まで";
  } else {
    document.getElementById("point_left").textContent = "残り " + point_left;
  }
  if (isNaN(point_left) || point_left < 0) {
    document.getElementById("point_left").style.color = "#f00";
  } else {
    document.getElementById("point_left").style.color = "#000";
  }
}

function checkHonor() {
  var honor = document.getElementById("character_honor");

  if(honor.value < 0 || (honor.value !="" && isNaN(honor.value))){
    honor.style.backgroundColor = "#fcc";
  } else {
    honor.style.backgroundColor = "#fff";
  }
}

function setDefaultStatus() {
  var status = {
      "phantom": [5, 10, 6, 4, 6, 8, 6],
      "ghost": [4, 6, 10, 8, 4, 7, 6],
      "magic": [5, 6, 4, 10, 6, 6, 8],
      "jack": [6, 8, 6, 5, 10, 6, 4],
      "comet": [5, 4, 8, 6, 7, 10, 5],
      "spider": [5, 6, 5, 7, 8, 4, 10],
      "retro": [5, 4, 7, 10, 4, 10, 5],
      "ayakashi": [5, 10, 6, 6, 6, 6, 6],
      "gamble": [4, 4, 6, 8, 8, 5, 10],
      "liberal": [4, 6, 6, 6, 6, 6, 6]
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
  // 特化技能の表示、非表示
  if(phantomism === "liberal") {
    for (index = 0; index < phantomism_list.length-1; index++) {
       document.getElementsByClassName(phantomism_list[index])[0].classList.remove("hidden");
    }
    document.getElementById("sample_type").classList.remove("hidden");
  } else {
    for (index = 0; index < phantomism_list.length-1; index++) {
      if (phantomism === phantomism_list[index]) {
        document.getElementsByClassName(phantomism_list[index])[0].classList.remove("hidden");
      } else {
        document.getElementsByClassName(phantomism_list[index])[0].classList.add("hidden");
      }
    }
    document.getElementById("sample_type").classList.add("hidden");
  }
  calcStatus();
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
    phantomism = document.getElementById("phantomism").value,
    veteran = document.getElementById("veteran"),
    max_point = (phantomism === "liberal") ? 25 : 20,
    max_additional = (veteran.checked) ? 5: 0,
    point_left, temp;

  // 追加分のバリデーション 
  for (index = 0; index < adds.length; index++) {
    alladds += parseInt(adds[index].value);
    if (adds[index].value < 0 || adds[index].value === "") {
      adds[index].style.backgroundColor = "#fcc";
    } else {
      adds[index].style.backgroundColor = "#fff";
    }
  }

  // 残りの追加値を計算
  point_left = max_point + max_additional - alladds;
  if (isNaN(point_left)) {
    document.getElementById("point_left").textContent = "空欄があります";
  } else if (point_left > 0 && max_additional >= point_left ){
    document.getElementById("point_left").textContent = "残り " + point_left + "まで";
  } else {
    document.getElementById("point_left").textContent = "残り " + point_left;
  }
  if (isNaN(point_left) || point_left < 0) {
    document.getElementById("point_left").style.color = "#f00";
  } else {
    document.getElementById("point_left").style.color = "#000";
  }

  // 合計値計算
  for (index = 0; index < defaults.length; index++) {
    temp = parseInt(defaults[index]) + parseInt(adds[index].value);
    if (isNaN(temp) || (index === 0 && temp > 10)) {
      sums[index].style.backgroundColor = "#fcc";
    } else if (temp > 18 || (phantomism === "liberal" && temp > 14)) {
      sums[index].style.backgroundColor = "#fcc";
    } else {
      sums[index].style.backgroundColor = "#fff";
    }
    sums[index].value = temp;
  }
  showLearnedAbilities();
}

function setSampleCharacter() {
  var sample_data = {
    // adds, abilities
    "phantom": {"adds": [2, 8, 0, 0, 0, 10, 0],
                "abilities": ["dousatsu", "sneaking", "kakuran", "gitai", "enkyorikougeki", "wireaction", "decoy"]},
    "ghost": {"adds": [0, 0, 8, 6, 0, 0, 6],
              "abilities": ["hayawaza", "hobaku", "kikaikousaku", "kaihi", "onmitsu", "shunsoku", "yuureiaruki"]},
    "magic": {"adds": [3, 0, 0, 6, 3, 0, 8],
              "abilities": ["kirokujyutsu", "mekiki", "iikurume", "swap", "komadukai", "mimic", "speedcontrol"]},
    "jack": {"adds": [0, 6, 6, 0, 8, 0, 0],
             "abilities": ["sneaking", "chikeijyunnou", "knockout", "toppa", "kenjyutsu", "mikiri", "smash"]},
    "comet": {"adds": [2, 0, 10, 0, 0, 8, 0],
              "abilities": ["taijyutsu", "kaihi", "kinsetsukougeki", "nichoujyuu", "quickstep", "rengeki", "hakugeki"]},
    "spider": {"adds": [0, 8, 0, 0, 6, 0, 6],
               "abilities": ["dousatsu", "dennou", "bunseki", "gizou", "saiminjyutsu", "sliptrap", "captureweb"]},
    "retro": {"adds": [1, 0, 7, 6, 0, 6, 0],
               "abilities": ["kikaikousaku", "glider", "kaihi", "flashgun", "yokokujyou", "ropeandhook", "spotlight"]},
    "ayakashi": {"adds": [2, 8, 0, 10, 0, 0, 0],
               "abilities": ["dousatsu", "chikeijyunnou", "bunseki", "iryou", "ayakashinokai", "yotaka", "nue"]},
    "gamble": {"adds": [0, 0, 2, 6, 6, 0, 6],
               "abilities": ["dennou", "knockout", "survive", "thrillaction", "ikasama", "trickshot", "kirihuda"]},
    "liberal_stealth": {"adds": [1, 0, 8, 8, 0, 0, 8],
               "abilities": ["komadukai", "kirokujyutsu", "iikurume", "onmitsu", "yuureiaruki", "speedcontrol", "thrillaction"]},
    "liberal_combat": {"adds": [3, 8, 6, 0, 0, 8, 0],
               "abilities": ["sneaking", "mighty", "wireaction", "issen", "rengeki", "miryou", "hakujya"]},
    "liberal_support": {"adds": [1, 0, 0, 8, 8, 0, 8],
               "abilities": ["kirokujyutsu", "tactician", "saiminjyutsu", "illusion", "swap", "captureweb", "ikasama"]},
  },
    adds = [document.getElementById("add_vit"),
            document.getElementById("add_adp"),
            document.getElementById("add_agi"),
            document.getElementById("add_tec"),
            document.getElementById("add_for"),
            document.getElementById("add_stl"),
            document.getElementById("add_crf")],
    phantomism = document.getElementById("phantomism").value,
    index = 0, temp_list, sample_character;

  if (phantomism === "") {
    alert("PHANTOMISMを選択してください！");
    return;
  }
  clearAbilities();
  sample_character = (phantomism === "liberal") ? (phantomism + "_" + document.getElementById("sample_type").value) : phantomism;
  for (index = 0; index < adds.length; index++) {
    adds[index].value = sample_data[sample_character]["adds"][index];
  }
  if(phantomism === "liberal"){
    Object.keys(phantomism_ability_dict).forEach(function(element){
      temp_list = Object.keys(phantomism_ability_dict[element]);
      for (index = 0; index < temp_list.length; index++) {
        if (sample_data[sample_character]["abilities"].includes(temp_list[index])) {
          document.getElementById(temp_list[index]).checked = true;
        } else {
          document.getElementById(temp_list[index]).checked = false;
        }
      }
    });
  } else {
    temp_list = Object.keys(phantomism_ability_dict["common"]);
    for (index = 0; index < temp_list.length; index++) {
      if (sample_data[sample_character]["abilities"].includes(temp_list[index])) {
        document.getElementById(temp_list[index]).checked = true;
      } else {
        document.getElementById(temp_list[index]).checked = false;
      }
    }
    temp_list = Object.keys(phantomism_ability_dict[phantomism]);
    for(index = 0; index < temp_list.length; index++) {
      if (sample_data[phantomism]["abilities"].includes(temp_list[index])) {
        document.getElementById(temp_list[index]).checked = true;
      } else {
        document.getElementById(temp_list[index]).checked = false;
      }
    }
  }
  calcStatus();
}

function showLearnedAbilities(){
  var status_dict = {"ADP" : document.getElementById("sum_adp").value,
                     "AGI" : document.getElementById("sum_agi").value,
                     "TEC" : document.getElementById("sum_tec").value, 
                     "FOR" : document.getElementById("sum_for").value, 
                     "STL" : document.getElementById("sum_stl").value, 
                     "CRF" : document.getElementById("sum_crf").value},
      phantomism = document.getElementById("phantomism").value,
      phantomism_list,
      ability_keys,
      learned_ability, // [技能名, チャットパレット, 使用タイミング]
      growth, 
      judge_value,
      index, subindex;

  document.getElementById("learned_abilities").innerHTML = "";

  // 共通技能のチェック
  ability_keys = Object.keys(phantomism_ability_dict["common"]);
  for (index = 0; index < ability_keys.length; index++) {
    if (document.getElementById(ability_keys[index]).checked) {
      learned_ability = phantomism_ability_dict["common"][ability_keys[index]];
      growth = document.getElementById(ability_keys[index]+"_grow").value;
      judge_value = calcJudgeValue(status_dict, learned_ability[1]);
      judge_value = (typeof growth === "undefined" || isNaN(growth) || growth <= 0) ? Math.min(18, judge_value) : Math.min(18, judge_value + parseInt(growth));
      document.getElementById("learned_abilities").innerHTML += "【" + learned_ability[0] + "】: " + judge_value + "\n";
    }
  }
  // 特化技能のチェック
  if (phantomism !== "" && phantomism !== "liberal") {
    ability_keys = Object.keys(phantomism_ability_dict[phantomism]);
    for (index = 0; index < ability_keys.length; index++) {
      if (document.getElementById(ability_keys[index]).checked) {
        learned_ability = phantomism_ability_dict[phantomism][ability_keys[index]];
        growth = document.getElementById(ability_keys[index]+"_grow").value;
        judge_value = calcJudgeValue(status_dict, learned_ability[1]);
        judge_value = (typeof growth === "undefined" || isNaN(growth) || growth <= 0) ? Math.min(18, judge_value) : Math.min(18, judge_value + parseInt(growth));
        document.getElementById("learned_abilities").innerHTML += "【" + learned_ability[0] + "】: " + judge_value + "\n";
      }
    }
  } else if (phantomism === "liberal") {
    phantomism_list = Object.keys(phantomism_ability_dict);
    phantomism_list.shift();
    for(index = 0; index < phantomism_list.length; index++){
      ability_keys = Object.keys(phantomism_ability_dict[phantomism_list[index]]);
      // 各 Phantomismについて
      for(subindex = 0; subindex < ability_keys.length; subindex++){
        if (document.getElementById(ability_keys[subindex]).checked) {
          learned_ability = phantomism_ability_dict[phantomism_list[index]][ability_keys[subindex]];
          growth = document.getElementById(ability_keys[subindex]+"_grow").value;
          judge_value = calcJudgeValue(status_dict, learned_ability[1]);
          judge_value = (typeof growth === "undefined" || isNaN(growth) || growth <= 0) ? Math.min(18, judge_value) : Math.min(18, judge_value + parseInt(growth));
          document.getElementById("learned_abilities").innerHTML += "【" + learned_ability[0] + "】: " + judge_value + "\n";
        }
      }
    }
  }
}


function check_and_make_Character() {
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
    veteran = document.getElementById("veteran"),
    honor = document.getElementById("character_honor").value,
    index = 0,
    subindex = 0,
    alladds = 0,
    max_additional = (veteran.checked) ? 5 : 0,
    addpoints = (phantomism === "liberal") ? 25 : 20,
    abilities = {},
    growths = {},
    abkey_list,
    phantomism_list,
    special_learned,
    limit_liberal = 2,
    msg = "";

  if (phantomism === "") {
    msg += "PHANTOMISMを選択してください。<br />";
  }

  // 名声がマイナスでないか
  if (honor < 0){
    msg += "名声はマイナスになりません。<br />";
  }

  // パラメータチェック 20点(リベラルは25点)割り振っているか
  for (index = 0; index < adds.length; index++) {
    alladds += parseInt(adds[index].value);
    if (adds[index].value < 0) {
      msg += "ステータスの追加分にマイナスのものがあります。<br />";
    }
  }
  for (index = 0; index < sums.length; index++) {
    if (index === 0 && sums[index].value > 10) {
      msg += "VITの合計値は10を超えてはいけません。<br />";
    } else if (phantomism === "liberal") {
      if (sums[index].value > 14) {
        msg += "リベラルではステータスの合計値は14を超えてはいけません。<br />";
      }
    } else {
      if (sums[index].value > 18) {
        msg += "ステータスの合計値は18を超えてはいけません。<br />";
      }
    }
  }
  if (alladds > addpoints + max_additional) {
    msg += "ステータスの追加値が多すぎます。<br />";
  } else if (alladds < addpoints) {
    msg += "ステータスの追加値が少なすぎます。<br />";
  }

  // 技能7つ取っているか
  // 一般技能
  abkey_list = Object.keys(phantomism_ability_dict["common"]);
  for (index = 0; index < abkey_list.length; index++) {
    if (document.getElementById(abkey_list[index]).checked) {
      abilities[abkey_list[index]] = phantomism_ability_dict["common"][abkey_list[index]];
    }
    if (document.getElementById(abkey_list[index]+"_grow").value > 0) {
      growths[abkey_list[index]] =
        [phantomism_ability_dict["common"][abkey_list[index]][0],
        parseInt(document.getElementById(abkey_list[index]+"_grow").value) ];
    } else if(document.getElementById(abkey_list[index]+"_grow").value < 0) {
      msg += "成長がマイナスの一般技能があります。<br />"
    }
  }

  // 特化技能
  if (phantomism !== "" && phantomism !== "liberal") {
    abkey_list = Object.keys(phantomism_ability_dict[phantomism]);
    for (index = 0; index < abkey_list.length; index++) {
      if (document.getElementById(abkey_list[index]).checked) {
        abilities[abkey_list[index]] = phantomism_ability_dict[phantomism][abkey_list[index]];
      }
      if (document.getElementById(abkey_list[index]+"_grow").value > 0) {
        // growths = {"技能ID" : ["技能名", 成長値]}
        growths[abkey_list[index]] =
        [phantomism_ability_dict[phantomism][abkey_list[index]][0],
        parseInt(document.getElementById(abkey_list[index]+"_grow").value) ];
      } else if(document.getElementById(abkey_list[index]+"_grow").value < 0) {
        msg += "成長がマイナスの特化技能があります。<br />"
      }
    }
  } else if (phantomism === "liberal") {
    phantomism_list = Object.keys(phantomism_ability_dict);
    phantomism_list.shift();
    for(index = 0; index < phantomism_list.length; index++){
      special_learned = 0;
      abkey_list = Object.keys(phantomism_ability_dict[phantomism_list[index]]);
      // 各 Phantomismについて
      for(subindex = 0; subindex < abkey_list.length; subindex++){
        if (document.getElementById(abkey_list[subindex]).checked) {
          abilities[abkey_list[subindex]] = phantomism_ability_dict[phantomism_list[index]][abkey_list[subindex]];
          special_learned++;
        }
        if (document.getElementById(abkey_list[subindex]+"_grow").value > 0) {
          growths[abkey_list[subindex]] =
          [phantomism_ability_dict[phantomism_list[index]][abkey_list[subindex]][0],
          parseInt(document.getElementById(abkey_list[subindex]+"_grow").value) ];
        } else if(document.getElementById(abkey_list[subindex]+"_grow").value < 0) {
          msg += "成長がマイナスの特化技能があります。<br />";
        }
      }
      if(special_learned > limit_liberal) {
        msg += "リベラルは同一Phantomismの技能を最大で2つまでしか習得できません。<br />";
      }
    }
  }
  if (Object.keys(abilities).length > 7) {
    msg += "習得技能が多すぎます。通常攻撃を除いて7つまでです。<br />";
  } else if (Object.keys(abilities).length < 7) {
    msg += "習得技能が少なすぎます。通常攻撃を除いて7つ取得してください。<br />";
  }

  // データ生成前のチェック
  if (msg !== "") {
    document.getElementById("message").innerHTML = msg;
    document.getElementById("for_cocofolia").classList.add("hidden");
  } else {
    document.getElementById("message").innerHTML = "";
    makeCharacterXML(abilities, growths);
    if(document.getElementById("create_cocofolia_json").checked){
      document.getElementById("for_cocofolia").classList.remove("hidden");
      makeCharacterJSON(abilities, growths);
    } else {
      document.getElementById("for_cocofolia").classList.add("hidden");
    }
  }
}

function makeCharacterXML(abilities, growths) {
  var xml = "",
    // 習得済み技能IDリスト
    learned_ability = Object.keys(abilities),
    growth_keys = Object.keys(growths),
    // VITを除いたステータス
    status = [document.getElementById("sum_adp").value,
             document.getElementById("sum_agi").value,
             document.getElementById("sum_tec").value,
             document.getElementById("sum_for").value,
             document.getElementById("sum_stl").value,
             document.getElementById("sum_crf").value],
    index = 0,
    growth = 0,
    tmpabi,
    setting,
    newlined_setting = "",
    judge_status_list,
    judge_status,
    blob,
    url,
    atag;
  
  xml += '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<character>\n';
  xml += '  <data name="character">\n';
  xml += '    <data name="image">\n';
  xml += '      <data type="image" name="imageIdentifier">none_icon</data>\n';
  xml += '    </data>\n';
  xml += '    <data name="common">\n';
  xml += '      <data name="name">'+document.getElementById("character_name").value.replace(patternString, escapeString)+'</data>\n';
  xml += '      <data name="size">2</data>\n';
  xml += '    </data>\n';
  xml += '    <data name="detail">\n';
  xml += '      <data name="リソース">\n';
  xml += '        <data type="numberResource" currentValue="'+document.getElementById("sum_vit").value+'" name="VIT">'+document.getElementById("sum_vit").value+'</data>\n';
  xml += '      </data>\n';
  xml += '      <data name="情報">\n';
  xml += '        <data name="Age">'+document.getElementById("character_age").value.replace(patternString, escapeString)+'</data>\n';
  xml += '        <data name="Gender">'+document.getElementById("character_gender").value.replace(patternString, escapeString)+'</data>\n';
  xml += '        <data name="Home">'+document.getElementById("character_home").value.replace(patternString, escapeString)+'</data>\n';
  xml += '        <data name="Job">'+document.getElementById("character_job").value.replace(patternString, escapeString)+'</data>\n';
  xml += '        <data name="Honor">' + document.getElementById("character_honor").value;
  for(index = 0 ; index < Math.floor(document.getElementById("character_honor").value / 5); index++){
    xml += '★';
  }
  if(document.getElementById("veteran").checked) {
    xml += "V";
  }
  xml += '</data>\n'
  xml += '        <data name="PHANTOMISM">'+document.getElementById("phantomism").value.toUpperCase()+'</data>\n';
  xml += '        <data type="note" name="メモ">';
  // textareaの改行込み処理
  setting = document.getElementById("memo").value.replace(patternString, escapeString).replace(/\r\n|\r/g, "\n").split("\n");
  for (index = 0; index < setting.length; index++) {
    xml += setting[index] +'\n';
  }
  xml += '        </data>\n';
  xml += '      </data>\n';
  xml += '      <data name="ステータス">\n';
  xml += '        <data name="ADP">'+status[0]+'</data>\n';
  xml += '        <data name="AGI">'+status[1]+'</data>\n';
  xml += '        <data name="TEC">'+status[2]+'</data>\n';
  xml += '        <data name="FOR">'+status[3]+'</data>\n';
  xml += '        <data name="STL">'+status[4]+'</data>\n';
  xml += '        <data name="CRF">'+status[5]+'</data>\n';
  xml += '      </data>\n';
  xml += '      <data name="技能">\n';
  xml += '        <data name="チェス,攻撃">通常攻撃</data>\n';
  for(index = 0; index < learned_ability.length; index++) {
    growth = growths[learned_ability[index]];
    growth = (typeof growth === "undefined") ? 0 : growths[learned_ability[index]][1];
    xml += '        <data name="'+abilities[learned_ability[index]][2]+'">'+abilities[learned_ability[index]][0];
    if (growth > 0) {
      xml += '+'+growth;
    }
    xml += '</data>\n';
  }
  xml += '      </data>\n';

  // 成長
  if(growth_keys.length !== 0) {
    xml += '      <data name="成長">\n';
    for(index = 0; index < growth_keys.length; index++){
      xml += '        <data name="'+growths[growth_keys[index]][0]+'">+'+growths[growth_keys[index]][1]+'</data>\n';
    }
    xml += '      </data>\n';
  }

  xml += '    </data>\n';
  xml += '  </data>\n';

  // チャットパレット
  xml += '  <chat-palette dicebot="">';
  xml += '1d3 移動ロール\n';
  xml += '1d20&lt;='+Math.max(status[0], status[1], status[2], status[3], status[4], status[5])+' 通常攻撃\n';
  for(index = 0; index < learned_ability.length; index++) {
    growth = growths[learned_ability[index]];
    growth = (typeof growth === "undefined") ? 0 : growths[learned_ability[index]][1];
    judge_status_list = abilities[learned_ability[index]][1];
    judge_status = (judge_status_list.length === 1) ? "{" + judge_status_list[0] + "}" : 
                                                      "({" + judge_status_list[0] + "}+{" + judge_status_list[1] + "})/2"
    xml += '1d20&lt;='+judge_status;
    if (growth > 0) {
      xml += '+'+growth;
    }
    xml += ' '+abilities[learned_ability[index]][0];
    if (growth > 0) {
      xml += '+'+growth;
    }
    xml += '\n';
  }
  xml += '\n';
  xml += '1d10&lt;={VIT} VITロール\n';
  xml += '1d20&lt;={ADP} ADPロール\n';
  xml += '1d20&lt;={AGI} AGIロール\n';
  xml += '1d20&lt;={TEC} TECロール\n';
  xml += '1d20&lt;={FOR} FORロール\n';
  xml += '1d20&lt;={STL} STLロール\n';
  xml += '1d20&lt;={CRF} CRFロール\n';
  xml += '  </chat-palette>\n';
  xml += '</character>\n';

  blob = new Blob([xml], {"type":"text/xml"});
  url = URL.createObjectURL(blob);
  atag = document.createElement("a");
  document.body.appendChild(atag);
  atag.download = 'phantomism_' + document.getElementById("character_name").value.replace(patternString, escapeString).replace(/\s+/g, "") + '.xml';
  atag.href = url;
  atag.click();
  atag.remove();
  URL.revokeObjectURL(url);
}

function makeCharacterJSON(abilities, growths) {
  var cocofolia_json = {"kind":"character","data":{}},
      params = [],
      commands = "",
      learned_ability = Object.keys(abilities),
      growth_keys = Object.keys(growths),
      status = [document.getElementById("sum_adp").value,
                document.getElementById("sum_agi").value,
                document.getElementById("sum_tec").value,
                document.getElementById("sum_for").value,
                document.getElementById("sum_stl").value,
                document.getElementById("sum_crf").value];
  cocofolia_json["data"]["name"] = document.getElementById("character_name").value.replace(patternString, escapeString)
  cocofolia_json["data"]["memo"] = document.getElementById("memo").value.replace(patternString, escapeString).replace(/\r\n|\r/g, "\n")
  cocofolia_json["data"]["initiative"] = parseInt(document.getElementById("sum_agi").value, 10)
  cocofolia_json["data"]["status"] = [{"label":"VIT", "value":document.getElementById("sum_vit").value, "max":document.getElementById("sum_vit").value}]
  params.push({"label":"Age", "value": document.getElementById("character_age").value});
  params.push({"label":"Gender", "value": document.getElementById("character_gender").value});
  params.push({"label":"Home", "value": document.getElementById("character_home").value});
  params.push({"label":"Job", "value": document.getElementById("character_job").value});
  params.push({"label":"Honor", "value": document.getElementById("character_honor").value});
  params.push({"label":"Phantomism", "value": document.getElementById("phantomism").value});
  params.push({"label":"", "value": ""});
  params.push({"label":"ADP", "value": document.getElementById("sum_adp").value});
  params.push({"label":"AGI", "value": document.getElementById("sum_agi").value});
  params.push({"label":"TEC", "value": document.getElementById("sum_tec").value});
  params.push({"label":"FOR", "value": document.getElementById("sum_for").value});
  params.push({"label":"STL", "value": document.getElementById("sum_stl").value});
  params.push({"label":"CRF", "value": document.getElementById("sum_crf").value});
  cocofolia_json["data"]["params"] = params;
  
  commands += "1d3 移動ロール\n";
  commands += "1d20&lt;="+Math.max(status[0], status[1], status[2], status[3], status[4], status[5])+" 通常攻撃\n";
  for(index = 0; index < learned_ability.length; index++) {
    growth = growths[learned_ability[index]];
    growth = (typeof growth === "undefined") ? 0 : growths[learned_ability[index]][1];
    judge_status_list = abilities[learned_ability[index]][1];
    judge_status = (judge_status_list.length === 1) ? "{" + judge_status_list[0] + "}" : 
                                                      "({" + judge_status_list[0] + "}+{" + judge_status_list[1] + "})/2"
    commands += "1d20&lt;="+judge_status;
    if (growth > 0) {
      commands += "+"+growth;
    }
    commands += " "+abilities[learned_ability[index]][0];
    if (growth > 0) {
      commands += "+"+growth;
    }
    commands += "\n";
  }
  commands += "\n";
  commands += "1d10&lt;={VIT} VITロール\n";
  commands += "1d20&lt;={ADP} ADPロール\n";
  commands += "1d20&lt;={AGI} AGIロール\n";
  commands += "1d20&lt;={TEC} TECロール\n";
  commands += "1d20&lt;={FOR} FORロール\n";
  commands += "1d20&lt;={STL} STLロール\n";
  commands += "1d20&lt;={CRF} CRFロール\n";
  cocofolia_json["data"]["commands"] = commands;
  document.getElementById("cocofolia_json").innerHTML = JSON.stringify(cocofolia_json);
  document.getElementById("cocofolia_json").focus();
}

window.onload = setDefaultStatus;

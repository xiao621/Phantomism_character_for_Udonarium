var document = document,
  patternString = /"|'|<|>|&/g,
  // ablity_list ... 分野->技能ID->[技能名, チャットパレット, 使用タイミング]
  ability_list = {
    "common": {"dousatsu": ["洞察", "{ADP}", "調査"], "sneaking": ["スニーキング", "{ADP}", "調査"],
               "chikeijyunnou": ["地形順応", "{ADP}", "調査"], "bunseki": ["分析", "{ADP}", "チェス"],
               "hayawaza": ["早業", "{AGI}", "調査"], "kikenyochi": ["危険予知", "{AGI}", "調査"],
               "hobaku": ["捕縛", "{AGI}", "調査,チェス,攻撃"], "kaihi": ["回避", "{AGI}", "チェス,例外"],
               "kirokujyutsu": ["記録術", "{TEC}", "調査"], "mekiki": ["目利き", "{TEC}", "調査,チェス"],
               "kikaikousaku": ["機械工作", "{TEC}", "調査"], "iryou": ["医療", "{TEC}", "チェス"],
               "soujyuu": ["操縦", "{FOR}", "調査"], "knockout": ["ノックアウト", "{FOR}", "調査,チェス,攻撃"],
               "toppa": ["突破", "{FOR}", "調査"], "kinsetsukougeki": ["近接攻撃", "{FOR}", "チェス,攻撃"],
               "taijyutsu": ["体術", "{STL}", "調査"], "glider": ["グライダー", "{STL}", "調査,チェス,例外"],
               "kakuran": ["撹乱", "{STL}", "調査"], "enkyorikougeki": ["遠距離攻撃", "{STL}", "チェス,攻撃"],
               "dennou": ["電脳", "{CRF}", "調査"], "iikurume": ["言いくるめ", "{CRF}", "調査"],
               "kaidoku": ["解読", "{CRF}", "調査"], "ryakudatsu": ["略奪", "{CRF}", "チェス"]},
    "phantom": {"hensou": ["変装", "{ADP}", "調査"], "hengenjizai": ["変幻自在", "{ADP}", "チェス"],
                "gitai": ["擬態", "{ADP}", "調査,チェス"], "chouyaku": ["跳躍", "{STL}", "チェス,例外"],
                "wireaction": ["ワイヤーアクション", "(({ADP}+{STL})/2)", "調査,チェス"], "decoy": ["デコイ", "(({ADP}+{STL})/2)", "チェス"]},
    "ghost": {"inpei": ["隠蔽", "{TEC}", "調査"], "shunsoku": ["瞬足", "{AGI}", "チェス,移動前,例外"],
              "onmitsu": ["隠密", "{AGI}", "調査,チェス,移動前"], "yamitobari": ["闇帳", "{TEC}", "チェス,移動前"],
              "yuureiaruki": ["幽霊歩き", "(({AGI}+{TEC})/2)", "チェス,移動前,例外"], "sippuukyaku": ["疾風脚", "(({AGI}+{TEC})/2)", "チェス,攻撃"]},
    "magic": {"komadukai": ["小間使い", "{TEC}", "調査"], "swap": ["スワップ", "{CRF}", "チェス"],
              "illusion": ["イリュージョン", "(({TEC}+{CRF})/2)", "調査"], "mimic": ["ミミック", "{TEC}", "チェス"],
              "shadow": ["シャドウ", "(({TEC}+{CRF})/2)", "チェス,移動前,例外"], "speedcontrol": ["スピードコントロール", "(({TEC}+{CRF})/2)", "チェス,例外"]},
    "jack": {"iatsu": ["威圧", "{FOR}", "調査"], "mikiri": ["見切り", "(({FOR}+{ADP})/2)", "チェス,攻撃,例外"],
             "kenjyutsu": ["剣術", "(({FOR}+{ADP})/2)", "チェス,攻撃"], "uchikowashi": ["打ち壊し", "{FOR}", "チェス"],
             "issen": ["一閃", "{ADP}", "チェス,攻撃"], "smash": ["スマッシュ", "{FOR}", "チェス,攻撃"]},
    "comet": {"speedgun": ["スピードガン", "{AGI}", "調査,チェス"], "flipjump": ["フリップジャンプ", "{STL}", "チェス,移動前,例外"],
              "quickstep": ["クイックステップ", "{STL}", "チェス,例外"], "rengeki": ["連撃", "(({STL}+{AGI})/2)", "チェス,攻撃,例外"],
              "nichoujyuu": ["二丁銃", "(({STL}+{AGI})/2)", "チェス,攻撃"], "hakugeki": ["迫撃", "(({STL}+{AGI})/2)", "チェス,攻撃,例外"]},
    "spider": {"gizou": ["偽造", "{CRF}", "調査"], "sliptrap": ["スリップトラップ", "(({CRF}+{FOR})/2)", "チェス"],
               "saiminjyutsu": ["催眠術", "{FOR}", "調査"], "captureweb": ["キャプチャーウェブ", "(({CRF}+{FOR})/2)", "チェス"],
               "kanpa": ["看破", "{CRF}", "調査,チェス"], "thunderbolt": ["サンダーボルト", "(({CRF}+{FOR})/2)", "チェス"]}
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

function makeNormalElement(eName,eAttribute,eText) {
  var elem = document.createElement("data");
  elem.setAttribute(eName,eAttribute);
  elem.textContent = eText;
  return elem;
}

function makeResourceElement(rName,rAttribute,rText,rCurrent) {
  var elem = document.createElement("data");
  elem.setAttribute("type","numberResource");
  elem.setAttribute("currentValue",rCurrent);
  elem.setAttribute(rName,rAttribute);
  elem.textContent = rText;
  return elem;
}

function makeNoteElement(nName,nAttribute,nText) {
  var elem = document.createElement("data");
  elem.setAttribute("type","note");
  elem.setAttribute(nName,nAttribute);
  elem.textContent = nText;
  return elem;
}

function makeParentElement(attribute) {
  var elem = document.createElement("data");
  elem.setAttribute("name",attribute);
  return elem;
}

// Handler
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
    if (adds[index].value < 0 || adds[index].value === "") {
      adds[index].style.backgroundColor = "#fcc";
    } else {
      adds[index].style.backgroundColor = "#fff";
    }
  }

  // 残りの追加値を計算
  point_left -= alladds;
  if (isNaN(point_left)) {
    document.getElementById("point_left").textContent = "空欄があります";
  } else {
    document.getElementById("point_left").textContent = "残り " + point_left;
  }
  if (isNaN(point_left) || point_left < 0) {
    document.getElementById("point_left").style.color = "#f00";
  } else {
    document.getElementById("point_left").style.color = "#000";
  }

  // 合計値計算
  for (index = 0; index < 7; index++) {
    temp = parseInt(defaults[index]) + parseInt(adds[index].value);
    if (isNaN(temp) || (index === 0 && temp > 10)) {
      sums[index].style.backgroundColor = "#fcc";
    } else if (temp > 18) {
      sums[index].style.backgroundColor = "#fcc";
    } else {
      sums[index].style.backgroundColor = "#fff";
    }
    sums[index].value = temp;
  }
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
               "abilities": ["dousatsu", "dennou", "bunseki", "gizou", "saiminjyutsu", "sliptrap", "captureweb"]}
  },
    adds = [document.getElementById("add_vit"),
            document.getElementById("add_adp"),
            document.getElementById("add_agi"),
            document.getElementById("add_tec"),
            document.getElementById("add_for"),
            document.getElementById("add_stl"),
            document.getElementById("add_crf")],
    phantomism = document.getElementById("phantomism").value,
    index = 0, temp_list;

  if (phantomism === "") {
    alert("PHANTOMISMを選択してください！");
    return;
  }
  for (index = 0; index < adds.length; index++) {
    adds[index].value = sample_data[phantomism]["adds"][index];
  }
  calcStatus();
  temp_list = Object.keys(ability_list["common"]);
  for (index = 0; index < temp_list.length; index++) {
    if (sample_data[phantomism]["abilities"].includes(temp_list[index])) {
      document.getElementById(temp_list[index]).checked = true;
    } else {
      document.getElementById(temp_list[index]).checked = false;
    }
  }
  temp_list = Object.keys(ability_list[phantomism]);
  for(index = 0; index < temp_list.length; index++) {
    if (sample_data[phantomism]["abilities"].includes(temp_list[index])) {
      document.getElementById(temp_list[index]).checked = true;
    } else {
      document.getElementById(temp_list[index]).checked = false;
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
    index = 0,
    alladds = 0,
    abilities = {},
    growths = {},
    abkey_list,
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

  // 技能7つ取っているか
  abkey_list = Object.keys(ability_list["common"]);
  for (index = 0; index < 24; index++) {
    if (document.getElementById(abkey_list[index]).checked) {
      abilities[abkey_list[index]] = ability_list["common"][abkey_list[index]];
    }
    if (document.getElementById(abkey_list[index]+"_grow").value > 0) {
      growths[abkey_list[index]] =
        [ability_list["common"][abkey_list[index]][0],
        parseInt(document.getElementById(abkey_list[index]+"_grow").value) ];
    } else if(document.getElementById(abkey_list[index]+"_grow").value < 0) {
      msg += "成長がマイナスの一般技能があります。<br />"
    }
  }

  if (phantomism !== "") {
    abkey_list = Object.keys(ability_list[phantomism]);
    for (index = 0; index < 6; index++) {
      if (document.getElementById(abkey_list[index]).checked) {
        abilities[abkey_list[index]] = ability_list[phantomism][abkey_list[index]];
      }
      if (document.getElementById(abkey_list[index]+"_grow").value > 0) {
        growths[abkey_list[index]] =
        [ability_list[phantomism][abkey_list[index]][0],
        parseInt(document.getElementById(abkey_list[index]+"_grow").value) ];
      } else if(document.getElementById(abkey_list[index]+"_grow").value < 0) {
        msg += "成長がマイナスの特化技能があります。<br />"
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
    makeCharacterXML(abilities, growths);
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
    blob,
    url,
    atag;

  /* DOMツリー生成版, エスケープコードがパースされない不具合につき、一旦保留
  let xmltree = document.createElement("character");

  // data character
  let character = document.createElement("data");
  character.setAttribute("name","character");

  // data character - img
  let img = document.createElement("data");
  img.setAttribute("name","image");
  let imgChild = document.createElement("data");
  imgChild.setAttribute("type","image");
  imgChild.setAttribute("name","imageIdentifier");
  imgChild.textContent = "none_icon";
  img.appendChild(imgChild);
  character.appendChild(img);

  // data character - common
  let common = document.createElement("data");
  common.setAttribute("name","common");
  let commonChild = makeNormalElement("name","name",document.getElementById("character_name").value.replace(patternString, escapeString));
  common.appendChild(commonChild);
  commonChild = makeNormalElement("name","size","2");
  common.appendChild(commonChild);
  character.appendChild(common);

  // data character - detail
  let detail = makeParentElement("detail");

  // data character - detail - リソース
  let resource = makeParentElement("リソース");
  let resourceChild = makeResourceElement("name", "VIT", document.getElementById("sum_vit").value, document.getElementById("sum_vit").value);
  resource.appendChild(resourceChild);
  detail.appendChild(resource);

  // data character - detail - 情報
  let info = makeParentElement("情報");

  // data character - detail - 情報 - age
  let age = makeNormalElement("name", "Age", document.getElementById("character_age").value.replace(patternString, escapeString));
  info.appendChild(age);

  // data character - detail - 情報 - Gender
  let gender = makeNormalElement("name", "Gender", document.getElementById("character_gender").value.replace(patternString, escapeString));
  info.appendChild(gender);

  // data character - detail - 情報 - Home
  let home = makeNormalElement("name", "Home", document.getElementById("character_home").value.replace(patternString, escapeString));
  info.appendChild(home);

  // data character - detail - 情報 - Job
  let job = makeNormalElement("name", "Job", document.getElementById("character_job").value.replace(patternString, escapeString));
  info.appendChild(job);

  // data character - detail - 情報 - PHANTOMISM
  let phantomism = makeNormalElement("name", "PHANTOMISM", document.getElementById("phantomism").value.toUpperCase());
  info.appendChild(phantomism);

  // data character - detail - 情報 - メモ
  setting = document.getElementById("memo").value.replace(patternString, escapeString).replace(/\r\n|\r/g, "\n").split("\n");
  for (index = 0; index < setting.length; index++) {
    newlined_setting += setting[index] +'\n';
  }
  let memo = makeNoteElement("name", "メモ", newlined_setting);
  info.appendChild(memo);

  detail.appendChild(info);

  // data character - detail - ステータス
  let statuses = makeParentElement("ステータス");

  let adp = makeNormalElement("name", "ADP", status[0]);
  statuses.appendChild(adp);
  let agi = makeNormalElement("name", "AGI", status[1]);
  statuses.appendChild(agi);
  let tec = makeNormalElement("name", "TEC", status[2]);
  statuses.appendChild(tec);
  let force = makeNormalElement("name", "FOR", status[3]);
  statuses.appendChild(force);
  let stl = makeNormalElement("name", "STL", status[4]);
  statuses.appendChild(stl);
  let crf = makeNormalElement("name", "CRF", status[5]);
  statuses.appendChild(crf);

  detail.appendChild(statuses);

  // data character - detail - 技能
  let abilist = makeParentElement("技能");

  let normal_attack = makeNormalElement("name", "チェス,攻撃", "通常攻撃");
  abilist.appendChild(normal_attack);
  for(index = 0; index < learned_ability.length; index++) {
    tmpabi = makeNormalElement("name", "", abilities[learned_ability[index]][0]);
    abilist.appendChild(tmpabi);
  }

  detail.appendChild(abilist);
  character.appendChild(detail);
  xmltree.appendChild(character);

  // チャットパレット
  let chat_palette = document.createElement("chat-palette");
  chat_palette.setAttribute("dicebot","");
  chat_palette.textContent = "1d3 移動ロール\n";
  chat_palette.textContent += '\n';
  chat_palette.textContent += "1d20&lt;="+Math.max(status[0], status[1], status[2], status[3], status[4], status[5])+" 通常攻撃\n";
  for(index = 0; index < learned_ability.length; index++) {
    growth = document.getElementById(learned_ability[index] + "_grow").value;
    chat_palette.textContent += '1d20&lt;=('+abilities[learned_ability[index]][1];
    if (growth !== "" && growth > 0) {
      chat_palette.textContent += '+'+growth;
    }
    chat_palette.textContent += ') '+abilities[learned_ability[index]][0];
    if (growth !== "" && growth > 0) {
      chat_palette.textContent += '+'+growth;
    }
    chat_palette.textContent += '\n';
  }
  chat_palette.textContent += '\n';
  chat_palette.textContent += '1d10&lt;={VIT} VITロール\n';
  chat_palette.textContent += '1d20&lt;={ADP} ADPロール\n';
  chat_palette.textContent += '1d20&lt;={AGI} AGIロール\n';
  chat_palette.textContent += '1d20&lt;={TEC} TECロール\n';
  chat_palette.textContent += '1d20&lt;={FOR} FORロール\n';
  chat_palette.textContent += '1d20&lt;={STL} STLロール\n';
  chat_palette.textContent += '1d20&lt;={CRF} CRFロール\n';

  xmltree.appendChild(chat_palette);

  // XML 宣言
  //let xml = document.createProcessingInstruction('xml', 'version="1.0" encoding="UTF-8"');
  //xml.append(xmltree);

  // XML 生成
  xmlSerializer = new XMLSerializer();
  serializedXML = xmlSerializer.serializeToString(xmltree);
  serializedXML = serializedXML.replace(/ xmlns="http:\/\/www.w3.org\/1999\/xhtml"/g,'');
  serializedXML = serializedXML.replace(/currentvalue/g,'currentValue');
  */
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
    growth = document.getElementById(learned_ability[index] + "_grow").value;
    xml += '        <data name="'+abilities[learned_ability[index]][2]+'">'+abilities[learned_ability[index]][0];
    if (growth !== "" && growth > 0) {
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
  xml += '  <chat-palette dicebot="">';
  xml += '1d3 移動ロール\n';
  xml += '1d20&lt;='+Math.max(status[0], status[1], status[2], status[3], status[4], status[5])+' 通常攻撃\n';
  for(index = 0; index < learned_ability.length; index++) {
    growth = document.getElementById(learned_ability[index] + "_grow").value;
    xml += '1d20&lt;=('+abilities[learned_ability[index]][1];
    if (growth !== "" && growth > 0) {
      xml += '+'+growth;
    }
    xml += ') '+abilities[learned_ability[index]][0];
    if (growth !== "" && growth > 0) {
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



  /* DOM 生成版 エスケープコードがパースされないので一旦保留
  //blob = new Blob([serializedXML], {"type":"text/xml"});
  // serializedXML = '<?xml version="1.0" encoding="UTF-8"?>\n' + serializedXML;
  blob = new Blob([serializedXML], {"type":"text/xml"});
  url = URL.createObjectURL(blob);

  atag = document.createElement("a");
  document.body.appendChild(atag);
  atag.download = document.getElementById("character_name").value.replace(/\s+/g, "") + '.xml';
  atag.href = url;
  atag.click();
  atag.remove();
  URL.revokeObjectURL(url);
  */
}

window.onload = setDefaultStatus;

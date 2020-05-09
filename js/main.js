var document = document,
  ablility_list = {
    "phantom" : [],
    "ghost" : [],
    "magic" : [],
    "jack" : [],
    "comet" : [],
    "spider" : []
  };

function setDefaultStatus() {
  var status = {
    "phantom" : [5, 10,  6,  4,  6,  8, 6],
    "ghost"   : [4,  6, 10,  8,  4,  7, 6],
    "magic"   : [5,  6,  4, 10,  6,  6, 8],
    "jack"    : [6,  8,  6,  5, 10,  6, 4],
    "comet"   : [5,  4,  8,  6,  7, 10, 5],
    "spider"  : [5,  6,  5,  7,  8,  4, 10]
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
  // TODO 技能のリセット
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

'use strict';

function isNumber(str) {
  return !Number.isNaN(parseFloat(str)) && Number.isFinite(parseFloat(str));
}

function splitInt(str) {
  return str.split(/([0-9]+)/).filter(Boolean);
}

function splitFloat(str) {
  return str.split(/([0-9]{0,}\.{0,1}[0-9]{1,})+/).filter(Boolean);
}

// https://www.yoheim.net/blog.php?q=20191101
function toFullWidth(str) {
  const kanaMap = {
    'ｶﾞ': 'ガ', 'ｷﾞ': 'ギ', 'ｸﾞ': 'グ', 'ｹﾞ': 'ゲ', 'ｺﾞ': 'ゴ',
    'ｻﾞ': 'ザ', 'ｼﾞ': 'ジ', 'ｽﾞ': 'ズ', 'ｾﾞ': 'ゼ', 'ｿﾞ': 'ゾ',
    'ﾀﾞ': 'ダ', 'ﾁﾞ': 'ヂ', 'ﾂﾞ': 'ヅ', 'ﾃﾞ': 'デ', 'ﾄﾞ': 'ド',
    'ﾊﾞ': 'バ', 'ﾋﾞ': 'ビ', 'ﾌﾞ': 'ブ', 'ﾍﾞ': 'ベ', 'ﾎﾞ': 'ボ',
    'ﾊﾟ': 'パ', 'ﾋﾟ': 'ピ', 'ﾌﾟ': 'プ', 'ﾍﾟ': 'ペ', 'ﾎﾟ': 'ポ',
    'ｳﾞ': 'ヴ', 'ﾜﾞ': 'ヷ', 'ｦﾞ': 'ヺ',
    'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ',
    'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ',
    'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ',
    'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト',
    'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ',
    'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ',
    'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ',
    'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ',
    'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ',
    'ﾜ': 'ワ', 'ｦ': 'ヲ', 'ﾝ': 'ン',
    'ｧ': 'ァ', 'ｨ': 'ィ', 'ｩ': 'ゥ', 'ｪ': 'ェ', 'ｫ': 'ォ',
    'ｯ': 'ッ', 'ｬ': 'ャ', 'ｭ': 'ュ', 'ｮ': 'ョ',
    '｡': '。', '､': '、', 'ｰ': 'ー', '｢': '「', '｣': '」', '･': '・',
    '\゛': '\ﾞ', '\ﾟ': '\゜',
  }

  return str
    .replace(/[!-~]/g, function(ch) {
      return String.fromCharCode(ch.charCodeAt(0) + 0xfee0);
    })
    .replace(new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g'), function(ch) {
      return kanaMap[ch];
    })
    .replace(/[^\S\r\n]/g, function(ch) {
      return "　";
    })
}

// https://www.yoheim.net/blog.php?q=20191101
function toHalfWidth(str) {
  const kanaMap = {
    "ガ": "ｶﾞ", "ギ": "ｷﾞ", "グ": "ｸﾞ", "ゲ": "ｹﾞ", "ゴ": "ｺﾞ",
    "ザ": "ｻﾞ", "ジ": "ｼﾞ", "ズ": "ｽﾞ", "ゼ": "ｾﾞ", "ゾ": "ｿﾞ",
    "ダ": "ﾀﾞ", "ヂ": "ﾁﾞ", "ヅ": "ﾂﾞ", "デ": "ﾃﾞ", "ド": "ﾄﾞ",
    "バ": "ﾊﾞ", "ビ": "ﾋﾞ", "ブ": "ﾌﾞ", "ベ": "ﾍﾞ", "ボ": "ﾎﾞ",
    "パ": "ﾊﾟ", "ピ": "ﾋﾟ", "プ": "ﾌﾟ", "ペ": "ﾍﾟ", "ポ": "ﾎﾟ",
    "ヴ": "ｳﾞ", "ヷ": "ﾜﾞ", "ヺ": "ｦﾞ",
    "ア": "ｱ", "イ": "ｲ", "ウ": "ｳ", "エ": "ｴ", "オ": "ｵ",
    "カ": "ｶ", "キ": "ｷ", "ク": "ｸ", "ケ": "ｹ", "コ": "ｺ",
    "サ": "ｻ", "シ": "ｼ", "ス": "ｽ", "セ": "ｾ", "ソ": "ｿ",
    "タ": "ﾀ", "チ": "ﾁ", "ツ": "ﾂ", "テ": "ﾃ", "ト": "ﾄ",
    "ナ": "ﾅ", "ニ": "ﾆ", "ヌ": "ﾇ", "ネ": "ﾈ", "ノ": "ﾉ",
    "ハ": "ﾊ", "ヒ": "ﾋ", "フ": "ﾌ", "ヘ": "ﾍ", "ホ": "ﾎ",
    "マ": "ﾏ", "ミ": "ﾐ", "ム": "ﾑ", "メ": "ﾒ", "モ": "ﾓ",
    "ヤ": "ﾔ", "ユ": "ﾕ", "ヨ": "ﾖ",
    "ラ": "ﾗ", "リ": "ﾘ", "ル": "ﾙ", "レ": "ﾚ", "ロ": "ﾛ",
    "ワ": "ﾜ", "ヲ": "ｦ", "ン": "ﾝ",
    "ァ": "ｧ", "ィ": "ｨ", "ゥ": "ｩ", "ェ": "ｪ", "ォ": "ｫ",
    "ッ": "ｯ", "ャ": "ｬ", "ュ": "ｭ", "ョ": "ｮ",
    "。": "｡", "、": "､", "ー": "ｰ", "「": "｢", "」": "｣", "・": "･",
    "\゛": "\ﾞ", "\゜": "\ﾟ",
  }

  return str
    .replace(/[！-～]/g, function(ch) {
      return String.fromCharCode(ch.charCodeAt(0) - 0xfee0);
    })
    .replace(new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g'), function(ch) {
      return kanaMap[ch];
    })
    .replace(/[^\S\r\n]/g, function(ch) {
      return " ";
    })
}

function convertWidth(str, full) {
  if (full) {
    return toFullWidth(str);
  } else {
    return toHalfWidth(str);
  }
}

function getDifferences(from, to) {
  const IS_MATCHED = 0;
  const IS_INSERTED = 1;
  const IS_DELETED = -1;

  // create dynamic programming table
  const dpt = [];
  for (let i = 0; i < from.length + 1; i++) {
    dpt.push([]);
    for (let j = 0; j < to.length + 1; j++) {
      dpt[i][j] = 0;
    }
  }

  for (let i = 1; i <= from.length; i++) {
    const charA = from.charAt(i - 1);
    for (let j = 1; j <= to.length; j++) {
      const charB = to.charAt(j - 1);
      if (charA === charB) {
        dpt[i][j] = dpt[i - 1][j - 1] + 1;
      } else {
        dpt[i][j] = Math.max(dpt[i - 1][j], dpt[i][j - 1]);
      }
    }
  }

  let result = [],
      i = from.length,
      j = to.length;

  while (i > 0 || j > 0) {
    const prev = result[result.length - 1];
    const charA = from.charAt(i - 1);
    const charB = to.charAt(j - 1);
    if (i > 0 && j > 0 && charA === charB) {
      if (prev && prev.type === 0) {
        prev.data = charA + prev.data;
      } else {
        result.push({ type: IS_MATCHED, data: charA });
      }
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dpt[i][j - 1] >= dpt[i - 1][j])) {
      if (prev && prev.type === 1) {
        prev.data = charB + prev.data;
      } else {
        result.push({ type: IS_INSERTED, data: charB });
      }
      j--;
    } else if (i > 0 && (j === 0 || dpt[i][j - 1] < dpt[i - 1][j])) {
      if (prev && prev.type === -1) {
        prev.data = charA + prev.data;
      } else {
        result.push({ type: IS_DELETED, data: charA });
      }
      i--;
    }
  }

  return result.reverse();
}

function getAccuracy(a, b) {
  // create dynamic programming table
  const dpt = [];
  for (let i = 0; i < a.length + 1; i++) {
    dpt.push([]);
    for (let j = 0; j < b.length + 1; j++) {
      dpt[i][j] = 0;
    }
  }

  for (let i = 1; i <= a.length; i++) {
    const charA = a.charAt(i - 1);
    for (let j = 1; j <= b.length; j++) {
      const charB = b.charAt(j - 1);
      if (charA === charB) {
        dpt[i][j] = dpt[i - 1][j - 1] + 1;
      } else {
        dpt[i][j] = Math.max(dpt[i - 1][j], dpt[i][j - 1]);
      }
    }
  }

  let matches = 0,
      i = a.length,
      j = b.length;

  while (i > 0 || j > 0) {
    const charA = a.charAt(i - 1);
    const CharB = b.charAt(j - 1);
    if (i > 0 && j > 0 && charA === CharB) {
      matches++;
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dpt[i][j - 1] >= dpt[i - 1][j])) {
      j--;
    } else if (i > 0 && (j === 0 || dpt[i][j - 1] < dpt[i - 1][j])) {
      i--;
    }
  }

  return (matches * 2) / (a.length + b.length);
}

function compareAB(a, b) {
  
  function composeResult(n) {
    if (n > 0) {
      return 1;
    }
    if (n < 0) {
      return -1;
    }
    return 0;
  }

  function compareNumber(strA, strB) {
    return composeResult(parseInt(strA) - parseInt(strB));
  }

  function compareString(strA, strB) {
    const len = Math.max(strA.length, strB.length);
    for (let i = 0; i < len; i++) {
      const charA = strA.charAt(i);
      const charB = strB.charAt(i);
      if (charA === "") {
        return -1;
      }
      if (charB === "") {
        return 1;
      }
      const pointA = charA.codePointAt(0);
      const pointB = charB.codePointAt(0);
      if (pointA > pointB) {
        return 1;
      }
      if (pointA < pointB) {
        return -1;
      }
    }
    return 0;
  }

  const arrA = splitInt(a);
  const arrB = splitInt(b);
  const len = Math.max(arrA.length, arrB.length);
  for (let i = 0; i < len; i++) {
    const strA = arrA[i];
    const strB = arrB[i];
    if (strA !== strB) {
      if (typeof(strB) === "undefined") {
        return 1;
      } else if (typeof(strA) === "undefined") {
        return -1;
      } else if (isNumber(strA) && isNumber(strB)) {
        return compareNumber(strA, strB);
      } else {
        return compareString(strA, strB);
      }
    }
  }
}

function xor(str, salt) {
  if (salt.length < 1) {
    return str;
  }
  let result = "", i = 0;
  while(salt.length < str.length) {
    salt += salt;
  }
  while(i < str.length) {
    result += String.fromCharCode(str.charCodeAt(i) ^ salt.charCodeAt(i));
    i++;
  }
  return result;
}

window.strJs = {
  isNumber: isNumber,
  splitInt: splitInt,
  splitFloat: splitFloat,
  width: convertWidth,
  compare: compareAB,
  diff: getDifferences,
  match: getAccuracy,
  xor: xor,
}
'use strict';

function getMinimumValue(arr) {
  if (!arr || arr.length < 1) {
    return;
  }

  return arr.reduce(function(prev, curr) {
    return curr < prev ? curr : prev;
  }, arr[0]);
}

function getMaximumValue(arr) {
  if (arr.length < 1) {
    return;
  }

  return arr.reduce(function(prev, curr) {
    return curr > prev ? curr : prev;
  }, arr[0]);
}

function getAverageOfNumbers(arr) {
  if (!arr || arr.length < 1) {
    return;
  }
  
  return arr.reduce(function(prev, curr) {
    return prev + curr;
  }, 0) / arr.length;
}

function getMostFrequentValue(arr) {
  if (arr.length < 1) {
    return;
  }

  let seen = {},
      maxValue = arr[0],
      maxCount = 1;

  for (let i = 0; i < arr.length; i++) {
    const v = arr[i];

    if (typeof(seen[v]) === "undefined") {
      seen[v] = 0;
    }

    seen[v] += 1;

    if (seen[v] > maxCount) {
      maxValue = v;
      maxCount = seen[v];
    }
  }

  return maxValue;
}

function getCasesInArray(data) {
  function getFirstIndexes(d) {
    if (d.length < 1) {
      return;
    }
    const result = [];
    for (let i = 0; i < d.length; i++) {
      result.push(0);
    }
    return result;
  }
  
  function getNextIndexes(d, indexes) {
    for (let i = 0; i < d.length; i++) {
      // increase current index
      if (indexes[i] < d[i].length - 1) {
        indexes[i] += 1;
        return indexes;
      }
      // reset current index
      if (i < d.length - 1) {
        indexes[i] = 0;
      }
    }
    return;
  }
  
  function getValues(d, indexes) {
    const result = [];
    for (let i = 0; i < d.length; i++) {
      result.push(d[i][indexes[i]]);
    }
    return result;
  }

  function exec(d) {
    const result = [];
    let i = getFirstIndexes(d);
    while(i) {
      const v = getValues(d, i);
      result.push(v);
      i = getNextIndexes(d, i);
    }
    return result;
  }
  
  return exec(data);
}

function getAround(arr, index, size) {
  // remove self
  size -= 1;

  const maxIndex = arr.length - 1;
  const minIndex = 0;

  let left = index - Math.floor(size / 2),
      right = index + Math.ceil(size / 2);

  if (left < minIndex) {
    let diff = minIndex - left;
    while(diff > 0 && right < maxIndex) {
      right++;
      diff--;
    }
    left = minIndex;
  }

  if (right > maxIndex) {
    let diff = right - maxIndex;
    while(diff > 0 && left > minIndex) {
      left--;
      diff--;
    }
    right = maxIndex;
  }

  return arr.slice(left, right + 1);
}

window.arrJs = {
  min: getMinimumValue,
  max: getMaximumValue,
  mean: getAverageOfNumbers,
  mode: getMostFrequentValue,
  spread: getCasesInArray,
  around: getAround,
}
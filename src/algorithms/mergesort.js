export function mergesort(array) {
  const animations = [];
  if (array.length <= 1) return array;
  const auxiliaryArray = array.slice();
  mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, animations);
  const result = [];
  result.push(animations);
  result.push(array);
  return result;
}

function mergeSortHelper(mainArray, startIdx, endIdx, auxiliaryArray, animations) {
  if (startIdx === endIdx) return;
  const middleIdx = Math.floor((startIdx + endIdx) / 2);
  mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
  mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
  doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
}

function doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations) {
  let k = startIdx;
  let i = startIdx;
  let j = middleIdx + 1;
  while (i <= middleIdx && j <= endIdx) {
    animations.push([2, i, j]);
    if (auxiliaryArray[i] <= auxiliaryArray[j]) {
      mainArray[k++] = auxiliaryArray[i++];
      animations.push([1, k - 1, auxiliaryArray[i - 1]]);
      animations.push([3, i - 1, i - 1]);
      animations.push([2, i, j]);
    } else {
      mainArray[k++] = auxiliaryArray[j++];
      animations.push([1, k - 1, auxiliaryArray[j - 1]]);
      animations.push([3, j - 1, j - 1]);
      animations.push([2, i, j]);
    }
  }
  while (i <= middleIdx) {
    doMergeHelper(i++, k++, auxiliaryArray, mainArray, animations);
    // animations.push([3, i - 1, i - 1]);
  }
  while (j <= endIdx) {
    doMergeHelper(j++, k++, auxiliaryArray, mainArray, animations);
    // animations.push([3, j - 1, j - 1]);
  }
}

function doMergeHelper(auxIdx, mainIdx, auxiliaryArray, mainArray, animations) {
    animations.push([2, auxIdx, auxIdx]);
    animations.push([4, auxIdx, auxIdx]);
    mainArray[mainIdx] = auxiliaryArray[auxIdx];
    animations.push([1, mainIdx, auxiliaryArray[auxIdx]]);
}

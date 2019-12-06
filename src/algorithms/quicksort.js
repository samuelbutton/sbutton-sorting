export function quicksort(array) {
  const animations = [];
  if (array.length <= 1) return array;
  const mainArray = quickSortHelper(array.slice(), 0, array.length - 1, animations);
  
  const result = [];
  result.push(animations);
  result.push(mainArray);
  return result;
}

function quickSortHelper(mainArray, startIdx, endIdx, animations) {
  if (endIdx <= startIdx) return;
  let j = partition(mainArray, startIdx, endIdx, animations);
  quickSortHelper(mainArray, startIdx, j-1, animations);
  quickSortHelper(mainArray, j+1, endIdx, animations);
  return mainArray;     
}

function partition(mainArray, startIdx, endIdx, animations) {
  let i = startIdx, j = endIdx + 1;
  animations.push([1, startIdx, null]);
  while (true) {
    while (mainArray[++i] < mainArray[startIdx])
      if (i === endIdx) break;
    while (mainArray[startIdx] < mainArray[--j])
      if (j === startIdx) break;
    if (i >= j) break;
    exch(mainArray, i, j, animations);
  }
  exch(mainArray, startIdx, j, animations);
  return j;
}

function exch(mainArray, idx1, idx2, animations) {
  let temp = mainArray[idx1];
  mainArray[idx1] = mainArray[idx2];
  mainArray[idx2] = temp;
  animations.push([2, idx1, idx2]);
  animations.push([4, idx1, idx2]);
}


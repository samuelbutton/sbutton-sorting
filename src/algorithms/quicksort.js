export function quicksort(array) {
  const animations = [];
  if (array.length <= 1) return array;
  quickSortHelper(array, 0, array.length - 1, animations);
  
  const result = [];
  result.push(animations);
  result.push(array);
  return result;
}

function quickSortHelper(mainArray, startIdx, endIdx, animations) {
  if (endIdx <= startIdx) return;
  let j = partition(mainArray, startIdx, endIdx, animations);
  quickSortHelper(mainArray, startIdx, j-1, animations);
  quickSortHelper(mainArray, j+1, endIdx, animations);
}

function partition(mainArray, startIdx, endIdx, animations) {
  let i = startIdx, j = endIdx + 1;
  // 1. change 1 bar to green, second is height, if not null
  animations.push([1, startIdx, null]);
  while (true) {
    // 2. highlight two bars with secondary
    animations.push([2, i, j]);
    while (mainArray[++i] < mainArray[startIdx]) {
      // 3. change single bar back to primary
      animations.push([3, i - 1, i - 1]);
      animations.push([2, i, j]);
      if (i === endIdx) break;
    }
    while (mainArray[startIdx] < mainArray[--j]) {
      animations.push([3, j + 1, j + 1]);
      animations.push([2, i, j]);
      if (j === startIdx) break;
    }
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
  // 4. switch heights and change back to primary
  animations.push([4, idx1, idx2]);
}


export function bubblesort(array) {
  const animations = [];
  if (array.length <= 1) return array;
  const mainArray = bubbleSortHelper(array.slice(), animations);
  
  const result = [];
  result.push(animations);
  result.push(mainArray);
  return result;
}

function bubbleSortHelper(mainArray, animations) {
    const n = mainArray.length; 
    for (let i = 0; i < n-1; i++) {
        for (let j = 0; j < n-i-1; j++) {
            if (mainArray[j] > mainArray[j+1]) 
                exch(mainArray, j, j+1, animations);
        }
    }
    return mainArray;           
} 

function exch(mainArray, idx1, idx2, animations) {
  let temp = mainArray[idx1];
  mainArray[idx1] = mainArray[idx2];
  mainArray[idx2] = temp;
  animations.push([2, idx1, idx2]);
  animations.push([4, idx1, idx2]);
}


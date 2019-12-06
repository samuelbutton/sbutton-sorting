export function heapsort(array, returnAnimations) {
  const animations = [];
  if (array.length <= 1) return array;
  const mainArray = heapSortHelper(array.slice(), animations);

  const result = [];
  result.push(animations);
  result.push(mainArray);
  return result;
}

function heapSortHelper(array, animations) {
	let N = array.length;
	let newArray = [0];
	for (let i = 0; i < N; i++)
		newArray.push(array[i]);
	for (let k = Math.floor(N / 2); k >= 1; k--)
		sink(newArray, k, N, animations, false);
	while (N > 1) {
		exch(newArray, 1, N, animations, true);
		sink(newArray, 1, --N, animations, false);
	}
	for (let i = 0; i < array.length; i++) {
		array[i] = newArray[i+1];
	}
	return array;
}

function sink(array, index, N, animations, isSorted) {
	while (2 * index <= N) {
		let j = 2 * index;
		if (j < N && array[j] < array[j+1]) j++;
		if (array[index] > array[j]) break;
		exch(array, index, j, animations, isSorted);
		index = j;
	}
}

function exch(array, idx1, idx2, animations, isSorted) {
  let temp = array[idx1];
  array[idx1] = array[idx2];
  array[idx2] = temp;
  if (!isSorted) {
	  animations.push([4, idx1 - 1, idx2 - 1]);
	  animations.push([2, idx1 - 1, idx2 - 1]);
	}
  else {
  	animations.push([4, idx1 - 1, idx2 - 1]);
  	animations.push([2, idx1 - 1, idx1 - 1]);
  	animations.push([1, idx2 - 1, null]);
  }
}
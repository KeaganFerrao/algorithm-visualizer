const Sort = function () {
    function selectionSort(arr) {
        for (let i = 0; i < arr.length; i++) {
            let minIdx = i;
            for (let j = i; j < arr.length; j++) {
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            //Swap Elements
            [arr[minIdx], arr[i]] = [arr[i], arr[minIdx]];
            swaps.push([minIdx, i]);
        }
    }

    function bubbleSort(arr) {
        let swapped;
        for (let i = 0; i < arr.length; i++) {
            swapped = false
            for (let j = 0; j < array.length - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    //Swap Elements
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    swaps.push([j, j + 1]);
                    swapped = true;
                }
            }

            //If the inner loop does not swap any element means the array is already sorted, so we can break.
            if (swapped === false) {
                break;
            }
        }
    }

    function insertionSort(arr) {
        for (let i = 1; i < arr.length; i++) {
            for (let j = i; j >= 0; j--) {
                if (arr[j] < arr[j - 1]) {
                    [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
                    swaps.push([j, j - 1]);
                }
            }
        }
    }

    function partition(arr, lower, upper) {
        let pivot = arr[lower];
        let start = lower;
        let end = upper;

        while (start < end) {
            while (arr[start] <= pivot) {
                start++;
            }
            while (arr[end] > pivot) {
                end--;
            }
            if (start < end) {
                //Swap
                [arr[start], arr[end]] = [arr[end], arr[start]];
                swaps.push([start, end]);
            }
        }
        [arr[lower], arr[end]] = [arr[end], arr[lower]];
        swaps.push([lower, end]);
        return end;
    }

    function quickSort(arr, low = 0, high = arr.length - 1) {
        if (low < high) {
            let pi = partition(arr, low, high);

            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }

    function mergeSort(arr, l = 0, r = arr.length - 1) {
        // Recursively divide the array until one element remains.
        if (l >= r) {
            return;
        }

        let m = Math.floor((l + r) / 2);
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);

        // Merge the divided parts in sorted order.
        merge(arr, l, m, r);
    }

    function merge(arr, l, m, r) {
        let i = 0;
        let j = 0;
        let k = l;

        let L = arr.slice(l, m + 1);
        let R = arr.slice(m + 1, r + 1);
        while (i < L.length && j < R.length) {
            if (L[i] < R[j]) {
                arr[k++] = L[i++];
            } else {
                swaps.push([k, m + 1 + j]);
                arr[k++] = R[j++];
            }
        }

        while (i < L.length) {
            arr[k++] = L[i++];
        }

        while (j < R.length) {
            swaps.push([k, m + 1 + j]);
            arr[k++] = R[j++];
        }
    }

    return {
        selectionSort,
        bubbleSort,
        quickSort,
        mergeSort,
        insertionSort
    }
}();
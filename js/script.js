let array = [];
let swaps = [];
let speed = 0.5;

const Template = function () {
    const slider = document.getElementById("speed");
    const output = document.getElementById("speedValue");

    const showData = (e) => {
        e.preventDefault();
        document.getElementById('array').textContent = 'Array: [ ' + document.getElementById('elements').value + ' ]';

        try {
            array = document.getElementById('elements').value.split(',');
            array = array.map(Number);
            let html = '';
            let maxValue = Math.max(...array);
            array.forEach((ele) => {
                let height = ((ele / maxValue) * 100).toFixed(2);
                html += `<div class="pillar" data-value="${ele}" style="height:${height}%;"></div>`;
            })
            document.getElementById('drawArray').innerHTML = html;
        } catch (error) {
            console.error("Error while creating array", error);
        }
    }

    const visualizeAlgo = () => {
        let selectedAlgo = document.getElementById('select-algo').value;
        swaps = [];
        switch (selectedAlgo) {
            case 'selectionSort':
                Sort.selectionSort(array);
                break;
            case 'bubbleSort':
                Sort.bubbleSort(array);
                break;
            case 'insertionSort':
                Sort.insertionSort(array);
                break;
            case 'quickSort':
                Sort.quickSort(array);
                break;
            case 'mergeSort':
                Sort.mergeSort(array);
                break;
        }

        startAnimation();
    }

    const adjustSpeed = () => {
        output.innerHTML = slider.value;
        speed = (1 / this.value);
    }

    const swapNodes = async (nodeA, nodeB) => {
        nodeA.style.backgroundColor = 'red';
        nodeB.style.backgroundColor = 'red';
        const parentA = nodeA.parentNode;
        const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

        // Move `nodeA` to before the `nodeB`
        nodeB.parentNode.insertBefore(nodeA, nodeB);

        // Move `nodeB` to before the sibling of `nodeA`
        parentA.insertBefore(nodeB, siblingA);

        //sleep for 300ms
        await new Promise(function (resolve) {
            setTimeout(function () {
                resolve();
            }, 300)
        });

        nodeA.style.backgroundColor = 'aqua';
        nodeB.style.backgroundColor = 'aqua';
    }

    const startAnimation = () => {
        let count = 1;
        let domArray = document.getElementsByClassName('pillar');
        swaps.forEach(function (ele) {
            setTimeout(function () {
                swapNodes(domArray[ele[0]], domArray[ele[1]])
            }, count++ * 500 * speed)
        })
    }

    return {
        init: () => {
            output.innerHTML = slider.value;
            document.getElementById('generate').addEventListener('click', showData);
            document.getElementById('visualize').addEventListener('click', visualizeAlgo);
            slider.addEventListener('input', adjustSpeed);
        }
    }
}();

Template.init();
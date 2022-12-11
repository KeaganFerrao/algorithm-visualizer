let array = [];
let swaps = [];
let speed = 0.5;

const Template = function () {
    const slider = document.getElementById("speed");
    const output = document.getElementById("speedValue");
    let type = 'random';

    const showData = () => {
        try {
            if (type === 'custom') {
                array = document.getElementById('custom-value').value.split(',');
                array = array.map(Number);
            } else if (type === 'random') {
                array = [];
                let min = document.getElementById('minValue').value;
                let max = document.getElementById('maxValue').value;
                let count = document.getElementById('count').value;

                for (let i = 0; i < count; i++) {
                    array.push(Math.floor(Math.random() * (max - min + 1) + min));
                }
            }

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

    const adjustSpeed = function () {
        console.log(this.value);
        speed = (1 / this.value);
        console.log(speed);
    }

    const swapNodes = async (nodeA, nodeB) => {
        nodeA.style.backgroundColor = '#ffadad';
        nodeB.style.backgroundColor = '#ffadad';
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

        nodeA.style.backgroundColor = '#ac518bbf';
        nodeB.style.backgroundColor = '#ac518bbf';
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

    const setInputArrayType = function () {
        switch (this.value) {
            case 'custom-array':
                document.getElementById('custom-array-fields').style.display = 'block';
                document.getElementById('random-array-fields').style.display = 'none';
                type = 'custom';
                break;
            case 'random-array':
                document.getElementById('custom-array-fields').style.display = 'none';
                document.getElementById('random-array-fields').style.display = 'block';
                type = 'random';
                break;
            default:
                break;
        }

    }

    return {
        init: () => {
            showData();
            document.getElementById('generate').addEventListener('click', showData);
            document.getElementById('visualize').addEventListener('click', visualizeAlgo);
            slider.addEventListener('input', adjustSpeed);
            document.getElementById('data-type').addEventListener('change', setInputArrayType);
        }
    }
}();

Template.init();
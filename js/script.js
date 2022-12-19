let array = [];
let swaps = [];

const Template = function () {
    const slider = document.getElementById("speed");
    let type = 'random';
    let speed = 250;
    let stopFlag = false;
    let pauseFlag = false;
    let pauseIdx = 0;
    let inProgress = false;

    const showData = () => {
        stopAnimation(true);
        document.getElementById('visualize').disabled = false;
        document.getElementById('playback').value = 0;
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
                    array.push(Math.ceil(Math.random() * (max - min + 1) + min));
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
        stopAnimation(false);
        document.getElementById('visualize').disabled = true;
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

    const play = () => {
        if (!inProgress || !pauseFlag) {
            return;
        }
        pauseFlag = false;
        startAnimation(pauseIdx);
    }

    const pause = () => {
        if (!inProgress) {
            return;
        }
        pauseFlag = true;
    }

    const adjustSpeed = function () {
        speed = 550 - (this.value) * 5;
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

        await new Promise(function (resolve) {
            setTimeout(function () {
                resolve();
            }, speed);
        });

        nodeA.style.backgroundColor = '#ac518bbf';
        nodeB.style.backgroundColor = '#ac518bbf';
        
        //Update playback slider value 
        document.getElementById('playback').value = (parseFloat(document.getElementById('playback').value) + parseFloat((100 / swaps.length).toFixed(2)));
    }

    const startAnimation = async (idx = 0) => {
        inProgress = true;
        let domArray = document.getElementsByClassName('pillar');
        for (let i = idx; i < swaps.length; i++) {
            if (stopFlag) {
                document.getElementById('visualize').disabled = false;
                return;
            }
            if (pauseFlag) {
                pauseIdx = i;
                domArray[swaps[pauseIdx][0]].style.backgroundColor = '#ffadad';
                domArray[swaps[pauseIdx][1]].style.backgroundColor = '#ffadad';
                return;
            }
            await swapNodes(domArray[swaps[i][0]], domArray[swaps[i][1]]);
        }
        document.getElementById('visualize').disabled = false;
        swaps = [];
        pauseIdx = 0;
        inProgress = false;
    }

    const stopAnimation = (value) => {
        stopFlag = value;
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
            document.getElementById('play').addEventListener('click', play);
            document.getElementById('pause').addEventListener('click', pause);
        }
    }
}();

Template.init();
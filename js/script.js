let array = [];
let swaps = [];

const Template = function () {
    let type = 'random';
    let speed = 250;
    let stopFlag = false;
    let pauseFlag = false;
    let pauseIdx = [];
    let inProgress = [];

    const closeRegion = function (self) {
        self.parentNode.remove();
        showData();
        if (document.getElementsByClassName('drawArray').length === 1) {
            document.getElementsByClassName('select-algo')[0].disabled = false;
        }
    }

    const showData = () => {
        const drawArea = document.getElementsByClassName('drawArray');
        const dropDownString = `<select class='select-algo-compare' style='position:absolute;top:0;left:0'>
                                    <option value="selectionSort">Selection Sort</option>
                                    <option value="bubbleSort">Bubble Sort</option>
                                    <option value="insertionSort">Insertion Sort</option>
                                    <option style="display: none;" value="mergeSort">Merge Sort</option>
                                    <option value="quickSort">Quick Sort</option>
                                </select>`;

        const closeButton = `<button onclick="Template.closeRegion(this)" style='position:absolute; top:0;right:0;'>X</button>`;
        stopAnimation(true);
        document.getElementById('visualize').disabled = false;
        document.getElementById('playback').value = 0;
        swaps = [];
        pauseIdx = [];
        inProgress = [];
        pauseFlag = false;

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


            for (let i = 0; i < drawArea.length; i++) {
                const domNode = drawArea[i];
                if (drawArea.length == 1) {
                    domNode.innerHTML = html;
                    document.getElementsByClassName('drawArray')[0].style.width = 'calc(100% - 20px)';
                } else {
                    domNode.innerHTML = html + dropDownString + closeButton;
                }
            }

        } catch (error) {
            console.error("Error while creating array", error);
        }
    }

    const visualizeAlgo = async () => {
        const selectedAlgoArray = [];
        stopAnimation(false);
        document.getElementById('visualize').disabled = true;

        if (!document.getElementsByClassName('select-algo')[0].disabled) {
            const selectedAlgo = document.getElementsByClassName('select-algo')[0].value;
            selectedAlgoArray.push(selectedAlgo);
        } else {
            const selectedAlgos = document.getElementsByClassName('select-algo-compare');
            for (let i = 0; i < selectedAlgos.length; i++) {
                selectedAlgoArray.push(selectedAlgos[i].value);
            }
        }

        swaps = [];
        selectedAlgoArray.forEach((algo, idx) => {
            switch (algo) {
                case 'selectionSort':
                    Sort.selectionSort([...array], idx);
                    break;
                case 'bubbleSort':
                    Sort.bubbleSort([...array], idx);
                    break;
                case 'insertionSort':
                    Sort.insertionSort([...array], idx);
                    break;
                case 'quickSort':
                    Sort.quickSort([...array], idx);
                    break;
                case 'mergeSort':
                    Sort.mergeSort([...array], idx);
                    break;
            }
        })

        const domArrayLength = document.getElementsByClassName('pillar').length;

        for (let i = 0; i < swaps.length; i++) {
            const DOMElements = [];
            const start = i * (domArrayLength / swaps.length);

            for (let j = start; j < start + (domArrayLength / swaps.length); j++) {
                DOMElements.push(document.getElementsByClassName('pillar')[j]);
            }
            startAnimation(swaps[i], DOMElements, 0, i);
        }
    }

    const play = () => {
        if (!inProgress.some(Boolean) || !pauseFlag) {
            return;
        }
        pauseFlag = false;
        const domArrayLength = document.getElementsByClassName('pillar').length;
        for (let i = 0; i < swaps.length; i++) {
            const DOMElements = [];
            const start = i * (domArrayLength / swaps.length);

            for (let j = start; j < start + (domArrayLength / swaps.length); j++) {
                DOMElements.push(document.getElementsByClassName('pillar')[j]);
            }
            startAnimation(swaps[i], DOMElements, pauseIdx[i], i);
        }
    }

    const pause = () => {
        if (!inProgress.some(Boolean)) {
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

    const startAnimation = async (swapsI, domArray, idx = 0, position = 0) => {
        inProgress[position] = true;
        for (let i = idx; i < swapsI.length; i++) {
            if (stopFlag) {
                document.getElementById('visualize').disabled = false;
                return;
            }
            if (pauseFlag) {
                pauseIdx[position] = i;
                domArray[swapsI[pauseIdx[position]][0]].style.backgroundColor = '#ffadad';
                domArray[swapsI[pauseIdx[position]][1]].style.backgroundColor = '#ffadad';
                return;
            }
            //Swap elements in array
            [domArray[swapsI[i][0]], domArray[swapsI[i][1]]] = [domArray[swapsI[i][1]], domArray[swapsI[i][0]]];
            await swapNodes(domArray[swapsI[i][0]], domArray[swapsI[i][1]]);
        }

        swaps[position] = [];
        pauseIdx[position] = 0;
        inProgress[position] = false;
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

    const playbackChange = function () {
        console.log(this.value);
    }

    const compareAlgorithm = () => {
        const container = document.getElementById('compare-container');
        const htmlString = document.getElementsByClassName('drawArray')[0].innerHTML;
        const dropDownString = `<select class="select-algo-compare" style='position:absolute;top:0;left:0'>
                                    <option value="selectionSort">Selection Sort</option>
                                    <option value="bubbleSort">Bubble Sort</option>
                                    <option value="insertionSort">Insertion Sort</option>
                                    <option style="display: none;" value="mergeSort">Merge Sort</option>
                                    <option value="quickSort">Quick Sort</option>
                                </select>`;
        container.insertAdjacentHTML('beforeend', "<div class='drawArray'>" + dropDownString + htmlString + "</div>");

        for (let i = 0; i < document.getElementsByClassName('drawArray').length; i++) {
            const element = document.getElementsByClassName('drawArray')[i];
            element.style.width = '50%';
            element.style.border = '2px solid #6A1B4D';
        }
        document.getElementById('compare-container').style.flexDirection = 'row';

        document.getElementsByClassName('select-algo')[0].disabled = true;

        for (let j = 0; j < document.getElementsByClassName('select-algo-compare').length; j++) {
            document.getElementsByClassName('select-algo-compare')[j].style.display = 'inline';
        }
        showData();
    }

    return {
        init: () => {
            showData();
            document.getElementById('generate').addEventListener('click', showData);
            document.getElementById('visualize').addEventListener('click', visualizeAlgo);
            document.getElementById("speed").addEventListener('input', adjustSpeed);
            document.getElementById('data-type').addEventListener('change', setInputArrayType);
            document.getElementById('play').addEventListener('click', play);
            document.getElementById('pause').addEventListener('click', pause);
            document.getElementById('playback').addEventListener('input', playbackChange);
            document.getElementById('compare').addEventListener('click', compareAlgorithm);
        },
        closeRegion: (self) => {
            closeRegion(self);
        }
        
    }
}();

Template.init();
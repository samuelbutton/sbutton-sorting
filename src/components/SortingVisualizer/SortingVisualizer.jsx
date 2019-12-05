import React from 'react';
import Alert from '../Alert/Alert';
import {mergesort} from '../../algorithms/mergesort.js';
import {quicksort} from '../../algorithms/quicksort.js';
import {heapsort} from '../../algorithms/heapsort.js';
import {bubblesort} from '../../algorithms/bubblesort.js';
import './SortingVisualizer.css';

const PRIMARY_COLOR = 'turquoise';
const SECONDARY_COLOR = 'red';
const TERTIARY_COLOR = 'green';

const NODE_WIDTH = 25;
const NODE_HEIGHT= 25;
let alertHandler;

export default class SortingVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    const [maxHeight, numBars, barWidth, animationSpeed] = this.updateDimensions();
    this.state = {
      array: [],
      maxHeight: maxHeight,
      numBars: numBars,
      barWidth: barWidth,
      animationSpeed: animationSpeed,
      visualizationRunning: false,
      algorithm: undefined,
      showAlertBox: false
    };
    alertHandler = props.alertHandler;
  }

  updateDimensions() {
    let newDimensions = [];
    // to be updated
    newDimensions.push(700);
    newDimensions.push(100);
    newDimensions.push("2px");
    newDimensions.push(20);
    // let numberOfRows = Math.floor((window.innerHeight-100)/NODE_HEIGHT);
    // let numberOfCols = Math.floor((window.innerWidth-60)/NODE_WIDTH);
    return newDimensions;
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    if (this.state.visualizationRunning) return;
    this.updateWindowDimensions();
    this.resetArray();
    const [maxHeight, numBars, barWidth, animationSpeed] = this.updateDimensions();

    this.setState({ 
      maxHeight, 
      numBars, 
      barWidth, 
      animationSpeed
    });
  }

  resetArray() {
    const array = [];
    for (let i = 0; i < this.state.numBars; i++) {
      array.push(randomIntFromInterval(5, this.state.maxHeight));
    }
    this.setState({array});
  }

  lockInteractions() {
    this.setState({visualizationRunning: true});
    const {maxHeight, numBars, barWidth, animationSpeed} = this.state;
    const clearButtons = document.getElementsByClassName("clearButton");
    for (const button of clearButtons)
      button.style.color = '#fa923f';
    const select = document.getElementsByClassName("selector")[0];
    select.style.color = '#fa923f';
    select.disabled = true;
    const container = document.getElementsByClassName('array-container')[0];
    container.style['min-height'] = "" + (maxHeight + 150) + "px";
    container.style['min-width'] = "" + (barWidth * numBars + 100) + "px";
    const vizButton = document.getElementsByClassName('vizButton')[0];
    vizButton.style.color = '#521751';
  }

  unlockInteractions() {
    this.setState({visualizationRunning: false});
    const clearButtons = document.getElementsByClassName("clearButton");
    for (const button of clearButtons)
      button.style.color = 'white';
    const selectors = document.getElementsByClassName("selector");
    for (const selector of selectors) {   
      selector.style.color = 'white';
      selector.disabled = false;
    }
    const container = document.getElementsByClassName('array-container')[0];
    container.style['min-height'] = "";
    container.style['min-width'] = "";
    const vizButton = document.getElementsByClassName('vizButton')[0];
    vizButton.style.color = '#521751';
  }

  setAlgorithm(algorithm) {
    switch (algorithm) {
      case 'quicksort':
        this.setState({algorithm: quicksort});
        break;
      case 'mergesort':
        this.setState({algorithm: mergesort});
        break;
      case 'heapsort':
        this.setState({algorithm: heapsort});
        break;
      case 'bubblesort':
        this.setState({algorithm: bubblesort});
        break;
      default:
        this.setState({showAlertBox: true});
        return;
    }
    // this.clearVisualization(false);
    const initSelection = document.getElementsByClassName('initialSelection');
    initSelection[0].style.display = 'none';
    const vizButton = document.getElementsByClassName('vizButton');
    vizButton[0].style.background = 'yellow';
    vizButton[0].style.color = '#521751';
    const selection = document.getElementsByClassName('selector');
    selection[0].style.color = 'white';
  }

  animateArray(array, delay, classname) {
    // 1. change 1 bar to green, second is height, if not null
    // 2. highlight two bars with secondary
    // 3. change single bar back to primary
    // 4. switch heights and change back to primary
    let i = 0;
    for (const node of array) {
      setTimeout(() => {
         if (!node.isFinish && !node.isStart)
           document.getElementById(`node-${node.row}-${node.col}`).className = classname;
      }, delay * i++);
    }
    // change color of all bars to green
  }

  alertCloseHandler = () => {
    alertHandler();
    this.setState({showAlertBox: false});
  };

  async visualizeAlgorithm(animate) {
    if (this.state.visualizationRunning) return;
    if (this.state.algorithm === undefined) {
      alertHandler();
      this.setAlgorithm();
      return;
    }
    await this.lockInteractions();
    const {array, algorithm} = this.state;
    const [animations, newArray] = await algorithm(array);

    for (let i = 0; i < animations.length; i++) {

      const arrayBars = document.getElementsByClassName('array-bar');
      const isColorChange = i % 3 !== 2;
      if (isColorChange) {
        const [barOneIdx, barTwoIdx] = animations[i];
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;
        const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
        setTimeout(() => {
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        }, i * this.state.animationSpeed);
      } else {
        setTimeout(() => {
          const [barOneIdx, newHeight] = animations[i];
          const barOneStyle = arrayBars[barOneIdx].style;
          barOneStyle.height = `${newHeight}px`;
        }, i * this.state.animationSpeed);
      }
      
    }

    setTimeout(() => {
        this.setState({array: newArray});
    }, animations.length * this.state.animationSpeed); 
  }

  // quickSort() {
  //   let auxArray = this.state.array.slice()
  //   const animations = getQuickSortAnimations(auxArray);
  //   for (let i = 0; i < animations.length; i++) {
  //     const arrayBars = document.getElementsByClassName('array-bar');
  //     const [legend, barOneIdx, barTwoIdx] = animations[i];
  //     let isPartitionChange = legend === 1;
  //     if (isPartitionChange) {
  //       const barOneStyle = arrayBars[barOneIdx].style;
  //       setTimeout(() => {
  //         barOneStyle.backgroundColor = TERTIARY_COLOR;
  //       }, i * ANIMATION_SPEED_MS);
  //     } else {
  //       let isBarExchange = legend === 2;
  //       let color = isBarExchange ? SECONDARY_COLOR : PRIMARY_COLOR;
  //       const barOneStyle = arrayBars[barOneIdx].style;
  //       const barTwoStyle = arrayBars[barTwoIdx].style;
  //       setTimeout(() => {
  //         barOneStyle.backgroundColor = color;
  //         barTwoStyle.backgroundColor = color;
  //       }, i * ANIMATION_SPEED_MS);
  //       if (isBarExchange)
  //         setTimeout(() => {
  //           let temp = barOneStyle.height;
  //           barOneStyle.height = barTwoStyle.height;
  //           barTwoStyle.height = temp;
  //         }, i * ANIMATION_SPEED_MS);
  //     }
  //   }
  //   setTimeout(() => {
  //       const newArray = getQuickSortArray(auxArray);
  //       this.setState({array: newArray});
  //   }, animations.length * ANIMATION_SPEED_MS);
  // }

  // heapSort() {
  //   let auxArray = this.state.array.slice()
  //   const animations = getHeapSortAnimations(auxArray);
  //   for (let i = 0; i < animations.length; i++) {
  //     const arrayBars = document.getElementsByClassName('array-bar');
  //     const [isBuild, barOneIdx, barTwoIdx] = animations[i];
  //     let isHeapBuild = isBuild === 1, isBarExchange = i % 2 === 0;
  //     let color;
  //     if (isHeapBuild) color = isBarExchange ? TERTIARY_COLOR : PRIMARY_COLOR;
  //     else color = isBarExchange ? SECONDARY_COLOR : PRIMARY_COLOR;
  //     const barOneStyle = arrayBars[barOneIdx].style;
  //     const barTwoStyle = arrayBars[barTwoIdx].style;
  //     setTimeout(() => {
  //       barOneStyle.backgroundColor = color;
  //       barTwoStyle.backgroundColor = color;
  //     }, i * ANIMATION_SPEED_MS);
  //     if (isBarExchange)
  //       setTimeout(() => {
  //         let temp = barOneStyle.height;
  //         barOneStyle.height = barTwoStyle.height;
  //         barTwoStyle.height = temp;
  //       }, i * ANIMATION_SPEED_MS);
  //   }
  //   setTimeout(() => {
  //       const newArray = getHeapSortArray(auxArray);
  //       this.setState({array: newArray});
  //   }, animations.length * ANIMATION_SPEED_MS);
  // }

  // bubbleSort() {
    
  // }

  // testSortingAlgorithms() {
  //   for (let i = 0; i < 100; i++) {
  //     const array = [];
  //     const length = randomIntFromInterval(1, 1000);
  //     for (let i = 0; i < length; i++) {
  //       array.push(randomIntFromInterval(-1000, 1000));
  //     }
  //     const javaScriptSortedArray = array.slice().sort((a, b) => a - b);
  //     const mergeSortedArray = getMergeSortArray(array.slice());
  //     const quickSortedArray = getQuickSortArray(array.slice());
  //     const heapSortedArray = getHeapSortArray(array.slice());
  //     console.log(arraysAreEqual(javaScriptSortedArray, heapSortedArray));
  //   }
  // }

  render() {
    const {array, showAlertBox} = this.state;
    let alertBox;
    if (showAlertBox) alertBox = <Alert click={this.alertCloseHandler}/>

    return (
      <>
      {alertBox}
      <div className="array-container">
        {array.map((value, idx) => (
          <div
            className="array-bar"
            key={idx}
            style={{
              backgroundColor: PRIMARY_COLOR,
              height: `${value}px`,
            }}></div>
        ))}       
      </div>
      <div className="menu-container">
       <button onClick={() => this.resetArray()}>Generate New Array</button>
        <button onClick={() => this.quickSort()}>Quick Sort</button>
        <button onClick={() => this.mergeSort()}>Merge Sort</button>
        <button onClick={() => this.bubbleSort()}>Bubble Sort</button>    
        <button onClick={() => this.heapSort()}>Heap Sort</button>
        
        <button onClick={() => this.testSortingAlgorithms()}>
          Test Sorting Algorithms (BROKEN)
        </button>
      </div>
      </>
    );
  }
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function arraysAreEqual(arrayOne, arrayTwo) {
  if (arrayOne.length !== arrayTwo.length) return false;
  for (let i = 0; i < arrayOne.length; i++) {
    if (arrayOne[i] !== arrayTwo[i]) {
      return false;
    }
  }
  return true;
}

const getShortestPathOrder = (finishNode) => {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
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
      visualizationDisplayed: false,
      algorithm: undefined,
      showAlertBox: false
    };
    alertHandler = props.alertHandler;
  }

  updateDimensions() {
    let windowHeight = window.innerHeight;
    let windowWidth = window.innerWidth;
    let newDimensions = [];
    newDimensions.push(windowHeight - 100);
    let add = windowWidth > 1000 ? 100 : 0;
    newDimensions.push(windowWidth/40+add);
    newDimensions.push(Math.min((425)/(newDimensions[1]), 50));
    add = windowWidth > 1000 ? 0 : newDimensions[2]*10;
    newDimensions.push(newDimensions[2]+add);

    return newDimensions;
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    if (this.state.visualizationRunning) return;
    // this.updateWindowDimensions();
    this.resetArray();
    const [maxHeight, numBars, barWidth, animationSpeed] = this.updateDimensions();
    const arrayBars = document.getElementsByClassName('array-bar');
    for (let i = 0; i < arrayBars.length; i++) {
      const barStyle = arrayBars[i].style;
      barStyle.width = `${barWidth}px`;
    }
    this.setState({ 
      maxHeight, 
      numBars, 
      barWidth, 
      animationSpeed
    });
  }

  resetArray() {
    if (this.state.visualizationRunning) return;
    const arrayBars = document.getElementsByClassName('array-bar');
    for (let i = 0; i < arrayBars.length; i++) {
      const barStyle = arrayBars[i].style;
      barStyle.backgroundColor = PRIMARY_COLOR;
    }
    const array = [];
    for (let i = 0; i < this.state.numBars; i++) {
      array.push(randomIntFromInterval(5, this.state.maxHeight));
    }
    this.setState({array, visualizationDisplayed: false});
  }

  lockInteractions() {
    this.setState({visualizationRunning: true, visualizationDisplayed: true});
    const {maxHeight, numBars, barWidth} = this.state;
    const clearButtons = document.getElementsByClassName("clearButton");
    for (const button of clearButtons)
      button.style.color = '#fa923f';
    const select = document.getElementsByClassName("selector")[0];
    select.style.color = '#fa923f';
    select.disabled = true;
    const container = document.getElementsByClassName('array-container')[0];
    container.style['min-height'] =  `${maxHeight + 150}px`;
    container.style['min-width'] = `${barWidth * numBars + 100}px`;
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

  alertCloseHandler = () => {
    alertHandler();
    this.setState({showAlertBox: false});
  };

  async visualizeAlgorithm() {
    if (this.state.visualizationRunning) return;
    if (this.state.algorithm === undefined) {
      alertHandler();
      this.setAlgorithm();
      return;
    }
    // this.updateWindowDimensions();
    if (this.state.visualizationDisplayed) await this.resetArray();
    await this.lockInteractions();
    const {array, algorithm} = this.state;
    const [animations, newArray] = await algorithm(array);

    // 1. change 1 bar to green, second is height, if not null
    // 2. highlight two bars with secondary
    // 3. change single bar back to primary
    // 4. switch heights and change back to primary
    
    let arrayBars;
    for (let i = 0; i < animations.length; i++) {
      const [key, barOneIdx, barTwoIdx] = animations[i];
      arrayBars = document.getElementsByClassName('array-bar');
      let barOneStyle;
      let barTwoStyle;
      switch (key) {
        case 1:
          barOneStyle = arrayBars[barOneIdx].style;
          setTimeout(() => {
            if (barTwoIdx !== null) {
              barOneStyle.height = `${barTwoIdx}px`;
              barOneStyle.backgroundColor = SECONDARY_COLOR;
            } else barOneStyle.backgroundColor = TERTIARY_COLOR;
          }, i * this.state.animationSpeed);
          break;
        case 2:
          barOneStyle = arrayBars[barOneIdx].style;
          barTwoStyle = arrayBars[barTwoIdx].style;
          setTimeout(() => {
            barOneStyle.backgroundColor = SECONDARY_COLOR;
            barTwoStyle.backgroundColor = SECONDARY_COLOR;
          }, i * this.state.animationSpeed);
          break;
        case 3:
          barOneStyle = arrayBars[barOneIdx].style;
          setTimeout(() => {
            barOneStyle.backgroundColor = PRIMARY_COLOR;
          }, i * this.state.animationSpeed);
          break;
        case 4:
          barOneStyle = arrayBars[barOneIdx].style;
          barTwoStyle = arrayBars[barTwoIdx].style;
          setTimeout(() => {
            barOneStyle.backgroundColor = PRIMARY_COLOR;
            barTwoStyle.backgroundColor = PRIMARY_COLOR;
            let temp = barOneStyle.height;
            barOneStyle.height = barTwoStyle.height;
            barTwoStyle.height = temp;
          }, i * this.state.animationSpeed);
          break;
        default:
          break;
      }
    }

    setTimeout(() => {
      this.setState({array: newArray});
      for (let i = 0; i < arrayBars.length; i++) {
          const barStyle = arrayBars[i].style;
          barStyle.backgroundColor = TERTIARY_COLOR;
      }
      this.unlockInteractions();
    }, animations.length * this.state.animationSpeed); 
    
  }

  testSortingAlgorithms() {
    for (let i = 0; i < 100; i++) {
      const array = [];
      const length = randomIntFromInterval(1, 1000);
      for (let i = 0; i < length; i++) {
        array.push(randomIntFromInterval(-1000, 1000));
      }
      const javaScriptSortedArray = array.slice().sort((a, b) => a - b);
      const [,] = mergesort(array.slice());
      const [,] = quicksort(array.slice());
      const [,] = heapsort(array.slice());
      const [,bubbleSortedArray] = bubblesort(array.slice());
      console.log(arraysAreEqual(javaScriptSortedArray, bubbleSortedArray));
    }
  }

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
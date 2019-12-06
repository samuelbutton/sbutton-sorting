import React, {Component} from 'react';
import './App.css';
import SortingVisualizer from '../SortingVisualizer/SortingVisualizer'
import Toolbar from '../Toolbar/Toolbar'
import SideDrawer from '../SideDrawer/SideDrawer'
import Backdrop from '../Backdrop/Backdrop'

class App extends Component {
  constructor(props) {
    super(props);
    this.sortingElement = React.createRef();
  }

  state = {
    sideDrawerOpen: false,
    alertOpen: false,
    selection: undefined,
  };

  drawerToggleClickHandler = () => {
    this.setState((prevState) => {
      return {sideDrawerOpen: !prevState.sideDrawerOpen};
    });
  };
  alertToggleHandler = (adjustSideDrawer) => {
    if (adjustSideDrawer) {
      this.setState((prevState) => {
        return {sideDrawerOpen: !prevState.sideDrawerOpen};
      });
    } else {
      this.setState((prevState) => {
        return {alertOpen: !prevState.alertOpen};
      });
    }
  };
  backdropClickHandler = () => {
    this.setState({sideDrawerOpen: false});
    if (this.state.alertOpen) this.sortingElement.current.alertCloseHandler();
  };
  visualClickHandler = () => {
    this.setState({sideDrawerOpen: false, alertOpen: false});
    this.sortingElement.current.visualizeAlgorithm();
  };
  clearVizClickHandler = () => {
    this.setState({sideDrawerOpen: false, alertOpen: false});
    this.sortingElement.current.resetArray();
  };
  selectionChangeHandler = (event) => {
    this.sortingElement.current.setAlgorithm(event.target.value);
    this.setState({selection: event.target.value});
  };
  rangeChangeHandler = (event) => {
    this.sortingElement.current.setRangeValue(event.target.value);
  };

  render() {
    let backdrop;
    if (this.state.sideDrawerOpen || this.state.alertOpen) {
      backdrop = <Backdrop click={this.backdropClickHandler}/>;
    }
    return (
      <div className="App" style={{height: '100%'}}>
        <Toolbar drawerClickHandler={this.drawerToggleClickHandler} vizClickHandler={this.visualClickHandler} 
        clearClickHandler={this.clearVizClickHandler} changeHandler={this.selectionChangeHandler} 
         rangeHandler={this.rangeChangeHandler}/>
        <SideDrawer show={this.state.sideDrawerOpen} vizClickHandler={this.visualClickHandler} 
        clearClickHandler={this.clearVizClickHandler} changeHandler={this.selectionChangeHandler}
        selection={this.state.selection}/>
        {backdrop}
        
        <main style={{marginTop: '64px'}}>
          <SortingVisualizer className='sortViz' ref={this.sortingElement} 
          alertHandler={this.alertToggleHandler} />
        </main>
      </div>
    );
  }
}

export default App;
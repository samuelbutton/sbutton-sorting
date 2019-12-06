import React from 'react';

import DrawerToggleButton from '../SideDrawer/DrawerToggleButton';
import './Toolbar.css';

const toolbar = props => (
	<header className="toolbar">
		<nav className ="toolbar_navigation">
			<div className="toolbar_toggle-button">
				<DrawerToggleButton click={props.drawerClickHandler}/>
			</div>
			<div className="toolbar_logo clearButton"><button onClick={props.clearClickHandler}>Sorting Visualizer</button></div>
			
			<div className="toolbar_navigation-items">
				<ul>
					<li>
						<select className="selector" onChange={props.changeHandler}>
							<option className="initialSelection" value="init">[Choose Algorithm]</option>
							<option value="quicksort">Quicksort</option>
							<option value="mergesort">Mergesort</option>
							<option value="heapsort">Heapsort</option>
							<option value="bubblesort">Bubblesort</option>
						</select>
					</li>
						
					<li><button  className="vizButton" onClick={props.vizClickHandler}>Visualize!</button></li>
					<li><button  className="clearButton" onClick={props.clearClickHandler}>Generate New Array</button></li>
				</ul>
			</div>
			<div className="spacer" />
			<a href="https://github.com/scbutton95/sbutton-sorting" 
			className="button github-button">View on Github</a>
		</nav>
	</header>
	);

export default toolbar;
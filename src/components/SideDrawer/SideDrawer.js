import React from 'react';

import './SideDrawer.css';

const sideDrawer = props => {
	let drawerClasses = 'side-drawer';
	if (props.show) {
		drawerClasses = 'side-drawer open';
	}
	let initalValue = '[Choose Algorithm]';
	if (props.selection !== undefined) initalValue = props.selection;
	return (
		<nav className={drawerClasses}>
			<ul>
				<li>
					<select onChange={props.changeHandler} value={initalValue}>
						<option className="initialSelection" value="init">[Choose Algorithm]</option>
						<option value="quicksort">Quicksort</option>
						<option value="mergesort">Mergesort</option>
						<option value="heapsort">Heapsort</option>
						<option value="bubblesort">Bubblesort</option>
					</select>
				</li>
				<li><button onClick={props.vizClickHandler}>Visualize!</button></li>
				<li><button onClick={props.clearClickHandler}>Clear Visualization</button></li>
			</ul>
		</nav>
		// maybe add shell sort
	);
};

export default sideDrawer;

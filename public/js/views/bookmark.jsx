import React from "react";
import { Row,Tab,Nav,NavItem,Col,Table } from 'react-bootstrap';

export class BookmarkComponent extends React.Component {

	// componentDidMount() {
	// 	console.log("mounting happened")
	//     // Whenever there may be a change in the Backbone data, trigger a reconcile.
	//     this.getBackboneModels().forEach(function(model) {
	//       model.on('add change remove', this.forceUpdate.bind(this, null), this);
	//     }, this);
	// }

	// componentWillUnmount() {
	// 	// Ensure that we clean up any dangling references when the component is
	// 	// destroyed.
	// 	console.log("unmounting.")
	// 	this.getBackboneModels().forEach(function(model) {
	// 	  model.off(null, null, this);
	// 	}, this);
	// }

	getBackboneModels() {
		return [this.props.folderModel]
	}


	render() {
		let folderModel = this.props.folderModel;

		return (
			<div>
				<Tab.Content animation>
			          <Tab.Pane eventKey={folderModel.attributes.name}>
			            {folderModel.attributes.bookmarks.map((bookmark) => {
			            	return (
			            		<div key={bookmark._id}>
			            			<b>id :</b><p>{bookmark._id}</p>
			            			<b>name :</b><p>{bookmark.name}</p>
			            			<b>url :</b><p>{bookmark.url}</p>
			            			<hr />
			            		</div>)
			            })}
			          </Tab.Pane>
			    </Tab.Content>
		    </div>)
	}
}

export default BookmarkComponent;
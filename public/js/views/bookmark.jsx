import React from "react";
import { Row,Tab,Nav,NavItem,Col,Table } from 'react-bootstrap';

export class BookmarkComponent extends React.Component {
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
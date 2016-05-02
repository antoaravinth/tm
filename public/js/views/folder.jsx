import React from "react";
import { Row,Tab,Nav,NavItem,Col,Table } from 'react-bootstrap';
import {BookmarkComponent} from './bookmark.jsx';

export class FolderComponent extends React.Component {

	componentDidMount() {
	    // Whenever there may be a change in the Backbone data, trigger a reconcile.
	    this.getBackboneModels().forEach(function(model) {
	      model.on('add change remove', this.forceUpdate.bind(this, null), this);
	    }, this);
	}

	componentWillUnmount() {
		// Ensure that we clean up any dangling references when the component is
		// destroyed.
		this.getBackboneModels().forEach(function(model) {
		  model.off(null, null, this);
		}, this);
	}

	getBackboneModels() {
		return [this.props.folders]
	}

	render() {
		this.props.folders.forEach((folderModel) => console.log(folderModel.attributes))

		return (<div>
			<Tab.Container id="left-tabs-example" defaultActiveKey="first">
		    <Row className="clearfix">
		      <Col sm={4}>
		      {this.props.folders.map((folderModel) => {
	      		return (
      			<Nav bsStyle="pills" stacked key={folderModel.attributes._id}>
		          <NavItem eventKey={folderModel.attributes.name}>
		            {folderModel.attributes.name}
		          </NavItem>
		        </Nav>)
		      })}
		      </Col>
		      <Col sm={8}>
		      {this.props.folders.map((folderModel) => {
		      	return (<BookmarkComponent folderModel={folderModel} key={folderModel.attributes._id}/>)
		       })}	
		      </Col>
		    </Row>
		  </Tab.Container>
		</div>);
	}
}

export default FolderComponent; 	

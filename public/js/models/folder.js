import Backbone from 'backbone'

var { Model, View, Collection, Router, LocalStorage } = Backbone;

class Folder extends Model {

  // *Define some default attributes for the todo.*
  defaults() {
    return {
      name : "",
      url : ""
    };
  }
}
export default Folder
import React from 'react';
import ReactDOM from 'react-dom';
import GXHR from './graphql-http';
const gxhr = new GXHR();

class User extends React.Component {
  addTask(){
    this.props.addTask(this.refs.newTask.value, this.props.user.id);
    this.refs.newTask.value = '';
  }
  render(){
    return (
      <div className="user row">
        <div className="col-xs-12">
          <div className="panel panel-info">
            <div className="panel-heading"><h2>{this.props.user.name}</h2></div>
            <div className="input-group">
              <input ref="newTask" type="text" className="form-control" placeholder="Add Task" />
              <span className="input-group-btn">
                <button className="btn btn-info" type="button" onClick={this.addTask.bind(this)}>Add Task</button>
              </span>
            </div>
            <Tasks addTask={this.props.addTask} tasks={this.props.user.tasks} userId={this.props.user.id} />
          </div>
        </div>
      </div>
    );
  }
}

class Tasks extends React.Component {
  render(){
    return (
      <ul className="list-group">
        {this.props.tasks.map(task => <Task key={task.id} task={task} />)}
      </ul>
    )
  }
}

const Task = (props) =>
    <li className="list-group-item">{props.task.title}</li>


class App extends React.Component {
  constructor(){
    super();
    this.state = {users: []}
  }
  componentWillMount(){
    this.getUsers()
  }

  getUsers(){
    gxhr.send(`{users {id,name, tasks{id, title}}}`, (json) => {
      if(json.data){
        this.setState({users: json.data.users})
      }
    });
  }

  addUser(){
    let val = this.refs.newUser.value;
    let query =  `mutation {addUser(name: "${val}") {id}}`
     gxhr.send(query, (json) => {
        if(json.data){
          this.refs.newUser.value = '';
          this.getUsers();
        }
      });
  }

  addTask(title, userId){
    let val = this.refs.newUser.value;
    let query =  `mutation {addTask(title: "${title}", userId: ${userId}) {id}}`
     gxhr.send(query, (json) => {
        if(json.data){
          this.refs.newUser.value = '';
          this.getUsers();
        }
      });
  }

  render(){
    return (
      <div>
        {this.state.users.map(user => <User addTask={this.addTask.bind(this)} key={user.id} user={user} />)}
        <div className="panel panel-success">
            <div className="panel-heading"><h4>Add New User</h4></div>
            <div className="input-group">
            <input ref="newUser" type="text" className="form-control" placeholder="Add User" />
              <span className="input-group-btn">
                <button className="btn btn-success" type="button" onClick={this.addUser.bind(this)}>Add User</button>
              </span>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));

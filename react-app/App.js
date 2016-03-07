import React from 'react';
import ReactDOM from 'react-dom';
import GXHR from './graphql-http';
const gxhr = new GXHR();

/**
 * User Component
 */
class User extends React.Component {
  addTask(e){
    e.preventDefault();
    this.props.addTask(this.refs.newTask.value, this.props.user.id);
    this.refs.newTask.value = '';
  }
  render(){
    return (
      <Panel css="panel-info" title={this.props.user.name}>
        <form onSubmit={this.addTask.bind(this)}>
          <div className="input-group">
          <input ref="newTask"
              type="text"
              className="form-control"
              placeholder="enter task title" />
          <span className="input-group-btn">
            <Button css="btn-info">Add Task</Button>
          </span>
        </div>
        </form>
        <Tasks
          addTask={this.props.addTask}
          removeTask={this.props.removeTask}
          tasks={this.props.user.tasks}
          userId={this.props.user.id} />
      </Panel>
    );
  }
}

/**
 * Button Component
 */
const Button = (props) =>
  <button
    className={'btn ' + props.css}
    onClick={props.clickHandler}>
      {props.children}
  </button>

/**
 * Panel Component
 */
const Panel = (props) =>
  <div className="user row">
    <div className="col-xs-12">
      <div className={'panel ' + props.css}>
      <div className="panel-heading"><h2>{props.title}</h2></div>
        {props.children}
      </div>
    </div>
  </div>


/**
 * Tasks Component
 */
class Tasks extends React.Component {
  render(){
    return (
      <table className="table table-hover">
        <tbody>
        {this.props.tasks.map(task => <Task
          removeTask={this.props.removeTask}
          key={task.id}
          task={task} />
        )}
        </tbody>
      </table>
    )
  }
}

/**
 * Task Component
 */
const Task = (props) =>
    <tr>
      <td className="col-xs-1">
        <Button
          clickHandler={props.removeTask.bind(null, props.task.id)}
          css="btn-xs btn-danger">
          <span
            className="glyphicon glyphicon-glyphicon glyphicon-remove-circle">
          </span>
        </Button>
      </td>
      <td className="col-xs-11">
        {props.task.title}
      </td>
    </tr>

/**
 * App Component
 */
class App extends React.Component {
  constructor(){
    super();
    this.state = {users: []}
  }
  componentWillMount(){
    this.getUsers()
  }

  getUsers(){
    gxhr.query(`{users {id,name, tasks{id, title}}}`).then(
      json => this.setState({users: json.data.users}),
      json => console.error(json)
    )
  }

  addUser(e){
    e.preventDefault();
    let val = this.refs.newUser.value;
    if(val){
      gxhr.mutate(`{addUser(name: "${val}") {id}}`).then(
        json => {this.refs.newUser.value = ''; this.getUsers()},
        json => console.error(json)
      )
    }
    else {
      alert('User name required')
    }

  }

  addTask(title, userId){
    if(title){
      gxhr.mutate(`{addTask(title: "${title}", userId: ${userId}) {id}}`).then(
        json => this.getUsers(),
        json => console.error(json)
      )
    }
    else {
      alert('Task title required')
    }

  }

  removeTask(taskId){
    gxhr.mutate(`{removeTask(id: ${taskId}) {id}}`).then(
      json => this.getUsers(),
      json => console.error(json)
    )
  }

  render(){
    return (
      <div>
        {this.state.users.map(user => <User
            addTask={this.addTask.bind(this)}
            removeTask={this.removeTask.bind(this)}
            key={user.id}
            user={user} />
        )}
        <Panel css="panel-success" title="Add New User">
          <form onSubmit={this.addUser.bind(this)}>
            <div className="input-group">
              <input
                ref="newUser"
                type="text"
                className="form-control"
                placeholder="enter user name" />
                <span className="input-group-btn">
                  <Button css="btn-success">Add User</Button>
                </span>
            </div>
          </form>
        </Panel>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));

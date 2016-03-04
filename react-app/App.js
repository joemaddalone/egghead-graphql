import React from 'react';
import ReactDOM from 'react-dom';
import GXHR from './graphql-http';

const User = (props) =>
  <div>
    <h2>{props.user.name}</h2>
    <Tasks tasks={props.user.tasks} />
  </div>

const Tasks =(props) =>
  <ul>
    {props.tasks.map(task => <Task key={task.id} task={task} />)}
  </ul>

class Task extends React.Component {
  render(){
    return <li>{this.props.task.title}</li>
  }
}

class App extends React.Component {
  constructor(){
    super();
    this.state = {users: []}
  }
  componentWillMount(){
    let gxhr = new GXHR();
    gxhr.send(`{users {id,name, tasks{id, title}}}`, (json) => {
      if(json.data){
        this.setState({users: json.data.users})
      }
    });
  }
  render(){
    return (
      <ul>
        {this.state.users.map(user => <User key={user.id} user={user} />)}
      </ul>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));

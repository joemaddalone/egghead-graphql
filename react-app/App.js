import React from 'react';
import ReactDOM from 'react-dom';
import GXHR from './graphql-http';
const gxhr = new GXHR();

/**
 * User Component
 */
class User extends React.Component {
    addTask() {
        this.props.addTask( this.refs.newTask.refs.inputField.value, this.props.user.id );
    }

    render() {
        console.log('PROPS' + this.props)
        return (
            <Panel css="panel-info"
                   title={this.props.user.name}
                   removeUser={this.props.removeUser}
                   userId={this.props.user.id}
            >
                <InputGroup
                    ref="newTask"
                    placeholder="enter task title"
                    submitHandler={this.addTask.bind( this )}
                    btnText="Add Task"/>
                <Tasks
                    addTask={this.props.addTask}
                    removeTask={this.props.removeTask}
                    tasks={this.props.user.tasks}
                    userId={this.props.user.id}/>
            </Panel>
        );
    }
}
/**
 * Input Group Component
 */
class InputGroup extends React.Component {
    constructor() {
        super();
    }

    submitHandler( e ) {
        e.preventDefault();
        this.props.submitHandler();
        this.refs.inputField.value = '';
    }

    render() {
        return (
            <form onSubmit={this.submitHandler.bind( this )}>
                <div className="input-group">
                    <input
                        ref="inputField"
                        type="text"
                        className="form-control"
                        placeholder={this.props.placeholder}/>
                    <span className="input-group-btn">
            <Button css="btn-info">{this.props.btnText}</Button>
          </span>
                </div>
            </form>
        );
    }
}


/**
 * Button Component
 */
const Button = ( props ) =>
    <button
        className={'btn ' + props.css}
        onClick={props.clickHandler}>
        {props.children}
    </button>;

/**
 * Panel Component
 */
const Panel = ( props ) =>
    <div className="user row">
        <div className="col-xs-12">
            <div className={'panel ' + props.css}>
                <div className="panel-heading">
                    <h2>
                        {props.title}
                        {props.removeUser &&
                        <div className="pull-right">
                            <DeleteButton
                                removeFunction={props.removeUser}
                                removeId={props.userId}/>
                        </div>}


                    </h2>
                </div>
                {props.children}
            </div>
        </div>
    </div>;


/**
 * Tasks Component
 */
class Tasks extends React.Component {
    render() {
        return (
            <table className="table table-hover">
                <tbody>
                {this.props.tasks.map( task => <Task
                    removeTask={this.props.removeTask}
                    key={task.id}
                    task={task}/>
                )}
                </tbody>
            </table>
        );
    }
}

/**
 * Task Component
 */
const Task = ( props ) =>
    <tr>
        <td className="col-xs-1">
            <DeleteButton
                removeFunction={props.removeTask}
                removeId={props.task.id}
            />
        </td>
        <td className="col-xs-11">
            {props.task.title}
        </td>
    </tr>;

/**
 * Delete Button Component
 */
const DeleteButton = ( props ) =>
    <Button
        clickHandler={props.removeFunction.bind( null, props.removeId )}
        css="btn-xs btn-danger">
          <span
              className="glyphicon glyphicon-glyphicon glyphicon-remove-circle">
          </span>
    </Button>;


/**
 * App Component
 */
class App extends React.Component {
    constructor() {
        super();
        this.state = { users: [] };
    }

    componentWillMount() {
        this.getUsers();
    }

    getUsers() {
        gxhr.query( `{users {id,name, tasks{id, title}}}` ).then(
            json => this.setState( { users: json.data.users } ),
            json => console.error( json )
        )
    }

    addUser() {
        let val = this.refs.newUser.refs.inputField.value;
        if ( val ) {
            gxhr.mutate( `{addUser(name: "${val}") {id}}` ).then(
                this.getUsers.bind( this ),
                json => console.error( json )
            );
        }
        else {
            alert( 'User name required' );
        }

    }

    removeUser( userId ) {
        gxhr.mutate( `{removeUser(id: ${userId}) {id}}` ).then(
            this.getUsers.bind( this ),
            json => console.error( json )
        );
    }

    addTask( title, userId ) {
        if ( title ) {
            gxhr.mutate( `{addTask(title: "${title}", userId: ${userId}) {id}}` ).then(
                this.getUsers.bind( this ),
                json => console.error( json )
            );
        }
        else {
            alert( 'Task title required' );
        }

    }

    removeTask( taskId ) {
        gxhr.mutate( `{removeTask(id: ${taskId}) {id}}` ).then(
            this.getUsers.bind( this ),
            json => console.error( json )
        );
    }

    render() {
        return (
            <div>
                {this.state.users.map( user => <User
                    addTask={this.addTask.bind( this )}
                    removeTask={this.removeTask.bind( this )}
                    removeUser={this.removeUser.bind( this )}
                    key={user.id}
                    user={user}/>
                )}
                <Panel css="panel-success" title="Add New User">
                    <InputGroup
                        ref="newUser"
                        placeholder="enter user name"
                        submitHandler={this.addUser.bind( this )}
                        btnText="Add User"/>
                </Panel>
            </div>
        );
    }
}

ReactDOM.render( <App />, document.getElementById( 'app' ) );

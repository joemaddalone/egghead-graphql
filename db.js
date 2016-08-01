var nextItemId = 1;
var nextUserId = 1;

const db = {
    tasks: [],
    users: [],
    /**
     * Find an item by id.
     */
    getTask( id ){
        return this.tasks.find( task => task.id === id );
    },
    /**
     * Find items based on args.
     */
    findTasks( args ){
        if ( args ) {
            return this.tasks.filter( item =>
                Object.keys( args ).every( key => args[ key ] === item[ key ] ) );
        }
        return this.tasks;
    },
    /**
     * Remove an item by id.
     */
    removeTask( id ) {
        this.tasks.splice(
            this.tasks.findIndex( item => item.id === id )
            , 1 );
        return null
    },
    /**
     * Add a new item.
     */
    addTask( newTask ){
        var item = {
            id: nextItemId++,
            title: newTask.title,
            userId: newTask.userId,
            status: false
        };
        this.tasks.push( item );
        return this.tasks[ this.tasks.length - 1 ];
    },
    /**
     * Update an item.
     */
    updateTask( args ){
        var task = this.getTask( args.id );
        delete args.id;
        Object.keys( args ).forEach( key => task[ key ] = args[ key ] )
        return task;
    },
    /**
     * Find a user by id.
     */
    getUser( id ){
        return this.users.find( user => user.id === id );
    },
    /**
     * Find a user by id.
     */
    findUsers( args ){
        if ( args ) {
            return this.users.filter( user =>
                Object.keys( args ).every( key => args[ key ] === user[ key ] ) );
        }
        return this.users;
    },
    /**
     * Remove a user by id
     */
    removeUser( id ) {
        this.users.splice(
            this.users.findIndex( user => user.id === id )
            , 1 );
        this.tasks = this.tasks.filter(task => task.userId !== id)
        return null
    },
    /**
     * Add a new user
     */
    addUser( newUser ){
        var user = {
            id: nextUserId++,
            name: newUser.name
        };
        this.users.push( user );
        return this.users[ this.users.length - 1 ];
    },
    /**
     * Update a user.
     */
    updateUser( args ){
        var user = this.getUser( args.id );
        delete args.id;
        Object.keys( args ).forEach( key => user[ key ] = args[ key ] )
        return user;
    }

}

/**
 * initialize our pseudo database with some data
 */
db.addUser( { name: 'Abe Bell' } );
db.addUser( { name: 'Chad Dim' } );
db.addTask( { userId: 1, title: 'Get haircut' } );
db.addTask( { userId: 2, title: 'Get real job' } );

export default db;

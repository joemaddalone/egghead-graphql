import {
    GraphQLBoolean,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString
} from 'graphql';

import db from './db';

/**
 * Define Task data type
 */
const Task = new GraphQLObjectType( {
    name: 'Task',
    description: 'Describes a task.',
    fields: () => {
        return {
            id: {
                type: GraphQLInt
            },
            title: {
                type: GraphQLString
            },
            status: {
                type: GraphQLBoolean
            },
            userId: {
                type: GraphQLInt
            },
            user:  {
                type: User,
                resolve( task ){
                    return db.getUser( task.userId )
                }
            }
        }
    }
} );

/**
 * Define User data type
 */
const User = new GraphQLObjectType({
    name: 'User',
    description: 'Describes a user',
    fields: () => {
        return  {
            id: {
                type: GraphQLInt
            },
            name: {
                type: GraphQLString
            },
            tasks: {
                type: new GraphQLList(Task),
                resolve( user ) {
                    return db.findTasks({userId: user.id})
                }
            }
        }
    }
});

/**
 * Single endpoint for our public api with sub-endpoints: users & tasks
 */
const Query = new GraphQLObjectType( {
    name: 'Query',
    description: 'Our root query',
    fields: () => {
        return {
            users: {
                type: new GraphQLList( User ),
                args: {
                    id: {
                        type: GraphQLInt
                    }
                },
                resolve( root, args ) {
                    return db.findUsers( args )
                }
            },
            tasks: {
                type: new GraphQLList( Task ),
                args: {
                    id: {
                        type: GraphQLInt
                    },
                    status: {
                        type: GraphQLBoolean
                    },
                    userId: {
                        type: GraphQLInt
                    }
                },
                resolve( root, args ) {
                    return db.findTasks( args )
                }
            }
        }
    }
} );

/**
 * Mutations
 */
const Mutation = new GraphQLObjectType( {
    name: 'Mutations',
    description: 'Our update data',
    fields () {
        return {
            addTask: {
                description: 'Adds a new task.',
                type: Task,
                args: {
                    title: {
                        type: new GraphQLNonNull( GraphQLString )
                    },
                    userId: {
                        type: new GraphQLNonNull( GraphQLInt )
                    }
                },
                resolve ( root, args ) {
                    return db.addTask( args )
                }
            },
            removeTask: {
                description: 'Removes an task.',
                type: Task,
                args: {
                    id: {
                        type: new GraphQLNonNull( GraphQLInt )
                    }
                },
                resolve ( root, args ) {
                    return db.removeTask( args.id )
                }
            },
            updateTask: {
                description: 'Updates a task.',
                type: Task,
                args: {
                    id: {
                        type: new GraphQLNonNull( GraphQLInt )
                    },
                    status: {
                        type: GraphQLBoolean
                    },
                    title: {
                        type: GraphQLString
                    },
                    userId: {
                        type: GraphQLInt
                    }
                },
                resolve ( root, args ) {
                    return db.updateTask( args )
                }
            },
            addUser: {
                description: 'Adds a new user.',
                type: User,
                args: {
                    name: {
                        type: new GraphQLNonNull( GraphQLString )
                    }
                },
                resolve ( root, args ) {
                    return db.addUser( args )
                }
            },
            removeUser: {
                description: 'Removes a user.',
                type: User,
                args: {
                    id: {
                        type: new GraphQLNonNull( GraphQLInt )
                    }
                },
                resolve ( root, args ) {
                    return db.removeUser( args.id )
                }
            },
        };
    }
} );

module.exports = new GraphQLSchema( {
    query: Query,
    mutation: Mutation
} );

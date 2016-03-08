class GXHR {
    send( query ) {
        return new Promise( ( resolve, reject ) => {
            let xhr = new XMLHttpRequest();
            xhr.open( 'POST', '/graphql' );
            xhr.setRequestHeader( 'Content-Type', 'application/json' );
            xhr.setRequestHeader( 'Accept', 'application/json' );
            xhr.onload = () => {
                try {
                    let json = JSON.parse( xhr.responseText );
                    if ( json.errors ) {
                        return reject( json )
                    }
                    else {
                        return resolve( json )
                    }
                }
                catch ( err ) {
                    return reject( { status: xhr.status } )
                }
            };
            xhr.send( JSON.stringify( { query } ) );
        } )
    }

    query( queryArgs ) {
        return this.send( queryArgs );
    }

    mutate( mutateArgs ) {
        return this.send( 'mutation ' + mutateArgs );
    }
}

export default GXHR;

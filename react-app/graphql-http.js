class GXHR {
  send(query){
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open('POST', '/graphql');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.onload = () => {
        try {
          return resolve(JSON.parse(xhr.responseText))
        }
        catch(err){
          return reject({status: xhr.status})
        }
      }
      xhr.send(JSON.stringify({query}))
    })
  }
  query(queryArgs){
    return this.send(queryArgs)
  }
  mutate(mutateArgs){
    return this.send('mutation ' + mutateArgs)
  }
}

export default GXHR;

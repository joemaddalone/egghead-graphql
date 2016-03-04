class GXHR {
  send(query, cb){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/graphql');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = function () {
      var json = null;
      try {
        json = JSON.parse(xhr.responseText);
      } catch(err) {
        json = {status: xhr.status};
      }
      cb(json)
    };
    xhr.send(JSON.stringify({query}));
  }
}

export default GXHR;

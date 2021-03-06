/*jshint esversion: 6*/
let numberOfElements = ['helium', 'hydrogen'];

const http = require('http');
const fs = require('fs');
const key = 'guest';

// Create Server with 2 starting elements and identify req
const server = http.createServer((req, res)  => {
  console.log(numberOfElements);
  let method = req.method;
  let url = req.url;
  let host = req.host;
  if(url ==='/' || url ===''){
    url = 'index.html';
  }
  if(method === 'GET'){
  var fileName = fs.readFile(`./public/${url}`,(err, data) => {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    res.end(data);
    });
  }
  if(method === 'POST' || method === 'PUT'){

    let body ='';
    req.on('data', ( data ) =>{
      body += data;
      checkFile(body);
    });
  }
  if(method === 'DELETE'){
    req.on('data', (data) =>{
      deleteElement(data);
    });

  }
// check to see if posted file exists
  function checkFile(body){
    let bodyArray = body.split('&');
    let element = bodyArray[0].split('=')[1];
    let weight = bodyArray[1].split('=')[1];
    let description = bodyArray[2].split('=')[1].split('+').join(' ');
    let password = bodyArray[3].split('=')[1];
    if (password === key){
      if (fs.existsSync(`./public/${element}.html`) === false){
        numberOfElements.push(element);
        writeFile(element,weight,description);
      } else {
        putData(body);
        console.log('nevermind');
      }
    } else {
      res.end('not today');
    }
  }
// POST save new file with name posted
  function writeFile(element, weight, description){
    fs.writeFile(`./public/${element}.html`, fileContent(element,weight,description), (err) => {
      if(err) throw err;
      appendFile(element);
    });
  }
// POST add contentd to new file with HTML template
  function fileContent(element, weight, description){
    return  `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Elements - ${element}</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <h1>${element}</h1>
  <h2>${element.split('')[0].toUpperCase()}</h2>
  <h3>Atomic number is ${weight}</h3>
  <p>${element} is a chemical element with symbol He and atomic number ${weight}. It is ${description}.</p>
  <p><a href="/">back</a></p>
</body>
</html>`;
  }
//POST
  function appendFile(element){
    var elementFileName = fs.readFile(`./public/${element}.html`,(err, data) => {
    res.writeHead(200);
    appendIndex(element);
    });
  }
//POST
  function appendIndex(element){
    fs.readFile('./public/index.html', (err, data) =>{
      let dataArray = data.toString().split('\n');
      dataArray.splice(10,1, `<h3>These are ${numberOfElements.length}</h3>`);
      dataArray.splice(18,0,`   <li>
      <a href = /${element}.html>${element}</a>
    </li>`);
      deleteIndex(dataArray);
    });
  }

//POST
  function deleteIndex(dataArray){
    fs.unlink('./public/index.html', (err) =>{
      if (err) throw err;
      createIndex(dataArray);
    });
  }
//POST
  function createIndex(dataArray){
    fs.writeFile(`./public/index.html`, dataArray.join('\n'), (err) => {
      if(err) throw err;
      res.end('POst Saved saved');
    });
  }


//DELETE
  function deleteElement(data){
    let elementToBeDeleted = data.toString().split('=')[1];
    elementToBeDeleted = elementToBeDeleted.split('&')[0];
    if(numberOfElements.indexOf(elementToBeDeleted) >= 0){
    numberOfElements.splice(numberOfElements.indexOf(elementToBeDeleted), 1);
    fs.unlink(`./public/${elementToBeDeleted}.html`, (err) =>{
      if (err) throw err;
    });
    deleteElementIndex(elementToBeDeleted);
  } else (res.end('element does not exist...yet'));
}

  function deleteElementIndex(element){
    fs.readFile('./public/index.html', (err, data) => {
      let deleteElement = data.toString().split('\n');
      for(var i = 0; i<deleteElement.length; i++){
        if(deleteElement[i].indexOf(element) >=0 ){
          deleteElement.splice(i-1, 3);
          deleteElement.splice(10,1, `<h3>These are ${numberOfElements.length}</h3>`);
          deleteIndex(deleteElement);
        }
      }
    });
  }

  function putData(body){
    let element = body.split('=')[1].split('&')[0];
    let weight = body.split('=')[2].split(',')[0].split('&')[0];
    let description = body.split('&')[2].split('=')[1].split('+').join(' ');
    fs.readFile(`./public/${element}.html`, (err, data) =>{
      let dataArray = (data.toString().split('\n'));
      dataArray.splice(10,1, `<h3>Atmomic number is ${weight}</h3>`);
      console.log('Weight: ' +dataArray);
      dataArray.splice(11,1, `<p>${element} is a chemcical element with a weight of ${weight}. It is ${description}</p>`);
      console.log('Description: ' +dataArray);
      deleteElementHtml(dataArray, element);


    });

    function deleteElementHtml(dataArray, element){fs.unlink(`./public/${element}.html`, (err) =>{
      if (err) throw err;
      recreateElement(dataArray, element);
    });

    function recreateElement(dataArray, element){
      console.log(dataArray.join('\n'));
    fs.writeFile(`./public/${element}.html`, dataArray.join('\n'), (err) => {
      if(err) throw err;
      res.end('saved');
        });
      }
    }
  }
});


server.listen(6969, () => {

  console.log('server');
});







`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Elements</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <h1>The Elements</h1>
  <h2>These are all the known elements.</h2>
  <h3>These are 2</h3>
  <ol>
    <li>
      <a href="/hydrogen.html">Hydrogen</a>
    </li>
    <li>
      <a href="/helium.html">Helium</a>
    </li>
  </ol>
</body>
</html>`;
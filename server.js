/*jshint esversion: 6*/

const http = require('http');
const fs = require('fs');
let numberOfElements = 2;

// Create Server with 2 starting elements and identify req
const server = http.createServer((req, res)  => {
  let method = req.method;
  let url = req.url;
  let host = req.host;
  if(url ==='/' || url ===''){
    url = 'index.html';
  }
  if(method === 'GET'){
  var fileName = fs.readFile(`./public/${url}`,(err, data) => {
    //if (err) throw err;
    res.writeHead(200);
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
      console.log(data.toString());
      deleteElement(data);
    });

  }
// check to see if posted file exists
  function checkFile(body){
    console.log("BODY: " + body);
    let bodyArray = body.split('&');
    let element = bodyArray[0].split('=')[1];
    let weight = bodyArray[1].split('=')[1];
    let description = bodyArray[2].split('=')[1];
    console.log("BODY ARRAY: " +  bodyArray);
    console.log("WEIGHT: " + weight);
    console.log("DESCRIPTION: " + description);
    console.log("ELEMENT: " +element);
    if (fs.existsSync(`./public/${element}.html`) === false){
      console.log('no file');
      numberOfElements++;
      writeFile(element,weight,description);
    } else {
      console.log('already exists');
      putData(body);
    }
  }
// POST save new file with name posted
  function writeFile(element, weight, description){
    fs.writeFile(`./public/${element}.html`, fileContent(element,weight,description), (err) => {
      if(err) throw err;
      console.log('file saved');
      console.log('NUMBER OF ELEMENTS: ' +numberOfElements);
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
    console.log('append' + element);
    res.writeHead(200);
    appendIndex(element);
    });
  }
//POST
  function appendIndex(element){
    fs.readFile('./public/index.html', (err, data) =>{
      console.log('index: ' + data);
      let dataArray = data.toString().split('\n');
      console.log(dataArray);
      console.log(dataArray.length);
      dataArray.splice(10,1, `These are ${numberOfElements}`);
      dataArray.splice(18,0,`   <li>
      <a href = /${element}.html>${element}</a>
    </li>`);
      console.log(dataArray);
      //appenddddIndex(dataArray);

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
    //console.log('createIndex: ' + element);
    fs.writeFile(`./public/index.html`, dataArray.join('\n'), (err) => {
      if(err) throw err;
      console.log('file saved');
      res.end('POst Saved saved');
    });
  }


//DELETE
  function deleteElement(data){
    console.log(data);
    let elementToBeDeleted = data.toString().split('=')[1];
    console.log(elementToBeDeleted);
    elementToBeDeleted = elementToBeDeleted.split('&')[0];
    fs.unlink(`./public/${elementToBeDeleted}.html`, (err) =>{
      if (err) throw err;
    });
    deleteElementIndex(elementToBeDeleted);
  }

  function deleteElementIndex(element){
    fs.readFile('./public/index.html', (err, data) => {
      let deleteElement = data.toString().split('\n');
      console.log(deleteElement);
      for(var i = 0; i<deleteElement.length; i++){
        if(deleteElement[i].indexOf(element) >=0 ){
          console.log('found');
          numberOfElements --;
          deleteElement.splice(i-1, 3);
          deleteElement.splice(10,1, `These are ${numberOfElements}`);
          deleteIndex(deleteElement);
        }
      }
    });
  }

  function putData(body){
    console.log(body);
    let element = body.split('=')[1].split('&')[0];
    let weight = body.split('=')[2].split(',')[0].split('&')[0];
    let description = body.split('&')[2].split('=')[1];
    console.log('DESCRIPTION: ' + description);
    console.log('WEIGHT: ' +weight);
    console.log('ELMENT: '+element);
    fs.readFile(`./public/${element}.html`, (err, data) =>{
      let dataArray = (data.toString().split('\n'));
      console.log(dataArray);
     // dataArray.splice(10,1, `${element} is ${description} `);
      dataArray.splice(11,1, `${element} is a chemcical element with a weight of ${weight}`);
      console.log(dataArray);
      deleteElementHtml(dataArray, element);


    });

    function deleteElementHtml(dataArray, element){fs.unlink(`./public/${element}.html`, (err) =>{
      if (err) throw err;
      recreateElement(dataArray, element);
    });

    function recreateElement(dataArray, element){
    //console.log('createIndex: ' + element);
    fs.writeFile(`./public/${element}.html`, dataArray.join('\n'), (err) => {
      if(err) throw err;
      console.log('file saved');
      res.end('saved');
    });
  }

    }
  }



});

      // fs.readFile('./public/index.html', (err, data) =>{
      //   let data
      // });

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
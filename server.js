/*jshint esversion: 6*/

const http = require('http');
const fs = require('fs');




const server = http.createServer((req, res)  => {
  let numberOfElements = 2;
  let method = req.method;
  let url = req.url;
  let host = req.host;
  if(url ==='/' || url ===''){
    url = 'index.html';
  }
  console.log(url);


  if(method === 'GET'){
  var fileName = fs.readFile(`./public/${url}`,(err, data) => {
    //if (err) throw err;
    res.writeHead(200);
    res.end(data);
    });
  }
  if(method === 'POST'){
    console.log('POST');
    let body ='';
    req.on('data', ( data ) =>{
      body += data;
      checkFile(body);
    });
  }

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
      res.write('exists');
    }
  }

  function writeFile(element, weight, description){
    fs.writeFile(`./public/${element}.html`, fileContent(element,weight,description), (err) => {
      if(err) throw err;
      console.log('file saved');
      appendFile(element);
    });
  }


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
  <h2>H</h2>
  <h3>${weight} 2</h3>
  <p>${element} is a chemical element with symbol He and atomic number ${weight}. It is ${description}.</p>
  <p><a href="/">back</a></p>
</body>
</html>`;
  }



  function appendFile(element){
    var elementFileName = fs.readFile(`./public/${element}.html`,(err, data) => {

    //if (err) throw err;
    console.log('append' + element);
    res.writeHead(200);
    appendIndex(element);
    });
  }


  function appendIndex(element){
    var indexFileName = fs.readFile('./public/index.html', (err, data) =>{
      deleteIndex(element);
    });
  }


  function deleteIndex(element){
    console.log(`delete ${element}`);
    fs.unlink('./public/index.html', (err) =>{
      if (err) throw err;
      createIndex(element);
    });
  }



  function createIndex(element){
    console.log('createIndex: ' + element);
    fs.writeFile(`./public/index.html`, indexFileContent(element), (err) => {
      if(err) throw err;
      console.log('file saved');
      res.end('saved');
    });
  }


  function indexFileContent(element){
    console.log(element);
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Elements</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <h1>The Elements</h1>
  <h2>These are all the known elements.</h2>
  <h3>These are ${numberOfElements}</h3>
  <ol>
    <li>
      <a href="/hydrogen.html">Hydrogen</a>
    </li>
    <li>
      <a href="/helium.html">Helium</a>
    </li>
    <li>
      <a href="/${element}.html">${element}</a>
    </li>
  </ol>
</body>
</html>`;
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
</html>`


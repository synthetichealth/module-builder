var fs = require('fs')

const argv = process.argv.slice(2);

if(argv.length == 0){
  console.log('\x1b[1m')
  console.log('\n\nPlease specify directory where synthea modules are located.')
  console.log('USAGE: npm run build-modules ../synthea/src/main/resources/modules\n\n\n')
  console.log('Please point to the exact top level generic module directory')
  console.log('\x1b[0m')
  process.exit()
}

var directory = argv[0]
if(argv[0].endsWith('/')){
  directory = argv[0].slice(0,-1)
}

try {
  fs.lstatSync(directory).isDirectory()
} catch(e){
  console.log('\x1b[1m')
  console.log('\n\nNo such directory ' + directory)
  console.log('EXAMPLE USAGE: npm run build-modules ../synthea/src/main/resources\n\n\n')
  console.log('\x1b[0m')
  process.exit()
}

let walkSync = (dir, filelist) => {
  var files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = walkSync(dir + '/' +  file , filelist);
    }
    else {
      if(file.endsWith('.json')){
        filelist.push(dir + '/' + file);
        console.log('Found ' + filelist[filelist.length-1])
      }
    }
  });
  return filelist;
};

var files = walkSync(directory);

if(files.length == 0){
  console.log('\x1b[1m')
  console.log('\n\nNo json files located at ' + directory)
  console.log('USAGE: npm run build-modules ../synthea/src/main/resources/modules\n\n\n')
  console.log('\x1b[0m')
  process.exit()
}

// add examplitis to the top
files.unshift('./src/data/example_module.json');

var count = 0;
var output = 'export default {'
for(var i = 0; i< files.length; i++){
  
  var contents = fs.readFileSync(files[i], 'utf8');

  var json = JSON.parse(contents)

  if(json.name && json.states){

    count++

    var filename = files[i].replace(directory + '/','').replace('.json','')
    filename = filename.replace('./src/data/','') // for examplitis


    if(filename.split('/').length > 2){
      console.log('\n\nERROR: THERE SHOULD NOT BE MORE THAN ONE / IN THIS FILENAME.  YOU ARE TOO HIGH IN THE DIRECTORY TREE: ' + filename) 
      process.exit()
    }

    output += '"' + filename + '":' + JSON.stringify(json,undefined,2)

    console.log('Added module: ' + filename)
    
    output += "\n,\n"

  } else {
    console.log('File: ' + files[i] + ' does not appear to be a valid module')
  }

}

output = output.slice(0,-1)
output += '};'

let outputFile = './src/data/modules.js'

try {
  fs.lstatSync(outputFile).isFile()
} catch(e){
  console.log('\x1b[1m')
  console.log('\n\nCould not find module file for writing. Has something changed? ' + outputFile)
  console.log('\x1b[0m')
  process.exit()
}

fs.writeFileSync(outputFile, output)


console.log('\x1b[1m')
console.log('\n\nCompleted importing ' + count + ' modules from ' + directory + ' (including example module in /src/data)\n\n')
console.log('Overwrite ' + outputFile + 'with new data')
console.log('Run tests before committing (and no other files should have been changed)')
console.log('\n\n\x1b[0m')

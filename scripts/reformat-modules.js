var fs = require('fs')

var argv = process.argv.slice(2);

if(argv.length == 0){
  console.log('\x1b[1m')
  console.log('\n\nreformat-modules: Import and export all modules to format in a standardize manner.')
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
  console.log('EXAMPLE USAGE: npm run reformat-modules ../synthea/src/main/resources\n\n\n')
  console.log('\x1b[0m')
  process.exit()
}

var walkSync = (dir, filelist) => {
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
  console.log('USAGE: npm run format-modules ../synthea/src/main/resources/modules\n\n\n')
  console.log('\x1b[0m')
  process.exit()
}

for(var i = 0; i< files.length; i++){
  
  var contents = fs.readFileSync(files[i], 'utf8');
  var scrubbedModule = JSON.stringify(JSON.parse(contents), undefined, 2);
  
  fs.writeFileSync(files[i], scrubbedModule)

}


console.log('\x1b[1m')
console.log('\n\nReformatted ' + files.length + ' modules in place in ' + directory + '\n\n')
console.log('\n\n\x1b[0m')

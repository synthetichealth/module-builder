var fs = require('fs')

var argv = process.argv.slice(2);

if(argv.length < 2){
  console.log('\x1b[1m')
  console.log('\n\nPlease specify directory where synthea modules and lookup tables are located.')
  console.log('USAGE: npm run build-modules ../synthea/src/main/resources/modules ../synthea/src/test/resources/generic/lookup_tables\n\n\n')
  console.log('Please point to the exact top level generic module directory and lookup table directory')
  console.log('\x1b[0m')
  process.exit()
}

var directory = argv[0]
if(argv[0].endsWith('/')){
  directory = argv[0].slice(0,-1)
}

var tableDirectory = argv[1]
if(argv[1].endsWith('/')){
  directory = argv[1].slice(0,-1)
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

try {
  fs.lstatSync(tableDirectory).isDirectory()
} catch(e){
  console.log('\x1b[1m')
  console.log('\n\nNo such directory ' + tableDirectory)
  console.log('EXAMPLE USAGE: npm run build-modules ../synthea/src/test/resources/generic/lookup_tables\n\n\n')
  console.log('\x1b[0m')
  process.exit()
}

var walkSync = (dir, filetype, filelist) => {
  var files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = walkSync(dir + '/' +  file , filetype, filelist);
    }
    else {
      if(file.toUpperCase().endsWith(filetype.toUpperCase())){
        filelist.push(dir + '/' + file);
        console.log('Found ' + filelist[filelist.length-1])
      }
    }
  });
  return filelist;
};

var files = walkSync(directory,'.json');

if(files.length == 0){
  console.log('\x1b[1m')
  console.log('\n\nNo json files located at ' + directory)
  console.log('USAGE: npm run build-modules ../synthea/src/main/resources/modules\n\n\n')
  console.log('\x1b[0m')
  process.exit()
}

var count = 0;
var output = 'export default {'
for(var i = 0; i< files.length; i++){
  
  var contents = fs.readFileSync(files[i], 'utf8');

  var json = JSON.parse(contents)

  if(json.name && json.states){

    // look through all of the states in this module
    Object.keys(json.states).map(k => json.states[k]).forEach( s => {  

      // find table transitions and add state data
      if (s.table_transition !== undefined){ 

        // save the name and set the table view to be in the edit mode
        s.table_transition.lookup_table_name_ModuleBuilder = s.table_transition.transitions[0].lookup_table_name;
        s.viewTable = false;

        // find the file using the table name
        var tableFiles = walkSync(tableDirectory, ".csv");
        var csvLocation = '';
        tableFiles.forEach( file => {
          if (file.toUpperCase().includes(s.table_transition.lookup_table_name_ModuleBuilder.toUpperCase()))
          {
            csvLocation = file;
          }
        });

        // check that the file was found
        if (csvLocation === '')
        {      
          console.log('\x1b[1m')
          console.log('\n\nLookup Table \'' + s.table_transition.lookup_table_name_ModuleBuilder + '\' not found.\n')
          console.log('Please ensure the table exists in the directory ' + tableDirectory)
          console.log('\x1b[0m')
          process.exit()
        }
        
        // read the csv and save it
        s.table_transition.lookuptable = fs.readFileSync(csvLocation, 'utf8');
      }
    });

    count++

    var filename = files[i].replace(directory + '/','').replace('.json','')

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
console.log('\n\nCompleted importing ' + count + ' modules from ' + directory + '\n\n')
console.log('Overwrite ' + outputFile + ' with new data')
console.log('Run tests before committing (and no other files should have been changed)')
console.log('\n\n\x1b[0m')

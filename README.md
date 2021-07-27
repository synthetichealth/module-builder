# Synthea<sup>TM</sup> Module Builder

The Synthea<sup>TM</sup> Module Builder is a visual editor for creating and modifying  [Synthea<sup>TM</sup> Patient Generator](https://synthetichealth.github.io/module-builder) modules using the
[Synthea<sup>TM</sup> Generic Module Framework](https://github.com/synthetichealth/synthea/wiki/Generic-Module-Framework).
It supports the entire Generic Module Framework specification and allows users to create full-featured modules
without needing to directly edit JSON files.  It is preloaded with all modules contained within the current
[Synthea<sup>TM</sup> Github Repository](https://github.com/synthetichealth/synthea).  Users can either edit these modules
or create new ones to extend the capabilities of Synthea<sup>TM</sup>.
 
## Getting Started

Users are encouraged to use the hosted version of the Module Builder: 

https://synthetichealth.github.io/module-builder/

If you are new to authoring Synthea<sup>TM</sup> modules, please review the [Generic Module Framework (GMF) Documentation](https://github.com/synthetichealth/synthea/wiki/Generic-Module-Framework).
Some familiarity with the GMF is required before beginning the authoring process.

## Local Installation

Local installation typically is not necessary, unless you plan on contributing improvements the Module Builder itself.
It is written in Javascript using React and requires [Node.js](https://nodejs.org/) to run locally. Once Node.js is installed,
run the following commands to run a local copy of the Module Builder:

```sh
npm install
npm start
```

This will start a local copy running at `http://localhost:3000/`

## Saving Modules

### Download as JSON

Modules created and edited through the Module Builder can be downloaded and saved as a JSON file. Click the `Download` button at the
top of the interface, and you can either copy the JSON in the modal text box, or click the `Download` button on the bottom
of the modal to save as a local file.

Once saved as a JSON file (using the `.json` extension), you can use the module within your own local installation of Synthea.
See the [Generic Module Framework](https://github.com/synthetichealth/synthea/wiki/Generic-Module-Framework#relevant-files-and-paths) for information on where to place the file.

### Save to Local Storage

Modules can also be saved to local storage in the browser. Click the `Download` button at the top of the interface, and click the `Save to Local Storage` button at the bottom of the modal. To load an existing module from local storage, select it from the `Local Storage` list when opening an existing module.

## Developer Tasks

The following information is only relevant to developers improving the Module Builder itself.


### Synchronizing Generic Modules in Synthea

This application currently embeds all generic modules within the application.  In order to 
update these modules to match the most recent ones available in the Synthea repository,
run the `build-modules` script, pointing to the modules directory within a local copy of `Synthea`.

```sh
npm run build-modules ../synthea/src/main/resources/modules # Point to the modules directory of synthea
git status # This should have changed ./src/data/modules.js
npm test # Run tests to ensure the new modules file valid
```

### Running Tests

To run tests on the Module Builder, execute the following command: 

```sh
npm test
```

### Deploying Updated Version of Synthea

If you have administrative access to the Generic Module Builder repository, you can deploy updates to 
the [Module Builder site](https://synthetichealth.github.io/module-builder/).  Before deploying,
you should consider synchronizing the modules in the repository and must run the tests.

```sh
npm run deploy
```

This updates the `gh-pages` branch on the repository with the new build, and changes will be reflected on the
site within a few minutes.


# License

Copyright 2016-2020 The MITRE Corporation

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

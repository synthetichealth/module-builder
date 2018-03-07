This project is an editor for building Generic Module Framework modules for the Synthea project.

You can run it with `yarn start`

Currently supports:
  - Basic States
  - Direct Transitions
  - Distributed Transitions

Demo application is available at https://synthetichealth.github.io/module-builder/

## Synchronizing Generic Modules in Synthea

This application currently embeds all generic modules within the application.  In order to 
update these modules to match the most recent ones available in the Synthea repository,
run the `build-modules` script, pointing to the modules directory within a local copy of `Synthea`.

```sh
  npm run build-modules ../synthea/src/main/resources/modules # Point to the modules directory of synthea
  git status # This should have changed ./src/data/modules.js
  npm test # Run tests to ensure the new modules file valid
```

# License

Copyright 2016-2018 The MITRE Corporation

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

# JS - Visual Data Mapping - JSON Mapping - Object Mapping
While I do my job, I have seen a lot of work with data mapping. I did some research on internet, actually all package I have found isn't good enough for me to use or resolve my issue.

That is why I create this package, aim to resolve my issue first but public for you now.

This package use some another package to Render JSON Tree ( [json-tree-view](https://github.com/luyuan/json-tree-view) ) and ([map-factory](https://github.com/midknight41/map-factory)) for data mapping. You can visit these package for more details.

## Install
```javascript
npm i visual-data-mapping
```

## Usage

```javascript
// Typescript
import JsonMapping from "visual-data-mapping"
const instance = new JsonMapping({...})

// ES
// import JsonMapping from "visual-data-mapping/es5"
//
// import JsonMapping from "visual-data-mapping/es6"
//

// Require
// const DataMapping = require("visual-data-mapping/bundle/bundle.js")
// const instance = new DataMapping.JsonMapping({...})

import "visual-data-mapping/css/style.css"
// OR SCSS
// import "visual-data-mapping/css/style.scss"

// CSS Import
// @import "visual-data-mapping/css/style.scss";
// OR
// @import "visual-data-mapping/css/style.css";
```

## Options
```javascript
{
    container                      : string,  // DOM selector
    target                         : any,     // Tree data: Object - Array
    shortenTarget                  : boolean, // Default TRUE - keep 1st item in array - remaining items will be removed
    targetTreeReadOnly             : boolean, // Default FALSE
    source                         : any,     // Tree data: Object - Array
    shortenSource                  : boolean, // Default TRUE - keep 1st item in array - remaining items will be removed
    disableChildWhenParentHasSource: boolean, // Default FALSE. When set TRUE => when parent has mapping data => all children's mapping data will be disabled & ignored
    popupAttach                    : string,  // DOM selector - select Element that will place JSON Tree Popup
    indent                         : number,  // For display - set padding left to nested property 
    windowProp                     : string,  // Declare a new property on the Window object
    text                           : {        // I18n Support
        tabMapping           : 'Mapping',
        tabOutput            : 'Output',
        tabOptions           : 'Options',
        editTargetBtn        : 'Edit Target',
        importTargetBtn      : 'Import Target (JSON)',
        viewSourceBtn        : 'View Source',
        importSourceBtn      : 'Import Source (JSON)',
        theadTargetTitle     : 'Target Object',
        theadSourceTitle     : 'Source Object',
        theadCol1            : 'Fields',
        theadCol2            : 'Value Type',
        theadCol3            : 'Value Type',
        theadCol4            : 'Fields',
        theadCol5            : 'Transform Data',
        theadCol6            : 'Default Value',
        outputTitle          : 'Output',
        codeTitle            : 'Code',
        resetOptionsBtn      : 'Reset To Default',
        loadCurrentOptionsBtn: 'Load Current Options',
        applyOptionsBtn      : 'Apply',
        popupTargetTitle     : 'Target',
        importTargetTitle    : 'Target Import',
        expandCollapseBtn    : 'Expand / Collapse',
        closeTargetPopupBtn  : '✕',
        doImportTargetBtn    : 'Import',
        popupSourceTitle     : 'Source',
        importSourceTitle    : 'Source Import',
        closeSourcePopupBtn  : '✕',
        doImportSourceBtn    : 'Import',
        sourceFilterIcon     : '🔎',
        rowClearInputBtn     : '✕',
        rowSelectPathBtn     : '≡',
        rowAddPathBtn        : '+',
        rowRemovePathBtn     : '−',
        dataTypeCombined     : '...',
        copyBtn              : 'copy'
    }
}
```


## Example
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Visual Data Mapping - JSON Mapping - Object Mapping</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="my-mapping"></div>
    <script src="bundle.js"></script>
    <script>    
        const mockTarget = {...}
        const mockSource = {...}
        
        const instance = new DataMappingBundle.JsonMapping({
            container                      : 'my-mapping',
            target                         : mockTarget,
            shortenTarget                  : true,
            targetTreeReadOnly             : false,
            source                         : mockSource,
            shortenSource                  : true,
            disableChildWhenParentHasSource: true,
            indent                         : 15,
            windowProp                     : 'myJM',
            popupAttach                    : undefined,
            text                           : {
                tabMapping           : 'Mapping',
                tabOutput            : 'Output',
                tabOptions           : 'Options',
                editTargetBtn        : 'Edit Target',
                importTargetBtn      : 'Import Target (JSON)',
                viewSourceBtn        : 'View Source',
                importSourceBtn      : 'Import Source (JSON)',
                theadTargetTitle     : 'Target Object',
                theadSourceTitle     : 'Source Object',
                theadCol1            : 'Fields',
                theadCol2            : 'Value Type',
                theadCol3            : 'Value Type',
                theadCol4            : 'Fields',
                theadCol5            : 'Transform Data',
                theadCol6            : 'Default Value',
                outputTitle          : 'Output',
                codeTitle            : 'Code',
                resetOptionsBtn      : 'Reset To Default',
                loadCurrentOptionsBtn: 'Load Current Options',
                applyOptionsBtn      : 'Apply',
                popupTargetTitle     : 'Target',
                importTargetTitle    : 'Target Import',
                expandCollapseBtn    : 'Expand / Collapse',
                closeTargetPopupBtn  : '✕',
                doImportTargetBtn    : 'Import',
                popupSourceTitle     : 'Source',
                importSourceTitle    : 'Source Import',
                closeSourcePopupBtn  : '✕',
                doImportSourceBtn    : 'Import',
                sourceFilterIcon     : '🔎',
                rowClearInputBtn     : '✕',
                rowSelectPathBtn     : '≡',
                rowAddPathBtn        : '+',
                rowRemovePathBtn     : '−',
                dataTypeCombined     : '...',
                copyBtn              : 'copy'
            }
        })
        
        instance.on('change', (targetSchema, sourceSchema, mappingFields, code) => {
            console.log('change')
            console.log(targetSchema)
            console.log(sourceSchema)
            console.log(mappingFields)
            console.log(code)
        })
        instance.on('output', (data) => {
            console.log('output')
            console.log(data)
        })
        instance.on('targetImport', obj => {
            console.log('target-import')
            console.log(obj)
        })
        instance.on('sourceImport', obj => {
            console.log('source-import')
            console.log(obj)
        })
        instance.on('configs', (oldConf, newConf) => {
            console.log('configs')
            console.log(oldConf)
            console.log(newConf)
        })
        
        // document.getElementById('update-config-btn')?.addEventListener('click', () => {
        //     instance.setConfigs(...)
        // })
        //
        // OR
        //
        // window.myJM.setConfigs(...)
        
        // document.getElementById('destroy-btn')?.addEventListener('click', () => {
        //     instance.destroy()
        // })
        //
        // OR
        //
        // window.myJM.destroy()
        
        // document.getElementById('execute-btn')?.addEventListener('click', () => {
        //     const data = instance.execute()
        // })
        //
        // OR
        //
        // window.myJM.execute()
    </script>
</body>
</html>
```

## API
```javascript
setConfigs({...})

destroy()

execute()
```

## Screenshot
Main
![Main](https://raw.githubusercontent.com/kiennt2/visual-data-mapper/main/screenshot/main.png)

Target Tree
![Target Tree](https://raw.githubusercontent.com/kiennt2/visual-data-mapper/main/screenshot/targe%20tree.png)

Target Import
![Target Import](https://raw.githubusercontent.com/kiennt2/visual-data-mapper/main/screenshot/target%20import.png)

Source Tree
![Source Tree](https://raw.githubusercontent.com/kiennt2/visual-data-mapper/main/screenshot/source%20tree.png)

Source Import
![Source Import](https://raw.githubusercontent.com/kiennt2/visual-data-mapper/main/screenshot/source%20import.png)

Output
![Output](https://raw.githubusercontent.com/kiennt2/visual-data-mapper/main/screenshot/output.png)

Options
![Options](https://raw.githubusercontent.com/kiennt2/visual-data-mapper/main/screenshot/options.png)

## Roadmap
- [ ] Utils Function & UI & UX
  - [ ] Data Transformation Functions
  - [ ] Default Value Functions

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
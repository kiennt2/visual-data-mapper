"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultOptions = exports.defaultInputCssClass = exports.defaultTransform = exports.targetPathAttr = exports.cssPrefix = exports.MapperOptions = exports.RowInputs = exports.RowButtons = void 0;
var RowButtons;
(function (RowButtons) {
    RowButtons["ClearSourcePathData"] = "clear-source-path-data";
    RowButtons["SelectSourcePath"] = "select-source-path";
    RowButtons["AddMoreSourceField"] = "add-more-source-field";
    RowButtons["RemoveSourceField"] = "remove-source-field";
})(RowButtons = exports.RowButtons || (exports.RowButtons = {}));
var RowInputs;
(function (RowInputs) {
    RowInputs["InputSourcePath"] = "input-source-path";
    RowInputs["InputDefaultValue"] = "input-default-value";
    RowInputs["InputTransformData"] = "input-transform-data";
})(RowInputs = exports.RowInputs || (exports.RowInputs = {}));
exports.MapperOptions = {
    alwaysTransform: false,
    alwaysSet: true,
    flatten: false
};
exports.cssPrefix = 'jmp-';
exports.targetPathAttr = 'data-target-path';
exports.defaultTransform = 'value => value';
exports.defaultInputCssClass = 'jmp-input-field';
exports.defaultOptions = {
    container: '',
    target: undefined,
    shortenTarget: true,
    targetTreeReadOnly: false,
    source: undefined,
    shortenSource: true,
    disableChildWhenParentHasSource: false,
    popupAttach: 'body',
    indent: 15,
    windowProp: '',
    text: {
        tabMapping: 'Mapping',
        tabOutput: 'Output',
        tabOptions: 'Options',
        editTargetBtn: 'Edit Target',
        importTargetBtn: 'Import Target (JSON)',
        viewSourceBtn: 'View Source',
        importSourceBtn: 'Import Source (JSON)',
        theadTargetTitle: 'Target Object',
        theadSourceTitle: 'Source Object',
        theadCol1: 'Fields',
        theadCol2: 'Value Type',
        theadCol3: 'Value Type',
        theadCol4: 'Fields',
        theadCol5: 'Transform Data',
        theadCol6: 'Default Value',
        outputTitle: 'Output',
        codeTitle: 'Code',
        resetOptionsBtn: 'Reset To Default',
        loadCurrentOptionsBtn: 'Load Current Options',
        applyOptionsBtn: 'Apply',
        popupTargetTitle: 'Target',
        importTargetTitle: 'Target Import',
        expandCollapseBtn: 'Expand / Collapse',
        closeTargetPopupBtn: '✕',
        doImportTargetBtn: 'Import',
        popupSourceTitle: 'Source',
        importSourceTitle: 'Source Import',
        closeSourcePopupBtn: '✕',
        doImportSourceBtn: 'Import',
        sourceFilterIcon: '🔎',
        rowClearInputBtn: '✕',
        rowSelectPathBtn: '≡',
        rowAddPathBtn: '+',
        rowRemovePathBtn: '−',
        dataTypeCombined: '...',
        copyBtn: 'copy'
    }
};

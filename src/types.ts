import { Emitter } from 'strict-event-emitter'

export interface Itext {
    [key: string]: string | number;
}

export interface MainLayout {
    strHtml: string
    ids: Partial<CompIds>
}

export interface PopupLayout {
    strHtml: string
    ids: Partial<CompIds>
}

export interface SourceField {
    sourcePath: string
    sourceDataType: string
}

export interface IMapFieldItem {
    targetPath: string
    targetDataType: string
    level: number
    sourceFields: SourceField[]
    transform: string
    defaultValue: any
    displayName: string
    disabled?: boolean
}

export enum RowButtons {
    ClearSourcePathData = 'clear-source-path-data',
    SelectSourcePath    = 'select-source-path',
    AddMoreSourceField  = 'add-more-source-field',
    RemoveSourceField   = 'remove-source-field'
}

export enum RowInputs {
    InputSourcePath    = 'input-source-path',
    InputDefaultValue  = 'input-default-value',
    InputTransformData = 'input-transform-data'
}

export const MapperOptions = {
    alwaysTransform: false,
    alwaysSet      : true,
    flatten        : false
}

export const cssPrefix: string    = 'jmp-'
export const targetPathAttr       = 'data-target-path'
export const defaultTransform     = 'value => value'
export const defaultInputCssClass = 'jmp-input-field'

export interface Ii18nObj {
    tabMapping: string
    tabOutput: string
    tabOptions: string
    editTargetBtn: string
    importTargetBtn: string
    viewSourceBtn: string
    importSourceBtn: string
    theadTargetTitle: string
    theadSourceTitle: string
    theadCol1: string
    theadCol2: string
    theadCol3: string
    theadCol4: string
    theadCol5: string
    theadCol6: string
    outputTitle: string
    codeTitle: string
    resetOptionsBtn: string
    loadCurrentOptionsBtn: string
    applyOptionsBtn: string
    popupTargetTitle: string
    importTargetTitle: string
    expandCollapseBtn: string
    closeTargetPopupBtn: string
    doImportTargetBtn: string
    popupSourceTitle: string
    importSourceTitle: string
    closeSourcePopupBtn: string
    doImportSourceBtn: string
    sourceFilterIcon: string
    rowClearInputBtn: string
    rowSelectPathBtn: string
    rowAddPathBtn: string
    rowRemovePathBtn: string
    dataTypeCombined: string
    copyBtn: string
}

export interface IOptions {
    container: string
    target: object | undefined
    shortenTarget?: boolean
    targetTreeReadOnly: boolean
    source: object | undefined
    shortenSource?: boolean
    disableChildWhenParentHasSource: boolean,
    indent: number
    popupAttach: string
    windowProp: any
    text: Ii18nObj
}

export interface SelectingSource {
    targetPath: string
    index: number
}

export type JPEvents = {
    targetImport: [any],
    sourceImport: [any],
    change: [targetSchema: any, sourceSchema: any, mappingFields: IMapFieldItem[], code: string],
    configs: [oldConfigs: Partial<IOptions>, newConfigs: Partial<IOptions>]
    output: [any]
}

export type JPEmitter = Emitter<JPEvents>

export const defaultOptions: IOptions = {
    container                      : '',
    target                         : undefined,
    shortenTarget                  : true,
    targetTreeReadOnly             : false,
    source                         : undefined,
    shortenSource                  : true,
    disableChildWhenParentHasSource: false,
    popupAttach                    : 'body',
    indent                         : 15,
    windowProp                     : '',
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
}


export interface CompIds {
    container: string
    table: string
    tableBody: string
    importTargetBtn: string
    editTargetBtn: string
    tabs: string
    viewSourceBtn: string
    importSourceBtn: string
    targetTreePopup: string
    targetTreeWrap: string
    targetExpandCollapseBtn: string
    targetPopupCloseBtn: string
    targetTextarea: string
    targetSubmitBtn: string
    sourceTreePopup: string
    sourceTreeWrap: string
    sourceFilter: string
    sourceExpandCollapseBtn: string
    sourcePopupCloseBtn: string
    sourceTextarea: string
    sourceSubmitBtn: string,
    outputCodeArea: string
    outputDataArea: string
    optionsArea: string
    optionsChangeBtn: string
    optionsResetBtn: string
    optionsCurrentBtn: string
}

export interface ITreeSourcePath {
    realPath: any[]
    mappingPath: string
}
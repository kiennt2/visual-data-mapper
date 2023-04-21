import {
    PopupLayout,
    CompIds,
    MainLayout,
    IMapFieldItem,
    SourceField,
    IOptions,
    RowInputs,
    RowButtons,
    MapperOptions,
    defaultInputCssClass,
    targetPathAttr,
    cssPrefix,
    defaultTransform
} from '../types'
import helper from '../helper'
import kindOf from 'kind-of'
import lodash from 'lodash'

export const getPopupLayout = (optionsText: Partial<IOptions>): PopupLayout => {
    const genId: string         = helper.genId()
    const ids: Partial<CompIds> = {
        targetTreePopup        : genId + '-targetTreePopup',
        targetPopupCloseBtn    : genId + '-targetPopupCloseBtn',
        targetTreeWrap         : genId + '-targetTreeWrap',
        targetTextarea         : genId + '-targetTextarea',
        targetSubmitBtn        : genId + '-targetSubmitBtn',
        sourceTreePopup        : genId + '-sourceTreePopup',
        sourceTreeWrap         : genId + '-sourceTreeWrap',
        sourceFilter           : genId + '-sourceFilter',
        sourcePopupCloseBtn    : genId + '-sourcePopupCloseBtn',
        sourceTextarea         : genId + '-sourceTextarea',
        sourceSubmitBtn        : genId + '-sourceSubmitBtn',
        targetExpandCollapseBtn: genId + '-targetExpandCollapseBtn',
        sourceExpandCollapseBtn: genId + '-sourceExpandCollapseBtn'
    }
    //
    const strHtml: string       = `
<div id="${ids.targetTreePopup}" class="${cssPrefix}popup ${cssPrefix}target-popup" data-show=""> 
    <div class="${cssPrefix}popup-layout">       
        <div class="${cssPrefix}popup-header">
            <div>
                <div class="${cssPrefix}popup-title ${cssPrefix}tree-title">
                    <div>
                        <span data-i18n-key="popupTargetTitle">${optionsText.text?.popupTargetTitle}</span>
                        <button id="${ids.targetExpandCollapseBtn}">
                            <span data-id="${ids.targetExpandCollapseBtn}" data-i18n-key="expandCollapseBtn">
                                ${optionsText.text?.expandCollapseBtn}
                            </span>
                        </button>
                    </div>
                </div>
                <div class="${cssPrefix}popup-title ${cssPrefix}import-title">
                    <span data-i18n-key="importTargetTitle">${optionsText.text?.importTargetTitle}</span>
                </div>
                <button id="${ids.targetPopupCloseBtn}" data-btn-type="close">
                    <span data-id="${ids.targetPopupCloseBtn}" data-i18n-key="closeTargetPopupBtn">
                        ${optionsText.text?.closeTargetPopupBtn}
                    </span>
                </button>
            </div>
        </div>
        <div class="${cssPrefix}popup-content">
            <div class="${cssPrefix}popup-block ${cssPrefix}target-tree-wrap">      
                <div id="${ids.targetTreeWrap}" ></div>
            </div>
            <div class="${cssPrefix}popup-block ${cssPrefix}target-import">                
                 <div class="${cssPrefix}import-wrap">
                    <div class="${cssPrefix}import-body">
                        <textarea id="${ids.targetTextarea}" cols="30" rows="10" spellcheck="false"></textarea>
                    </div>
                    <div class="${cssPrefix}import-actions">
                        <button id="${ids.targetSubmitBtn}">
                            <span data-id="${ids.targetSubmitBtn}" data-i18n-key="doImportTargetBtn">
                                ${optionsText.text?.doImportTargetBtn}
                            </span>
                        </button>
                    </div>
                </div>     
            </div>
        </div>
    </div>
</div>
<div id="${ids.sourceTreePopup}" class="${cssPrefix}popup ${cssPrefix}source-popup" data-show="">
    <div class="${cssPrefix}popup-layout">
        <div class="${cssPrefix}popup-header">
            <div>
                <div class="${cssPrefix}popup-title ${cssPrefix}tree-title">
                    <div>
                        <span data-i18n-key="popupSourceTitle">${optionsText.text?.popupSourceTitle}</span>
                        <button id="${ids.sourceExpandCollapseBtn}">
                            <span data-id="${ids.sourceExpandCollapseBtn}" data-i18n-key="expandCollapseBtn">
                                ${optionsText.text?.expandCollapseBtn}
                            </span>
                        </button>
                    </div>                    
                </div>
                <div class="${cssPrefix}popup-title ${cssPrefix}import-title">
                    <span data-i18n-key="importSourceTitle">${optionsText.text?.importSourceTitle}</span>
                </div>
                <button id="${ids.sourcePopupCloseBtn}" data-btn-type="close">
                    <span data-id="${ids.sourcePopupCloseBtn}" data-i18n-key="closeSourcePopupBtn">
                        ${optionsText.text?.closeSourcePopupBtn}
                    </span>
                </button>
            </div>
        </div>
        <div class="${cssPrefix}popup-content">
            <div class="${cssPrefix}popup-block ${cssPrefix}source-tree-wrap">
                <div class="${cssPrefix}tree-with-filter">
                    <div class="${cssPrefix}tree-filter">
                        <span class="${cssPrefix}filter-icon" data-i18n-key="sourceFilterIcon">
                            ${optionsText.text?.sourceFilterIcon}
                        </span>
                        <input type="text" id="${ids.sourceFilter}" spellcheck="false"/>
                    </div>  
                    <div id="${ids.sourceTreeWrap}"></div>
                </div>
            </div>
            <div class="${cssPrefix}popup-block ${cssPrefix}source-import">
                <div class="${cssPrefix}import-wrap">
                    <div class="${cssPrefix}import-body">
                        <textarea id="${ids.sourceTextarea}" cols="30" rows="10" spellcheck="false"></textarea>
                    </div>
                    <div class="${cssPrefix}import-actions">
                        <button id="${ids.sourceSubmitBtn}">
                            <span data-id="${ids.sourceSubmitBtn}" data-i18n-key="doImportSourceBtn">
                                ${optionsText.text?.doImportSourceBtn}
                            </span>
                        </button>
                    </div>
                </div>                
            </div>
        </div>
    </div>        
</div>
`
    return {
        strHtml,
        ids
    }
}

const getLayout: any = (optionsText: Partial<IOptions>): MainLayout => {
    const genId: string         = helper.genId()
    const ids: Partial<CompIds> = {
        container        : genId,
        table            : genId + '-table',
        tableBody        : genId + '-tableBody',
        importTargetBtn  : genId + '-importTargetBtn',
        editTargetBtn    : genId + '-editTargetBtn',
        tabs             : genId + '-tabs',
        viewSourceBtn    : genId + '-viewSourceBtn',
        importSourceBtn  : genId + '-importSourceBtn',
        outputCodeArea   : genId + '-outputCodeArea',
        outputDataArea   : genId + '-outputDataArea',
        optionsArea      : genId + '-optionsArea',
        optionsResetBtn  : genId + '-optionsResetBtn',
        optionsCurrentBtn: genId + '-optionsCurrentBtn',
        optionsChangeBtn : genId + '-optionsChangeBtn'
    }
    //
    const layout: any           = `
<div id="${ids.container}" class="${cssPrefix}wrap" data-tab="table">
    <div id="${ids.tabs}" class="${cssPrefix}tabs">
        <button data-tab="table"><span data-tab="table" data-i18n-key="tabMapping">${optionsText.text?.tabMapping}</span></button>
        <button data-tab="output"><span data-tab="output" data-i18n-key="tabOutput">${optionsText.text?.tabOutput}</span></button>
        <button data-tab="options"><span data-tab="options" data-i18n-key="tabOptions">${optionsText.text?.tabOptions}</span></button>
    </div>
    <div class="${cssPrefix}sections">
        <div class="${cssPrefix}table-section">            
            <div class="${cssPrefix}table-wrap">
                <table id="${ids.table}" class="${cssPrefix}table">
                <thead>
                <tr>
                    <th colspan="6">
                        <div class="${cssPrefix}header">
                            <div class="${cssPrefix}header-target-btns">
                                <button id="${ids.editTargetBtn}"><span data-id="${ids.editTargetBtn}" data-i18n-key="editTargetBtn">${optionsText.text?.editTargetBtn}</span></button>
                                <button id="${ids.importTargetBtn}"><span data-id="${ids.importTargetBtn}" data-i18n-key="importTargetBtn">${optionsText.text?.importTargetBtn}</span></button>
                            </div>
                            <div class="${cssPrefix}header-source-btns">
                                <button id="${ids.viewSourceBtn}"><span data-id="${ids.viewSourceBtn}" data-i18n-key="viewSourceBtn">${optionsText.text?.viewSourceBtn}</span></button>
                                <button id="${ids.importSourceBtn}"><span data-id="${ids.importSourceBtn}" data-i18n-key="importSourceBtn">${optionsText.text?.importSourceBtn}</span></button>
                            </div>
                        </div>
                    </th>
                </tr>
                <tr>
                    <th colspan="2"><span data-i18n-key="theadTargetTitle">${optionsText.text?.theadTargetTitle}</span></th>
                    <th colspan="2"><span data-i18n-key="theadSourceTitle">${optionsText.text?.theadSourceTitle}</span></th>
                    <th colspan="2">&nbsp;</th>
                </tr>
                <tr>
                    <th><span data-i18n-key="theadCol1">${optionsText.text?.theadCol1}</span></th>
                    <th><span data-i18n-key="theadCol2">${optionsText.text?.theadCol2}</span></th>
                    <th><span data-i18n-key="theadCol3">${optionsText.text?.theadCol3}</span></th>
                    <th><span data-i18n-key="theadCol4">${optionsText.text?.theadCol4}</span></th>
                    <th><span data-i18n-key="theadCol5">${optionsText.text?.theadCol5}</span></th>
                    <th><span data-i18n-key="theadCol6">${optionsText.text?.theadCol6}</span></th>
                </tr>
                </thead>
                <tbody id="${ids.tableBody}">
                </tbody>
                </table>                
            </div>            
        </div>
        <div class="${cssPrefix}output-section">
            <div class="${cssPrefix}output-block">
                <div class="${cssPrefix}output-data">
                    <div class="${cssPrefix}output-title">
                        <span><span data-i18n-key="outputTitle">${optionsText.text?.outputTitle}</span></span>
                    </div>
                    <div class="${cssPrefix}output-area">
                        <textarea id="${ids.outputDataArea}" readonly spellcheck="false"></textarea>
                        <button class="${cssPrefix}copy-btn" data-element-id="${ids.outputDataArea}">
                            <span data-element-id="${ids.outputDataArea}" data-i18n-key="copyBtn">${optionsText.text?.copyBtn}</span>
                        </button>
                    </div>
                </div>
                <div class="${cssPrefix}output-code">
                    <div class="${cssPrefix}output-title">
                        <span><span data-i18n-key="codeTitle">${optionsText.text?.codeTitle}</span></span>
                    </div>
                    <div class="${cssPrefix}output-area">
                        <textarea id="${ids.outputCodeArea}" readonly spellcheck="false"></textarea>
                        <button class="${cssPrefix}copy-btn" data-element-id="${ids.outputCodeArea}">
                            <span data-element-id="${ids.outputCodeArea}" data-i18n-key="copyBtn">${optionsText.text?.copyBtn}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="${cssPrefix}options-section">
            <div class="${cssPrefix}options-form">
                <div class="${cssPrefix}options-area">
                    <div class="${cssPrefix}options-content">
                        <textarea id="${ids.optionsArea}" spellcheck="false"></textarea>
                        <button class="${cssPrefix}copy-btn" data-element-id="${ids.optionsArea}">
                            <span data-element-id="${ids.optionsArea}" data-i18n-key="copyBtn">${optionsText.text?.copyBtn}</span>
                        </button>
                    </div>
                </div>
                <div class="${cssPrefix}options-btns">
                    <button id="${ids.optionsResetBtn}"><span data-id="${ids.optionsResetBtn}" data-i18n-key="resetOptionsBtn">${optionsText.text?.resetOptionsBtn}</span></button>
                    <button id="${ids.optionsCurrentBtn}"><span data-id="${ids.optionsCurrentBtn}" data-i18n-key="loadCurrentOptionsBtn">${optionsText.text?.loadCurrentOptionsBtn}</span></button>
                    <button id="${ids.optionsChangeBtn}"><span data-id="${ids.optionsChangeBtn}" data-i18n-key="applyOptionsBtn">${optionsText.text?.applyOptionsBtn}</span></button>
                </div>
            </div>
        </div>
    </div>    
</div> 
`
    //
    return {
        strHtml: layout,
        ids
    }
}

const anchorAttr: any = (targetPath: string): string => {
    return targetPathAttr + '="' + (targetPath || '') + '"'
}

const getSourceFieldHtml: any = (field: IMapFieldItem, targetPath: string, optionsText: Partial<IOptions>): string => {
    let html: string = ''
    if (field.sourceFields.length) {
        field.sourceFields.map((f: SourceField, idx: number) => {
            const str = '<div class="source-path">' +
                '<div class="source-path-input">' +
                '<div class="input-field">' +
                '<input class="' + defaultInputCssClass + ' ' + RowInputs.InputSourcePath + ' ' + (f.sourcePath ? 'has-data' : '') + '" data-index="' + idx + '" ' + anchorAttr(targetPath) + ' value="' + f.sourcePath + '" readonly spellcheck="false">' +
                (f.sourcePath ? '<button ' + (field.disabled ? 'disabled="true"' : '') + ' class="' + RowButtons.ClearSourcePathData + '" data-index="' + idx + '" ' + anchorAttr(targetPath) + '>' +
                    '<span data-css-class="' + RowButtons.ClearSourcePathData + '" data-index="' + idx + '" ' + anchorAttr(targetPath) + ' data-i18n-key="rowClearInputBtn">' +
                    (optionsText.text?.rowClearInputBtn) +
                    '</span>' +
                    '</button>' : '') +
                '</div>' +
                '<button ' + (field.disabled ? 'disabled="true"' : '') + ' class="' + RowButtons.SelectSourcePath + '" data-index="' + idx + '" ' + anchorAttr(targetPath) + '>' +
                '<span data-css-class="' + RowButtons.SelectSourcePath + '" data-index="' + idx + '" ' + anchorAttr(targetPath) + ' data-i18n-key="rowSelectPathBtn">' +
                (optionsText.text?.rowSelectPathBtn) +
                '</span>' +
                '</button>' +
                (idx === 0 ?
                        '<button ' + (field.disabled ? 'disabled="true"' : '') + ' class="' + RowButtons.AddMoreSourceField + '" data-index="' + idx + '" ' + anchorAttr(targetPath) + '>' +
                        '<span data-css-class="' + RowButtons.AddMoreSourceField + '" data-index="' + idx + '" ' + anchorAttr(targetPath) + ' data-i18n-key="rowAddPathBtn">' +
                        (optionsText.text?.rowAddPathBtn) +
                        '</span>' +
                        '</button>' :
                        '<button ' + (field.disabled ? 'disabled="true"' : '') + ' class="' + RowButtons.RemoveSourceField + '" data-index="' + idx + '" ' + anchorAttr(targetPath) + '>' +
                        '<span data-css-class="' + RowButtons.RemoveSourceField + '" data-index="' + idx + '" ' + anchorAttr(targetPath) + ' data-i18n-key="rowRemovePathBtn">' +
                        (optionsText.text?.rowRemovePathBtn) +
                        '</span>' +
                        '</button>'
                ) +
                '</div>' +
                '</div>'
            html += str
        })
    }
    return html
}

const getSourceTypeHtml: any = (targetDataType: string, sourceFields: SourceField[], optionsText: Partial<IOptions>): string => {
    if (sourceFields.length > 1) {
        return '<span class="data-type type-combine" data-i18n-key="dataTypeCombined">' + optionsText.text?.dataTypeCombined + '</span>'
    }
    return `
        <span class="data-type${sourceFields[0].sourceDataType !== targetDataType ? ' type-mismatch' : ''}">
            ${helper.typeDisplay(sourceFields[0].sourceDataType)}
        </span>
    `
}

export const RowHtml = (field: IMapFieldItem, indent: number, optionsText: Partial<IOptions>): string => {
    return '<tr ' + anchorAttr(field.targetPath) + (field.disabled ? 'data-disabled="true"' : '') + '>' +
        '<td>' +
        '<span class="target-path" ' + (field.level ? 'style="padding-left:' + (field.level * indent) + 'px;"' : '') + '>' +
        '<span>' + field.displayName + '</span>' +
        '</span>' +
        '</td>' +
        '<td align="center">' +
        '<span class="data-type">' +
        helper.typeDisplay(field.targetDataType) +
        '</span>' +
        '</td>' +
        '<td align="center">' +
        getSourceTypeHtml(field.targetDataType, field.sourceFields, optionsText) +
        '</td>' +
        '<td align="center">' +
        '<div class="source-fields">' +
        getSourceFieldHtml(field, field.targetPath || '', optionsText) +
        '</div>' +
        '</td>' +
        '<td align="center">' +
        '<span class="transform-value">' +
        '<textarea ' + (field.disabled ? 'disabled="true"' : '') + ' class="' + defaultInputCssClass + ' ' + RowInputs.InputTransformData + '" ' + anchorAttr(field.targetPath) + ' rows="' + (field.sourceFields.length > 1 ? field.sourceFields.length + 1 : field.sourceFields.length) + '" cols="30" spellcheck="false">' +
        field.transform +
        '</textarea>' +
        '</span>' +
        '</td>' +
        '<td align="center">' +
        '<span class="default-value">' +
        '<input ' + (field.disabled ? 'disabled="true"' : '') + ' class="' + defaultInputCssClass + ' ' + RowInputs.InputDefaultValue + '" ' + anchorAttr(field.targetPath) + ' value="' + field.defaultValue + '" spellcheck="false"/>' +
        '</span>' +
        '</td>' +
        '</tr>'
}

export const GetMappingFields = (data: any, level?: number, path?: string, skipGenArrayField?: boolean): IMapFieldItem[] => {
    let lvl: number             = level || 0
    let fields: IMapFieldItem[] = []
    if (lodash.isPlainObject(data)) {
        Object.keys(data).forEach((k: string) => {
            const isArr: boolean      = Array.isArray(data[k])
            const prop: any           = path ? path + '.' + k : k
            const targetDataType: any = kindOf(data[k])
            fields.push({
                targetPath    : prop,
                targetDataType: targetDataType,
                level         : lvl,
                sourceFields  : [
                    {
                        sourcePath    : '',
                        sourceDataType: ''
                    }
                ],
                transform     : defaultTransform,
                defaultValue  : helper.getDefaultValueByKind(targetDataType),
                displayName   : k
            })
            if (isArr) {
                const arr: IMapFieldItem[] = GetMappingFields(data[k], lvl, prop, true)
                if (arr.length) {
                    fields = [...fields, ...arr]
                }
            }
            if (lodash.isPlainObject(data[k])) {
                const arr: IMapFieldItem[] = GetMappingFields(data[k], lvl + 1, prop)
                if (arr.length) {
                    fields = [...fields, ...arr]
                }
            }
        })
    } else if (Array.isArray(data)) {
        const p = lvl === 0 ? '[]' : path + '.[]'
        if (!skipGenArrayField) {
            const targetDataType: any = kindOf(data)
            fields.push({
                targetPath    : lvl === 0 ? '[]' : p,
                targetDataType: targetDataType,
                level         : lvl,
                sourceFields  : [
                    {
                        sourcePath    : '',
                        sourceDataType: ''
                    }
                ],
                transform     : defaultTransform,
                defaultValue  : helper.getDefaultValueByKind(targetDataType),
                displayName   : '[ ]'
            })
        }
        data.map((item: any) => {
            const isArr: boolean = Array.isArray(item)
            if (isArr || lodash.isPlainObject(item)) {
                const arr: IMapFieldItem[] = GetMappingFields(item, lvl + 1, p)
                if (arr.length) {
                    fields = [...fields, ...arr]
                }
            }
        })
    }
    return fields
}

export const redrawRow: any = (tbodyId: string, targetPath: string, field: IMapFieldItem, indent: number, optionsText: Partial<IOptions>, beforeRemove?: any, callback?: any): void => {
    const tbody: HTMLElement | null = document.getElementById(tbodyId)
    if (tbody) {
        const currentRow: Element | null = tbody.querySelector('tr[' + targetPathAttr + '="' + targetPath + '"]')
        if (currentRow) {
            if (typeof beforeRemove === 'function') {
                beforeRemove(currentRow)
            }
            currentRow.insertAdjacentHTML('beforebegin', RowHtml(field, indent, optionsText))
            currentRow.remove()
        }
        if (typeof callback === 'function') {
            callback(tbody.querySelector('tr[' + targetPathAttr + '="' + targetPath + '"]'))
        }
    } else {
        if (typeof callback === 'function') {
            callback(null)
        }
    }
}

export const hasSourcePath = (sourceFields: SourceField[]): boolean => {
    let hasPath: boolean = false
    if (sourceFields.length === 1) {
        hasPath = !!sourceFields[0].sourcePath
    } else {
        let hasEmptyPath = false
        sourceFields.map((s: SourceField): void => {
            if (!s.sourcePath) {
                hasEmptyPath = true
            }
        })
        hasPath = !hasEmptyPath
    }
    return hasPath
}

export const mapperGroupFieldsBySourcePath = (fields: IMapFieldItem[], type: 'hasPath' | 'emptyPath'): IMapFieldItem[] => {
    const fieldHasSource: IMapFieldItem[]       = []
    const fieldWithEmptySource: IMapFieldItem[] = []
    fields.map((f: IMapFieldItem) => {
        if (!f.disabled) {
            hasSourcePath(f.sourceFields) ? fieldHasSource.push(f) : fieldWithEmptySource.push(f)
        }
    })
    return type === 'hasPath' ? fieldHasSource : fieldWithEmptySource
}

export const manualSetDefaultValueTemplate = (objName: string, field: IMapFieldItem) => {
    return '!getValue(' + objName + ', "' + field.targetPath + '") && (' + objName + ' = setDefaultValue(' + objName + ', "' + field.targetPath + '", ' + field.defaultValue + ') || ' + objName + ')'
}

export const setDefaultDataForFieldsWithSourcePathEmpty = (fields: IMapFieldItem[]): string => {
    let str: string                                  = ''
    const fieldsWithSourcePathEmpty: IMapFieldItem[] = mapperGroupFieldsBySourcePath(fields, 'emptyPath')
    if (fieldsWithSourcePathEmpty.length) {
        let setValueStr = ''
        fieldsWithSourcePathEmpty.map((f: IMapFieldItem) => {
            setValueStr += manualSetDefaultValueTemplate('output', f) + ';\n'
        })
        str += setValueStr
    }
    return str
}

export const mapperFields = (fields: IMapFieldItem[]): string => {
    let str: string                = ''
    const GFields: IMapFieldItem[] = mapperGroupFieldsBySourcePath(fields, 'hasPath')
    GFields.map((f: IMapFieldItem, index: number) => {
        let sourcePath: string = ''
        if (f.sourceFields.length === 1) {
            sourcePath = '"' + f.sourceFields[0].sourcePath + '"'
        } else {
            let sourceStr: any = ''
            f.sourceFields.map((s: SourceField, sIdx: number): void => {
                sourceStr += '"' + s.sourcePath + '"' + (sIdx < f.sourceFields.length - 1 ? ', ' : '')
            })
            sourcePath = '[' + sourceStr + ']'
        }
        str += '.map(' + sourcePath + ').to("' + f.targetPath + '", ' + f.transform + ', ' + f.defaultValue + ')\n'
    })
    str += '.execute(source)'
    return str
}

export const jsCode = (fields: IMapFieldItem[], sourceSchema: any): string => {
    return `// Use Import
import mapFactory, { getValue, setValue } from 'map-factory';

// Or Require
// const mapFactory             = require('map-factory');
// const { getValue, setValue } = require("map-factory");

function setDefaultValue(obj, path, value) {
    let result = undefined 
    try {
        result = setValue(obj, path, value)
    } catch (e) {
        console.log('Cannot set default value to => ' + path + ' => current output data struct is not match')
        console.log('=> current output data:', obj)
    }
    return result
}
        
const source = ${sourceSchema ? JSON.stringify(sourceSchema, null, 4) : 'null'};

const options = ${JSON.stringify(MapperOptions, null, 4)};

const mapper = mapFactory(options);

let output = mapper${mapperFields(fields)} || undefined;

${setDefaultDataForFieldsWithSourcePathEmpty(fields)}
console.log(output)
`
}

export default getLayout
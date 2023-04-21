"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsCode = exports.mapperFields = exports.setDefaultDataForFieldsWithSourcePathEmpty = exports.manualSetDefaultValueTemplate = exports.mapperGroupFieldsBySourcePath = exports.hasSourcePath = exports.redrawRow = exports.GetMappingFields = exports.RowHtml = exports.getPopupLayout = void 0;
const types_1 = require("../types");
const helper_1 = __importDefault(require("../helper"));
const kind_of_1 = __importDefault(require("kind-of"));
const lodash_1 = __importDefault(require("lodash"));
const getPopupLayout = (optionsText) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    const genId = helper_1.default.genId();
    const ids = {
        targetTreePopup: genId + '-targetTreePopup',
        targetPopupCloseBtn: genId + '-targetPopupCloseBtn',
        targetTreeWrap: genId + '-targetTreeWrap',
        targetTextarea: genId + '-targetTextarea',
        targetSubmitBtn: genId + '-targetSubmitBtn',
        sourceTreePopup: genId + '-sourceTreePopup',
        sourceTreeWrap: genId + '-sourceTreeWrap',
        sourceFilter: genId + '-sourceFilter',
        sourcePopupCloseBtn: genId + '-sourcePopupCloseBtn',
        sourceTextarea: genId + '-sourceTextarea',
        sourceSubmitBtn: genId + '-sourceSubmitBtn',
        targetExpandCollapseBtn: genId + '-targetExpandCollapseBtn',
        sourceExpandCollapseBtn: genId + '-sourceExpandCollapseBtn'
    };
    //
    const strHtml = `
<div id="${ids.targetTreePopup}" class="${types_1.cssPrefix}popup ${types_1.cssPrefix}target-popup" data-show=""> 
    <div class="${types_1.cssPrefix}popup-layout">       
        <div class="${types_1.cssPrefix}popup-header">
            <div>
                <div class="${types_1.cssPrefix}popup-title ${types_1.cssPrefix}tree-title">
                    <div>
                        <span data-i18n-key="popupTargetTitle">${(_a = optionsText.text) === null || _a === void 0 ? void 0 : _a.popupTargetTitle}</span>
                        <button id="${ids.targetExpandCollapseBtn}">
                            <span data-id="${ids.targetExpandCollapseBtn}" data-i18n-key="expandCollapseBtn">
                                ${(_b = optionsText.text) === null || _b === void 0 ? void 0 : _b.expandCollapseBtn}
                            </span>
                        </button>
                    </div>
                </div>
                <div class="${types_1.cssPrefix}popup-title ${types_1.cssPrefix}import-title">
                    <span data-i18n-key="importTargetTitle">${(_c = optionsText.text) === null || _c === void 0 ? void 0 : _c.importTargetTitle}</span>
                </div>
                <button id="${ids.targetPopupCloseBtn}" data-btn-type="close">
                    <span data-id="${ids.targetPopupCloseBtn}" data-i18n-key="closeTargetPopupBtn">
                        ${(_d = optionsText.text) === null || _d === void 0 ? void 0 : _d.closeTargetPopupBtn}
                    </span>
                </button>
            </div>
        </div>
        <div class="${types_1.cssPrefix}popup-content">
            <div class="${types_1.cssPrefix}popup-block ${types_1.cssPrefix}target-tree-wrap">      
                <div id="${ids.targetTreeWrap}" ></div>
            </div>
            <div class="${types_1.cssPrefix}popup-block ${types_1.cssPrefix}target-import">                
                 <div class="${types_1.cssPrefix}import-wrap">
                    <div class="${types_1.cssPrefix}import-body">
                        <textarea id="${ids.targetTextarea}" cols="30" rows="10" spellcheck="false"></textarea>
                    </div>
                    <div class="${types_1.cssPrefix}import-actions">
                        <button id="${ids.targetSubmitBtn}">
                            <span data-id="${ids.targetSubmitBtn}" data-i18n-key="doImportTargetBtn">
                                ${(_e = optionsText.text) === null || _e === void 0 ? void 0 : _e.doImportTargetBtn}
                            </span>
                        </button>
                    </div>
                </div>     
            </div>
        </div>
    </div>
</div>
<div id="${ids.sourceTreePopup}" class="${types_1.cssPrefix}popup ${types_1.cssPrefix}source-popup" data-show="">
    <div class="${types_1.cssPrefix}popup-layout">
        <div class="${types_1.cssPrefix}popup-header">
            <div>
                <div class="${types_1.cssPrefix}popup-title ${types_1.cssPrefix}tree-title">
                    <div>
                        <span data-i18n-key="popupSourceTitle">${(_f = optionsText.text) === null || _f === void 0 ? void 0 : _f.popupSourceTitle}</span>
                        <button id="${ids.sourceExpandCollapseBtn}">
                            <span data-id="${ids.sourceExpandCollapseBtn}" data-i18n-key="expandCollapseBtn">
                                ${(_g = optionsText.text) === null || _g === void 0 ? void 0 : _g.expandCollapseBtn}
                            </span>
                        </button>
                    </div>                    
                </div>
                <div class="${types_1.cssPrefix}popup-title ${types_1.cssPrefix}import-title">
                    <span data-i18n-key="importSourceTitle">${(_h = optionsText.text) === null || _h === void 0 ? void 0 : _h.importSourceTitle}</span>
                </div>
                <button id="${ids.sourcePopupCloseBtn}" data-btn-type="close">
                    <span data-id="${ids.sourcePopupCloseBtn}" data-i18n-key="closeSourcePopupBtn">
                        ${(_j = optionsText.text) === null || _j === void 0 ? void 0 : _j.closeSourcePopupBtn}
                    </span>
                </button>
            </div>
        </div>
        <div class="${types_1.cssPrefix}popup-content">
            <div class="${types_1.cssPrefix}popup-block ${types_1.cssPrefix}source-tree-wrap">
                <div class="${types_1.cssPrefix}tree-with-filter">
                    <div class="${types_1.cssPrefix}tree-filter">
                        <span class="${types_1.cssPrefix}filter-icon" data-i18n-key="sourceFilterIcon">
                            ${(_k = optionsText.text) === null || _k === void 0 ? void 0 : _k.sourceFilterIcon}
                        </span>
                        <input type="text" id="${ids.sourceFilter}" spellcheck="false"/>
                    </div>  
                    <div id="${ids.sourceTreeWrap}"></div>
                </div>
            </div>
            <div class="${types_1.cssPrefix}popup-block ${types_1.cssPrefix}source-import">
                <div class="${types_1.cssPrefix}import-wrap">
                    <div class="${types_1.cssPrefix}import-body">
                        <textarea id="${ids.sourceTextarea}" cols="30" rows="10" spellcheck="false"></textarea>
                    </div>
                    <div class="${types_1.cssPrefix}import-actions">
                        <button id="${ids.sourceSubmitBtn}">
                            <span data-id="${ids.sourceSubmitBtn}" data-i18n-key="doImportSourceBtn">
                                ${(_l = optionsText.text) === null || _l === void 0 ? void 0 : _l.doImportSourceBtn}
                            </span>
                        </button>
                    </div>
                </div>                
            </div>
        </div>
    </div>        
</div>
`;
    return {
        strHtml,
        ids
    };
};
exports.getPopupLayout = getPopupLayout;
const getLayout = (optionsText) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
    const genId = helper_1.default.genId();
    const ids = {
        container: genId,
        table: genId + '-table',
        tableBody: genId + '-tableBody',
        importTargetBtn: genId + '-importTargetBtn',
        editTargetBtn: genId + '-editTargetBtn',
        tabs: genId + '-tabs',
        viewSourceBtn: genId + '-viewSourceBtn',
        importSourceBtn: genId + '-importSourceBtn',
        outputCodeArea: genId + '-outputCodeArea',
        outputDataArea: genId + '-outputDataArea',
        optionsArea: genId + '-optionsArea',
        optionsResetBtn: genId + '-optionsResetBtn',
        optionsCurrentBtn: genId + '-optionsCurrentBtn',
        optionsChangeBtn: genId + '-optionsChangeBtn'
    };
    //
    const layout = `
<div id="${ids.container}" class="${types_1.cssPrefix}wrap" data-tab="table">
    <div id="${ids.tabs}" class="${types_1.cssPrefix}tabs">
        <button data-tab="table"><span data-tab="table" data-i18n-key="tabMapping">${(_a = optionsText.text) === null || _a === void 0 ? void 0 : _a.tabMapping}</span></button>
        <button data-tab="output"><span data-tab="output" data-i18n-key="tabOutput">${(_b = optionsText.text) === null || _b === void 0 ? void 0 : _b.tabOutput}</span></button>
        <button data-tab="options"><span data-tab="options" data-i18n-key="tabOptions">${(_c = optionsText.text) === null || _c === void 0 ? void 0 : _c.tabOptions}</span></button>
    </div>
    <div class="${types_1.cssPrefix}sections">
        <div class="${types_1.cssPrefix}table-section">            
            <div class="${types_1.cssPrefix}table-wrap">
                <table id="${ids.table}" class="${types_1.cssPrefix}table">
                <thead>
                <tr>
                    <th colspan="6">
                        <div class="${types_1.cssPrefix}header">
                            <div class="${types_1.cssPrefix}header-target-btns">
                                <button id="${ids.editTargetBtn}"><span data-id="${ids.editTargetBtn}" data-i18n-key="editTargetBtn">${(_d = optionsText.text) === null || _d === void 0 ? void 0 : _d.editTargetBtn}</span></button>
                                <button id="${ids.importTargetBtn}"><span data-id="${ids.importTargetBtn}" data-i18n-key="importTargetBtn">${(_e = optionsText.text) === null || _e === void 0 ? void 0 : _e.importTargetBtn}</span></button>
                            </div>
                            <div class="${types_1.cssPrefix}header-source-btns">
                                <button id="${ids.viewSourceBtn}"><span data-id="${ids.viewSourceBtn}" data-i18n-key="viewSourceBtn">${(_f = optionsText.text) === null || _f === void 0 ? void 0 : _f.viewSourceBtn}</span></button>
                                <button id="${ids.importSourceBtn}"><span data-id="${ids.importSourceBtn}" data-i18n-key="importSourceBtn">${(_g = optionsText.text) === null || _g === void 0 ? void 0 : _g.importSourceBtn}</span></button>
                            </div>
                        </div>
                    </th>
                </tr>
                <tr>
                    <th colspan="2"><span data-i18n-key="theadTargetTitle">${(_h = optionsText.text) === null || _h === void 0 ? void 0 : _h.theadTargetTitle}</span></th>
                    <th colspan="2"><span data-i18n-key="theadSourceTitle">${(_j = optionsText.text) === null || _j === void 0 ? void 0 : _j.theadSourceTitle}</span></th>
                    <th colspan="2">&nbsp;</th>
                </tr>
                <tr>
                    <th><span data-i18n-key="theadCol1">${(_k = optionsText.text) === null || _k === void 0 ? void 0 : _k.theadCol1}</span></th>
                    <th><span data-i18n-key="theadCol2">${(_l = optionsText.text) === null || _l === void 0 ? void 0 : _l.theadCol2}</span></th>
                    <th><span data-i18n-key="theadCol3">${(_m = optionsText.text) === null || _m === void 0 ? void 0 : _m.theadCol3}</span></th>
                    <th><span data-i18n-key="theadCol4">${(_o = optionsText.text) === null || _o === void 0 ? void 0 : _o.theadCol4}</span></th>
                    <th><span data-i18n-key="theadCol5">${(_p = optionsText.text) === null || _p === void 0 ? void 0 : _p.theadCol5}</span></th>
                    <th><span data-i18n-key="theadCol6">${(_q = optionsText.text) === null || _q === void 0 ? void 0 : _q.theadCol6}</span></th>
                </tr>
                </thead>
                <tbody id="${ids.tableBody}">
                </tbody>
                </table>                
            </div>            
        </div>
        <div class="${types_1.cssPrefix}output-section">
            <div class="${types_1.cssPrefix}output-block">
                <div class="${types_1.cssPrefix}output-data">
                    <div class="${types_1.cssPrefix}output-title">
                        <span><span data-i18n-key="outputTitle">${(_r = optionsText.text) === null || _r === void 0 ? void 0 : _r.outputTitle}</span></span>
                    </div>
                    <div class="${types_1.cssPrefix}output-area">
                        <textarea id="${ids.outputDataArea}" readonly spellcheck="false"></textarea>
                        <button class="${types_1.cssPrefix}copy-btn" data-element-id="${ids.outputDataArea}">
                            <span data-element-id="${ids.outputDataArea}" data-i18n-key="copyBtn">${(_s = optionsText.text) === null || _s === void 0 ? void 0 : _s.copyBtn}</span>
                        </button>
                    </div>
                </div>
                <div class="${types_1.cssPrefix}output-code">
                    <div class="${types_1.cssPrefix}output-title">
                        <span><span data-i18n-key="codeTitle">${(_t = optionsText.text) === null || _t === void 0 ? void 0 : _t.codeTitle}</span></span>
                    </div>
                    <div class="${types_1.cssPrefix}output-area">
                        <textarea id="${ids.outputCodeArea}" readonly spellcheck="false"></textarea>
                        <button class="${types_1.cssPrefix}copy-btn" data-element-id="${ids.outputCodeArea}">
                            <span data-element-id="${ids.outputCodeArea}" data-i18n-key="copyBtn">${(_u = optionsText.text) === null || _u === void 0 ? void 0 : _u.copyBtn}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="${types_1.cssPrefix}options-section">
            <div class="${types_1.cssPrefix}options-form">
                <div class="${types_1.cssPrefix}options-area">
                    <div class="${types_1.cssPrefix}options-content">
                        <textarea id="${ids.optionsArea}" spellcheck="false"></textarea>
                        <button class="${types_1.cssPrefix}copy-btn" data-element-id="${ids.optionsArea}">
                            <span data-element-id="${ids.optionsArea}" data-i18n-key="copyBtn">${(_v = optionsText.text) === null || _v === void 0 ? void 0 : _v.copyBtn}</span>
                        </button>
                    </div>
                </div>
                <div class="${types_1.cssPrefix}options-btns">
                    <button id="${ids.optionsResetBtn}"><span data-id="${ids.optionsResetBtn}" data-i18n-key="resetOptionsBtn">${(_w = optionsText.text) === null || _w === void 0 ? void 0 : _w.resetOptionsBtn}</span></button>
                    <button id="${ids.optionsCurrentBtn}"><span data-id="${ids.optionsCurrentBtn}" data-i18n-key="loadCurrentOptionsBtn">${(_x = optionsText.text) === null || _x === void 0 ? void 0 : _x.loadCurrentOptionsBtn}</span></button>
                    <button id="${ids.optionsChangeBtn}"><span data-id="${ids.optionsChangeBtn}" data-i18n-key="applyOptionsBtn">${(_y = optionsText.text) === null || _y === void 0 ? void 0 : _y.applyOptionsBtn}</span></button>
                </div>
            </div>
        </div>
    </div>    
</div> 
`;
    //
    return {
        strHtml: layout,
        ids
    };
};
const anchorAttr = (targetPath) => {
    return types_1.targetPathAttr + '="' + (targetPath || '') + '"';
};
const getSourceFieldHtml = (field, targetPath, optionsText) => {
    let html = '';
    if (field.sourceFields.length) {
        field.sourceFields.map((f, idx) => {
            var _a, _b, _c, _d;
            const str = '<div class="source-path">' +
                '<div class="source-path-input">' +
                '<div class="input-field">' +
                '<input class="' + types_1.defaultInputCssClass + ' ' + types_1.RowInputs.InputSourcePath + ' ' + (f.sourcePath ? 'has-data' : '') + '" data-index="' + idx + '" ' + anchorAttr(targetPath) + ' value="' + f.sourcePath + '" readonly spellcheck="false">' +
                (f.sourcePath ? '<button ' + (field.disabled ? 'disabled="true"' : '') + ' class="' + types_1.RowButtons.ClearSourcePathData + '" data-index="' + idx + '" ' + anchorAttr(targetPath) + '>' +
                    '<span data-css-class="' + types_1.RowButtons.ClearSourcePathData + '" data-index="' + idx + '" ' + anchorAttr(targetPath) + ' data-i18n-key="rowClearInputBtn">' +
                    ((_a = optionsText.text) === null || _a === void 0 ? void 0 : _a.rowClearInputBtn) +
                    '</span>' +
                    '</button>' : '') +
                '</div>' +
                '<button ' + (field.disabled ? 'disabled="true"' : '') + ' class="' + types_1.RowButtons.SelectSourcePath + '" data-index="' + idx + '" ' + anchorAttr(targetPath) + '>' +
                '<span data-css-class="' + types_1.RowButtons.SelectSourcePath + '" data-index="' + idx + '" ' + anchorAttr(targetPath) + ' data-i18n-key="rowSelectPathBtn">' +
                ((_b = optionsText.text) === null || _b === void 0 ? void 0 : _b.rowSelectPathBtn) +
                '</span>' +
                '</button>' +
                (idx === 0 ?
                    '<button ' + (field.disabled ? 'disabled="true"' : '') + ' class="' + types_1.RowButtons.AddMoreSourceField + '" data-index="' + idx + '" ' + anchorAttr(targetPath) + '>' +
                        '<span data-css-class="' + types_1.RowButtons.AddMoreSourceField + '" data-index="' + idx + '" ' + anchorAttr(targetPath) + ' data-i18n-key="rowAddPathBtn">' +
                        ((_c = optionsText.text) === null || _c === void 0 ? void 0 : _c.rowAddPathBtn) +
                        '</span>' +
                        '</button>' :
                    '<button ' + (field.disabled ? 'disabled="true"' : '') + ' class="' + types_1.RowButtons.RemoveSourceField + '" data-index="' + idx + '" ' + anchorAttr(targetPath) + '>' +
                        '<span data-css-class="' + types_1.RowButtons.RemoveSourceField + '" data-index="' + idx + '" ' + anchorAttr(targetPath) + ' data-i18n-key="rowRemovePathBtn">' +
                        ((_d = optionsText.text) === null || _d === void 0 ? void 0 : _d.rowRemovePathBtn) +
                        '</span>' +
                        '</button>') +
                '</div>' +
                '</div>';
            html += str;
        });
    }
    return html;
};
const getSourceTypeHtml = (targetDataType, sourceFields, optionsText) => {
    var _a;
    if (sourceFields.length > 1) {
        return '<span class="data-type type-combine" data-i18n-key="dataTypeCombined">' + ((_a = optionsText.text) === null || _a === void 0 ? void 0 : _a.dataTypeCombined) + '</span>';
    }
    return `
        <span class="data-type${sourceFields[0].sourceDataType !== targetDataType ? ' type-mismatch' : ''}">
            ${helper_1.default.typeDisplay(sourceFields[0].sourceDataType)}
        </span>
    `;
};
const RowHtml = (field, indent, optionsText) => {
    return '<tr ' + anchorAttr(field.targetPath) + (field.disabled ? 'data-disabled="true"' : '') + '>' +
        '<td>' +
        '<span class="target-path" ' + (field.level ? 'style="padding-left:' + (field.level * indent) + 'px;"' : '') + '>' +
        '<span>' + field.displayName + '</span>' +
        '</span>' +
        '</td>' +
        '<td align="center">' +
        '<span class="data-type">' +
        helper_1.default.typeDisplay(field.targetDataType) +
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
        '<textarea ' + (field.disabled ? 'disabled="true"' : '') + ' class="' + types_1.defaultInputCssClass + ' ' + types_1.RowInputs.InputTransformData + '" ' + anchorAttr(field.targetPath) + ' rows="' + (field.sourceFields.length > 1 ? field.sourceFields.length + 1 : field.sourceFields.length) + '" cols="30" spellcheck="false">' +
        field.transform +
        '</textarea>' +
        '</span>' +
        '</td>' +
        '<td align="center">' +
        '<span class="default-value">' +
        '<input ' + (field.disabled ? 'disabled="true"' : '') + ' class="' + types_1.defaultInputCssClass + ' ' + types_1.RowInputs.InputDefaultValue + '" ' + anchorAttr(field.targetPath) + ' value="' + field.defaultValue + '" spellcheck="false"/>' +
        '</span>' +
        '</td>' +
        '</tr>';
};
exports.RowHtml = RowHtml;
const GetMappingFields = (data, level, path, skipGenArrayField) => {
    let lvl = level || 0;
    let fields = [];
    if (lodash_1.default.isPlainObject(data)) {
        Object.keys(data).forEach((k) => {
            const isArr = Array.isArray(data[k]);
            const prop = path ? path + '.' + k : k;
            const targetDataType = (0, kind_of_1.default)(data[k]);
            fields.push({
                targetPath: prop,
                targetDataType: targetDataType,
                level: lvl,
                sourceFields: [
                    {
                        sourcePath: '',
                        sourceDataType: ''
                    }
                ],
                transform: types_1.defaultTransform,
                defaultValue: helper_1.default.getDefaultValueByKind(targetDataType),
                displayName: k
            });
            if (isArr) {
                const arr = (0, exports.GetMappingFields)(data[k], lvl, prop, true);
                if (arr.length) {
                    fields = [...fields, ...arr];
                }
            }
            if (lodash_1.default.isPlainObject(data[k])) {
                const arr = (0, exports.GetMappingFields)(data[k], lvl + 1, prop);
                if (arr.length) {
                    fields = [...fields, ...arr];
                }
            }
        });
    }
    else if (Array.isArray(data)) {
        const p = lvl === 0 ? '[]' : path + '.[]';
        if (!skipGenArrayField) {
            const targetDataType = (0, kind_of_1.default)(data);
            fields.push({
                targetPath: lvl === 0 ? '[]' : p,
                targetDataType: targetDataType,
                level: lvl,
                sourceFields: [
                    {
                        sourcePath: '',
                        sourceDataType: ''
                    }
                ],
                transform: types_1.defaultTransform,
                defaultValue: helper_1.default.getDefaultValueByKind(targetDataType),
                displayName: '[ ]'
            });
        }
        data.map((item) => {
            const isArr = Array.isArray(item);
            if (isArr || lodash_1.default.isPlainObject(item)) {
                const arr = (0, exports.GetMappingFields)(item, lvl + 1, p);
                if (arr.length) {
                    fields = [...fields, ...arr];
                }
            }
        });
    }
    return fields;
};
exports.GetMappingFields = GetMappingFields;
const redrawRow = (tbodyId, targetPath, field, indent, optionsText, beforeRemove, callback) => {
    const tbody = document.getElementById(tbodyId);
    if (tbody) {
        const currentRow = tbody.querySelector('tr[' + types_1.targetPathAttr + '="' + targetPath + '"]');
        if (currentRow) {
            if (typeof beforeRemove === 'function') {
                beforeRemove(currentRow);
            }
            currentRow.insertAdjacentHTML('beforebegin', (0, exports.RowHtml)(field, indent, optionsText));
            currentRow.remove();
        }
        if (typeof callback === 'function') {
            callback(tbody.querySelector('tr[' + types_1.targetPathAttr + '="' + targetPath + '"]'));
        }
    }
    else {
        if (typeof callback === 'function') {
            callback(null);
        }
    }
};
exports.redrawRow = redrawRow;
const hasSourcePath = (sourceFields) => {
    let hasPath = false;
    if (sourceFields.length === 1) {
        hasPath = !!sourceFields[0].sourcePath;
    }
    else {
        let hasEmptyPath = false;
        sourceFields.map((s) => {
            if (!s.sourcePath) {
                hasEmptyPath = true;
            }
        });
        hasPath = !hasEmptyPath;
    }
    return hasPath;
};
exports.hasSourcePath = hasSourcePath;
const mapperGroupFieldsBySourcePath = (fields, type) => {
    const fieldHasSource = [];
    const fieldWithEmptySource = [];
    fields.map((f) => {
        if (!f.disabled) {
            (0, exports.hasSourcePath)(f.sourceFields) ? fieldHasSource.push(f) : fieldWithEmptySource.push(f);
        }
    });
    return type === 'hasPath' ? fieldHasSource : fieldWithEmptySource;
};
exports.mapperGroupFieldsBySourcePath = mapperGroupFieldsBySourcePath;
const manualSetDefaultValueTemplate = (objName, field) => {
    return '!getValue(' + objName + ', "' + field.targetPath + '") && (' + objName + ' = setDefaultValue(' + objName + ', "' + field.targetPath + '", ' + field.defaultValue + ') || ' + objName + ')';
};
exports.manualSetDefaultValueTemplate = manualSetDefaultValueTemplate;
const setDefaultDataForFieldsWithSourcePathEmpty = (fields) => {
    let str = '';
    const fieldsWithSourcePathEmpty = (0, exports.mapperGroupFieldsBySourcePath)(fields, 'emptyPath');
    if (fieldsWithSourcePathEmpty.length) {
        let setValueStr = '';
        fieldsWithSourcePathEmpty.map((f) => {
            setValueStr += (0, exports.manualSetDefaultValueTemplate)('output', f) + ';\n';
        });
        str += setValueStr;
    }
    return str;
};
exports.setDefaultDataForFieldsWithSourcePathEmpty = setDefaultDataForFieldsWithSourcePathEmpty;
const mapperFields = (fields) => {
    let str = '';
    const GFields = (0, exports.mapperGroupFieldsBySourcePath)(fields, 'hasPath');
    GFields.map((f, index) => {
        let sourcePath = '';
        if (f.sourceFields.length === 1) {
            sourcePath = '"' + f.sourceFields[0].sourcePath + '"';
        }
        else {
            let sourceStr = '';
            f.sourceFields.map((s, sIdx) => {
                sourceStr += '"' + s.sourcePath + '"' + (sIdx < f.sourceFields.length - 1 ? ', ' : '');
            });
            sourcePath = '[' + sourceStr + ']';
        }
        str += '.map(' + sourcePath + ').to("' + f.targetPath + '", ' + f.transform + ', ' + f.defaultValue + ')\n';
    });
    str += '.execute(source)';
    return str;
};
exports.mapperFields = mapperFields;
const jsCode = (fields, sourceSchema) => {
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

const options = ${JSON.stringify(types_1.MapperOptions, null, 4)};

const mapper = mapFactory(options);

let output = mapper${(0, exports.mapperFields)(fields)} || undefined;

${(0, exports.setDefaultDataForFieldsWithSourcePathEmpty)(fields)}
console.log(output)
`;
};
exports.jsCode = jsCode;
exports.default = getLayout;

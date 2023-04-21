import getLayout, { GetMappingFields, RowHtml, redrawRow, jsCode, mapperFields, mapperGroupFieldsBySourcePath, getPopupLayout, hasSourcePath } from './layout';
import { RowButtons, RowInputs, defaultTransform, targetPathAttr, defaultOptions, defaultInputCssClass, MapperOptions } from './types';
import { EventEmitter } from 'events';
import mapFactory, { getValue as objGetValue, setValue as objSetValue } from 'map-factory';
import helper from './helper';
import kindOf from 'kind-of';
import lodash from 'lodash';
//
const JSONTreeView = require('json-tree-view');
export class JsonMapping extends EventEmitter {
    constructor(opt) {
        super();
        this.options = lodash.cloneDeep(defaultOptions);
        this.domIds = {
            container: '',
            table: '',
            tableBody: '',
            importTargetBtn: '',
            editTargetBtn: '',
            tabs: '',
            viewSourceBtn: '',
            importSourceBtn: '',
            targetTreePopup: '',
            targetTreeWrap: '',
            targetExpandCollapseBtn: '',
            targetPopupCloseBtn: '',
            targetTextarea: '',
            targetSubmitBtn: '',
            sourceTreePopup: '',
            sourceTreeWrap: '',
            sourceFilter: '',
            sourceExpandCollapseBtn: '',
            sourcePopupCloseBtn: '',
            sourceTextarea: '',
            sourceSubmitBtn: '',
            outputCodeArea: '',
            outputDataArea: '',
            optionsArea: '',
            optionsResetBtn: '',
            optionsCurrentBtn: '',
            optionsChangeBtn: ''
        };
        this.targetSchema = undefined;
        this.sourceSchema = undefined;
        this.targetTreeExpanded = true;
        this.sourceTreeExpanded = true;
        this.fields = [];
        this.selectingSourcePath = {
            targetPath: '',
            index: 0
        };
        this.outputDataDebounce = undefined;
        this.init = (container) => {
            this.targetSchema = this.getSchema(this.options.target, this.options.shortenTarget);
            this.sourceSchema = this.getSchema(this.options.source, this.options.shortenSource);
            if (container) {
                const i18nObj = { text: this.options.text };
                const layout = getLayout(i18nObj);
                const popup = getPopupLayout(i18nObj);
                this.domIds = Object.assign({}, layout.ids, popup.ids);
                container.innerHTML = layout.strHtml;
                this.initPopupHtml(popup);
                //
                this.buildTableRows(this.targetSchema);
                this.initTargetTree();
                this.initSourceTree();
                //
                this.handleRowListener = this.handleRowListener.bind(this);
                this.removeListenerFromRow = this.removeListenerFromRow.bind(this);
                this.onRowClick = this.onRowClick.bind(this);
                this.rowOnInputChange = this.rowOnInputChange.bind(this);
                this.handleTargetJsonChange = this.handleTargetJsonChange.bind(this);
                this.handleFilterSourceTree = this.handleFilterSourceTree.bind(this);
                this.handleSourceJsonClick = this.handleSourceJsonClick.bind(this);
                this.handleOtherButtonClickEvent();
                this.handleTabsButtonClick = this.handleTabsButtonClick.bind(this);
                this.handleSingleButtonClick = this.handleSingleButtonClick.bind(this);
                this.handleCopyEvent = this.handleCopyEvent.bind(this);
                //
                // 1st time gen data
                this.setDataToCodeArea();
                this.setDataToOptionsArea();
                this.setDataToOutputArea();
                //
                this.addWindowProp(this.options.windowProp);
            }
            else {
                throw new Error('container doesn\'t exist!');
            }
        };
        this.setConfigs = (configs) => {
            let conf = configs;
            if (!configs) {
                const area = document.getElementById(this.domIds.optionsArea);
                if (area) {
                    try {
                        conf = JSON.parse(area.value);
                    }
                    catch (e) {
                        console.log(e.message);
                    }
                }
            }
            if (conf) {
                const lastOptions = lodash.cloneDeep(this.options);
                const obj = {};
                Object.keys(this.options).forEach((k) => {
                    if (lodash.has(conf, k)) {
                        if (k === 'text') {
                            // make sure i18n keys exists
                            obj.text = lodash.merge({}, lodash.cloneDeep(defaultOptions.text), conf.text);
                        }
                        else {
                            obj[k] = conf[k];
                        }
                    }
                });
                this.options = lodash.merge({}, this.options, obj);
                this.doUpdate(lastOptions);
                this.emit('configs', lastOptions, lodash.cloneDeep(this.options));
            }
            else {
                throw new Error('Options Invalid!');
            }
        };
        this.doUpdate = (lastOptions) => {
            var _a;
            const lastTargetSchema = lodash.cloneDeep(this.targetSchema);
            const lastSourceSchema = lodash.cloneDeep(this.sourceSchema);
            this.targetSchema = this.getSchema(this.options.target, this.options.shortenTarget);
            this.sourceSchema = this.getSchema(this.options.source, this.options.shortenSource);
            const targetEqual = lodash.isEqual(lastTargetSchema, this.targetSchema);
            const sourceEqual = lodash.isEqual(lastSourceSchema, this.sourceSchema);
            if (targetEqual && sourceEqual) {
                this.updateRows();
            }
            if (!targetEqual || !sourceEqual) {
                this.buildTableRows(this.targetSchema);
            }
            if (!targetEqual || (lastOptions.targetTreeReadOnly !== this.options.targetTreeReadOnly)) {
                this.setTargetTreeValue(this.targetSchema);
            }
            if (!sourceEqual) {
                this.setSourceTreeValue(this.sourceSchema);
            }
            this.i18nUpdate(helper.compareValueThenGetDiffProps(lastOptions.text, this.options.text));
            if (lastOptions.windowProp && (this.options.windowProp !== lastOptions.windowProp)) {
                this.removeWindowProp(lastOptions.windowProp);
                this.addWindowProp(this.options.windowProp);
            }
            //
            (_a = document.getElementById(this.domIds.container)) === null || _a === void 0 ? void 0 : _a.setAttribute('data-tab', 'table');
            this.emitChange();
        };
        this.initPopupHtml = (popupData) => {
            let popupAttachEle;
            try {
                popupAttachEle = document.querySelector(this.options.popupAttach || 'body');
            }
            catch (e) {
                console.log(e.message);
                console.log('%ccause by option => %cpopupAttach', 'color: black;', 'color: red;font-weight:bold;');
                popupAttachEle = document.querySelector('body');
            }
            if (popupAttachEle) {
                const lastChildEle = popupAttachEle.lastElementChild;
                if (lastChildEle) {
                    lastChildEle.insertAdjacentHTML('afterend', popupData.strHtml);
                }
                else {
                    popupAttachEle.innerHTML = popupData.strHtml;
                }
            }
        };
        this.i18nUpdate = (i18nKeysUpdate) => {
            if (i18nKeysUpdate.length) {
                i18nKeysUpdate.map((k) => {
                    const nodes = document.querySelectorAll('[data-i18n-key="' + k + '"]');
                    if (nodes && nodes.length) {
                        for (let i = 0; i < nodes.length; i++) {
                            try {
                                const n = nodes[i];
                                let txt = n.innerText || n.textContent;
                                txt = txt.trim().toLowerCase();
                                // @ts-ignore
                                const newTxt = this.options.text[k].trim().toLowerCase();
                                if (txt !== newTxt) {
                                    n.innerHTML = newTxt;
                                }
                            }
                            catch (e) {
                                console.log(e.message);
                            }
                        }
                    }
                });
            }
        };
        this.getSchema = (data, shorten) => {
            return shorten ? helper.shortenData(data) : lodash.cloneDeep(data) || {};
        };
        this.importTarget = () => {
            let obj = undefined;
            const txt = document.getElementById(this.domIds.targetTextarea);
            if (txt) {
                try {
                    obj = JSON.parse(txt.value);
                }
                catch (e) {
                    console.log(e);
                }
                if (!obj || (obj === '')) {
                    txt.value = 'JSON Invalid';
                }
                else {
                    this.targetSchema = this.getSchema(obj, this.options.shortenTarget);
                    this.setTargetTreeValue(lodash.cloneDeep(this.targetSchema));
                    this.toggleTreePopup(this.domIds.targetTreePopup, 'tree');
                    this.buildTableRows(this.targetSchema);
                    txt.value = '';
                }
            }
            this.emit('targetImport', obj);
            this.emitChange();
        };
        this.importSource = () => {
            let obj = undefined;
            const txt = document.getElementById(this.domIds.sourceTextarea);
            if (txt) {
                try {
                    obj = JSON.parse(txt.value);
                }
                catch (e) {
                    console.log(e);
                }
                if (!obj || (obj === '')) {
                    txt.value = 'JSON Invalid';
                }
                else {
                    this.sourceSchema = this.getSchema(obj, this.options.shortenSource);
                    this.setSourceTreeValue(lodash.cloneDeep(this.sourceSchema));
                    this.toggleTreePopup(this.domIds.sourceTreePopup, 'tree');
                    txt.value = '';
                }
            }
            this.emit('sourceImport', obj);
            this.emitChange();
        };
        this.toggleTreePopup = (id, block) => {
            const dom = document.getElementById(id);
            if (dom) {
                const currentBlock = dom.getAttribute('data-show');
                if (!currentBlock || (currentBlock !== block)) {
                    dom.setAttribute('data-show', block);
                }
                else {
                    dom.setAttribute('data-show', '');
                }
            }
            if (!dom || !block) {
                this.selectingSourcePath = {
                    targetPath: '',
                    index: 0
                };
                const targetArea = document.getElementById(this.domIds.targetTextarea);
                if (targetArea) {
                    targetArea.value = '';
                }
                const sourceArea = document.getElementById(this.domIds.sourceTextarea);
                if (sourceArea) {
                    sourceArea.value = '';
                }
            }
        };
        this.initTargetTree = () => {
            const view = new JSONTreeView('target', {}, null);
            const wrap = document.getElementById(this.domIds.targetTreeWrap);
            if (wrap) {
                wrap.appendChild(view.dom);
            }
            else {
                document.body.appendChild(view.dom);
            }
            this.targetTreeInstance = view;
            this.setTargetTreeValue(this.targetSchema || {});
            this.handleTargetJsonTreeEvents();
        };
        this.setTargetTreeValue = (value) => {
            this.targetTreeInstance.value = value;
            this.targetTreeInstance.expand(true, true);
            this.targetTreeInstance.withRootName = false;
            this.targetTreeInstance.alwaysShowRoot = true;
            this.targetTreeInstance.readonlyWhenFiltering = true;
            this.targetTreeInstance.readonly = this.options.targetTreeReadOnly;
            this.targetTreeInstance.showCountOfObjectOrArray = true;
            this.targetTreeInstance.refresh(true);
            this.targetTreeExpanded = true;
        };
        this.handleTargetJsonTreeEvents = () => {
            this.targetTreeInstance.on('change', this.handleTargetJsonChange);
            this.targetTreeInstance.on('rename', this.handleTargetJsonChange);
            this.targetTreeInstance.on('delete', this.handleTargetJsonChange);
            this.targetTreeInstance.on('append', this.handleTargetJsonChange);
        };
        this.handleTargetJsonChange = (...args) => {
            console.log(this.targetTreeInstance.value);
            this.options.target = this.targetTreeInstance.value;
            this.targetSchema = this.getSchema(this.options.target, this.options.shortenTarget);
            this.buildTableRows(this.targetSchema);
        };
        this.initSourceTree = () => {
            const view = new JSONTreeView('source', {}, null);
            const wrap = document.getElementById(this.domIds.sourceTreeWrap);
            if (wrap) {
                wrap.appendChild(view.dom);
            }
            else {
                document.body.appendChild(view.dom);
            }
            this.sourceTreeInstance = view;
            this.setSourceTreeValue(this.sourceSchema || {});
            this.handleSourceJsonTreeEvents();
        };
        this.setSourceTreeValue = (value) => {
            this.sourceTreeInstance.value = value;
            this.sourceTreeInstance.expand(true, true);
            this.sourceTreeInstance.withRootName = false;
            this.sourceTreeInstance.alwaysShowRoot = true;
            this.sourceTreeInstance.readonlyWhenFiltering = true;
            this.sourceTreeInstance.readonly = true;
            this.sourceTreeInstance.showCountOfObjectOrArray = true;
            this.sourceTreeInstance.refresh(true);
            this.sourceTreeExpanded = true;
        };
        this.handleSourceJsonTreeEvents = () => {
            var _a;
            (_a = document.getElementById(this.domIds.sourceFilter)) === null || _a === void 0 ? void 0 : _a.addEventListener('input', this.handleFilterSourceTree);
            this.sourceTreeInstance.on('click', this.handleSourceJsonClick);
        };
        this.handleFilterSourceTree = (e) => {
            var _a;
            const key = (_a = e === null || e === void 0 ? void 0 : e.target) === null || _a === void 0 ? void 0 : _a.value;
            this.sourceTreeInstance.filterText = key || '';
        };
        this.handleSourceJsonClick = (self, keyPath) => {
            if (this.selectingSourcePath.targetPath) {
                this.addValueToSourcePathInput(this.selectingSourcePath.targetPath, this.selectingSourcePath.index, this.getSourcePath(keyPath));
            }
        };
        this.removeRowsListener = () => {
            const tbody = document.getElementById(this.domIds.tableBody);
            if (tbody) {
                const rows = tbody.querySelectorAll('tr');
                if (rows && rows.length) {
                    for (let i = 0; i < rows.length; i++) {
                        this.removeListenerFromRow(rows[i]);
                    }
                }
            }
        };
        this.setRowsHtmlToTbody = () => {
            const tbody = document.getElementById(this.domIds.tableBody);
            if (tbody && this.fields.length) {
                let html = '';
                this.fields.map((f) => {
                    html += RowHtml(f, this.options.indent, { text: this.options.text });
                });
                tbody.innerHTML = html;
                const rows = tbody.querySelectorAll('tr');
                if (rows && rows.length) {
                    for (let i = 0; i < rows.length; i++) {
                        this.handleRowListener(rows[i]);
                    }
                }
            }
        };
        this.buildTableRows = (data) => {
            // remove row listener first if data exiting
            if (this.fields.length) {
                this.removeRowsListener();
            }
            // draw table & add listener
            this.fields = GetMappingFields(data);
            this.setRowsHtmlToTbody();
        };
        this.updateRows = () => {
            this.removeRowsListener();
            if (!this.options.disableChildWhenParentHasSource) {
                this.fields = this.fields.map((f) => {
                    f.disabled = false;
                    return f;
                });
            }
            else {
                this.setDisabledToMultipleField();
            }
            this.setRowsHtmlToTbody();
        };
        this.setDisabledToMultipleField = () => {
            let lastTargetPath = '';
            let lastFieldHasSourcePath = false;
            let lastFieldDisabled = false;
            this.fields = this.fields.map((f) => {
                if (f.targetPath.indexOf(lastTargetPath) === 0) {
                    f.disabled = lastFieldHasSourcePath || lastFieldDisabled;
                }
                else {
                    f.disabled = false;
                }
                lastFieldHasSourcePath = hasSourcePath(f.sourceFields) && !f.disabled;
                lastFieldDisabled = f.disabled;
                if (lastFieldHasSourcePath) {
                    lastTargetPath = f.targetPath;
                }
                return f;
            });
        };
        this.handleRowListener = (row, remove) => {
            if (row) {
                remove ? row.removeEventListener('click', this.onRowClick) : row.addEventListener('click', this.onRowClick);
                const inputs = row.getElementsByClassName(defaultInputCssClass);
                if (inputs && inputs.length) {
                    for (let i = 0; i < inputs.length; i++) {
                        remove ? inputs[i].removeEventListener('input', this.rowOnInputChange) : inputs[i].addEventListener('input', this.rowOnInputChange);
                    }
                }
            }
            else {
                throw new Error('Row element not found');
            }
        };
        this.removeListenerFromRow = (row) => {
            this.handleRowListener(row, true);
        };
        this.onRowClick = (e) => {
            const currentTarget = e.target.getAttribute(targetPathAttr);
            if (helper.hasCssClass(e, RowButtons.SelectSourcePath)) {
                this.selectSourcePath(currentTarget, parseInt(e.target.getAttribute('data-index')));
            }
            else if (helper.hasCssClass(e, RowButtons.AddMoreSourceField)) {
                this.addMoreSourceField(currentTarget);
            }
            else if (helper.hasCssClass(e, RowButtons.RemoveSourceField)) {
                this.removeSourceField(currentTarget, parseInt(e.target.getAttribute('data-index')));
            }
            else if (helper.hasCssClass(e, RowButtons.ClearSourcePathData)) {
                this.addValueToSourcePathInput(currentTarget, parseInt(e.target.getAttribute('data-index')), {
                    realPath: [],
                    mappingPath: ''
                });
            }
        };
        this.rowOnInputChange = (e) => {
            const currentTarget = e.target.getAttribute(targetPathAttr);
            if (helper.hasCssClass(e, RowInputs.InputDefaultValue)) {
                this.onInputDefaultValueChange(currentTarget, e.target.value);
            }
            else if (helper.hasCssClass(e, RowInputs.InputTransformData)) {
                this.onInputTransformDataChange(currentTarget, e.target.value);
            }
            // else if (helper.hasCssClass(e, RowInputs.InputSourcePath)) {
            //     console.log('InputSourcePath')
            // }
        };
        this.onInputDefaultValueChange = (targetPath, value) => {
            if (targetPath) {
                this.fields = this.fields.map((f) => {
                    if (f.targetPath === targetPath) {
                        f.defaultValue = value;
                    }
                    return f;
                });
                this.emitChange();
            }
        };
        this.onInputTransformDataChange = (targetPath, value) => {
            if (targetPath) {
                this.fields = this.fields.map((f) => {
                    if (f.targetPath === targetPath) {
                        f.transform = value;
                    }
                    return f;
                });
                this.emitChange();
            }
        };
        this.addMoreSourceField = (targetPath) => {
            if (targetPath) {
                this.fields = this.fields.map((f) => {
                    if (f.targetPath === targetPath) {
                        f.sourceFields.push({
                            sourcePath: '',
                            sourceDataType: ''
                        });
                        f.transform = this.getDefaultTransform(f.sourceFields);
                        redrawRow(this.domIds.tableBody, targetPath, f, this.options.indent, { text: this.options.text }, this.removeListenerFromRow, this.handleRowListener);
                    }
                    return f;
                });
                this.emitChange();
            }
        };
        this.removeSourceField = (targetPath, index) => {
            if (targetPath) {
                this.fields = this.fields.map((f) => {
                    if (f.targetPath === targetPath) {
                        f.sourceFields.splice(index, 1);
                        f.transform = this.getDefaultTransform(f.sourceFields);
                        redrawRow(this.domIds.tableBody, targetPath, f, this.options.indent, { text: this.options.text }, this.removeListenerFromRow, this.handleRowListener);
                    }
                    return f;
                });
                this.emitChange();
            }
        };
        this.addValueToSourcePathInput = (targetPath, index, path) => {
            if (targetPath) {
                let currentRowHasSourceData = false;
                this.fields = this.fields.map((f) => {
                    if (f.targetPath === targetPath) {
                        f.sourceFields = f.sourceFields.map((s, idx) => {
                            if (path.mappingPath) {
                                currentRowHasSourceData = true;
                            }
                            if (index === idx) {
                                s.sourcePath = path.mappingPath;
                                s.sourceDataType = path.realPath && path.realPath.length ? kindOf(lodash.get(this.sourceSchema, path.realPath)) : '';
                                this.toggleTreePopup(this.domIds.sourceTreePopup, '');
                                redrawRow(this.domIds.tableBody, targetPath, f, this.options.indent, { text: this.options.text }, this.removeListenerFromRow, this.handleRowListener);
                            }
                            return s;
                        });
                        f.disabled = false;
                    }
                    else {
                        f.disabled = this.options.disableChildWhenParentHasSource && (f.targetPath.indexOf(targetPath) === 0);
                        if (this.options.disableChildWhenParentHasSource && f.disabled) {
                            redrawRow(this.domIds.tableBody, f.targetPath, f, this.options.indent, { text: this.options.text }, this.removeListenerFromRow);
                        }
                    }
                    return f;
                });
                if (!currentRowHasSourceData && this.options.disableChildWhenParentHasSource) {
                    this.fields = this.fields.map((f) => {
                        if (f.targetPath.indexOf(targetPath) === 0) {
                            f.disabled = false;
                            redrawRow(this.domIds.tableBody, f.targetPath, f, this.options.indent, { text: this.options.text }, this.removeListenerFromRow, this.handleRowListener);
                        }
                        return f;
                    });
                }
                this.emitChange();
            }
        };
        this.getDefaultTransform = (source) => {
            if (source.length === 1) {
                return defaultTransform;
            }
            let fn = '';
            let result = '';
            source.map((s, index) => {
                fn += 'v' + (index + 1) + (index < source.length - 1 ? ', ' : '');
                result += 'v' + (index + 1) + (index < source.length - 1 ? ' + ' : '');
            });
            return `(${fn}) => ${result}`;
        };
        this.handleOtherButtonClickEvent = () => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
            (_a = document.getElementById(this.domIds.tabs)) === null || _a === void 0 ? void 0 : _a.addEventListener('click', this.handleTabsButtonClick);
            (_b = document.getElementById(this.domIds.editTargetBtn)) === null || _b === void 0 ? void 0 : _b.addEventListener('click', this.handleSingleButtonClick);
            (_c = document.getElementById(this.domIds.importTargetBtn)) === null || _c === void 0 ? void 0 : _c.addEventListener('click', this.handleSingleButtonClick);
            (_d = document.getElementById(this.domIds.targetExpandCollapseBtn)) === null || _d === void 0 ? void 0 : _d.addEventListener('click', this.handleSingleButtonClick);
            (_e = document.getElementById(this.domIds.targetPopupCloseBtn)) === null || _e === void 0 ? void 0 : _e.addEventListener('click', this.handleSingleButtonClick);
            (_f = document.getElementById(this.domIds.viewSourceBtn)) === null || _f === void 0 ? void 0 : _f.addEventListener('click', this.handleSingleButtonClick);
            (_g = document.getElementById(this.domIds.importSourceBtn)) === null || _g === void 0 ? void 0 : _g.addEventListener('click', this.handleSingleButtonClick);
            (_h = document.getElementById(this.domIds.sourceExpandCollapseBtn)) === null || _h === void 0 ? void 0 : _h.addEventListener('click', this.handleSingleButtonClick);
            (_j = document.getElementById(this.domIds.sourcePopupCloseBtn)) === null || _j === void 0 ? void 0 : _j.addEventListener('click', this.handleSingleButtonClick);
            (_k = document.getElementById(this.domIds.targetSubmitBtn)) === null || _k === void 0 ? void 0 : _k.addEventListener('click', this.handleSingleButtonClick);
            (_l = document.getElementById(this.domIds.sourceSubmitBtn)) === null || _l === void 0 ? void 0 : _l.addEventListener('click', this.handleSingleButtonClick);
            (_m = document.getElementById(this.domIds.optionsResetBtn)) === null || _m === void 0 ? void 0 : _m.addEventListener('click', this.handleSingleButtonClick);
            (_o = document.getElementById(this.domIds.optionsCurrentBtn)) === null || _o === void 0 ? void 0 : _o.addEventListener('click', this.handleSingleButtonClick);
            (_p = document.getElementById(this.domIds.optionsChangeBtn)) === null || _p === void 0 ? void 0 : _p.addEventListener('click', this.handleSingleButtonClick);
            this.handleCopyButtons();
        };
        this.handleTabsButtonClick = (e) => {
            var _a;
            if (e && e.target) {
                const tab = e.target.getAttribute('data-tab');
                if (tab) {
                    (_a = document.getElementById(this.domIds.container)) === null || _a === void 0 ? void 0 : _a.setAttribute('data-tab', tab);
                }
            }
        };
        this.handleSingleButtonClick = (e) => {
            const id = helper.getButtonId(e);
            switch (id) {
                case this.domIds.editTargetBtn:
                    this.toggleTreePopup(this.domIds.targetTreePopup, 'tree');
                    break;
                case this.domIds.importTargetBtn:
                    this.toggleTreePopup(this.domIds.targetTreePopup, 'import');
                    break;
                case this.domIds.targetExpandCollapseBtn:
                    if (this.targetTreeExpanded) {
                        this.targetTreeInstance.collapse(true, true);
                        this.targetTreeExpanded = false;
                    }
                    else {
                        this.targetTreeInstance.expand(true, true);
                        this.targetTreeExpanded = true;
                    }
                    break;
                case this.domIds.targetPopupCloseBtn:
                    this.toggleTreePopup(this.domIds.targetTreePopup, '');
                    break;
                case this.domIds.viewSourceBtn:
                    this.toggleTreePopup(this.domIds.sourceTreePopup, 'tree');
                    break;
                case this.domIds.importSourceBtn:
                    this.toggleTreePopup(this.domIds.sourceTreePopup, 'import');
                    break;
                case this.domIds.sourceExpandCollapseBtn:
                    if (this.sourceTreeExpanded) {
                        this.sourceTreeInstance.collapse(true, true);
                        this.sourceTreeExpanded = false;
                    }
                    else {
                        this.sourceTreeInstance.expand(true, true);
                        this.sourceTreeExpanded = true;
                    }
                    break;
                case this.domIds.sourcePopupCloseBtn:
                    this.toggleTreePopup(this.domIds.sourceTreePopup, '');
                    break;
                case this.domIds.targetSubmitBtn:
                    this.importTarget();
                    break;
                case this.domIds.sourceSubmitBtn:
                    this.importSource();
                    break;
                case this.domIds.optionsResetBtn:
                    this.setDataToOptionsArea(true);
                    break;
                case this.domIds.optionsCurrentBtn:
                    this.setDataToOptionsArea();
                    break;
                case this.domIds.optionsChangeBtn:
                    this.setConfigs();
                    break;
                default:
                    console.log('ID is empty');
            }
        };
        this.handleCopyButtons = (removeListener) => {
            const buttons = document.querySelectorAll('#' + this.options.container + ' .jmp-copy-btn');
            if (buttons && buttons.length) {
                for (let i = 0; i < buttons.length; i++) {
                    if (removeListener) {
                        buttons[i].removeEventListener('click', this.handleCopyEvent);
                    }
                    else {
                        buttons[i].addEventListener('click', this.handleCopyEvent);
                    }
                }
            }
        };
        this.handleCopyEvent = (e) => {
            try {
                const ele = document.getElementById(e.target.getAttribute('data-element-id'));
                if (ele) {
                    helper.copy(ele.value);
                }
            }
            catch (e) {
                console.log(e);
            }
        };
        this.removeOtherButtonClickEvent = () => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
            (_a = document.getElementById(this.domIds.tabs)) === null || _a === void 0 ? void 0 : _a.removeEventListener('click', this.handleTabsButtonClick);
            (_b = document.getElementById(this.domIds.editTargetBtn)) === null || _b === void 0 ? void 0 : _b.removeEventListener('click', this.handleSingleButtonClick);
            (_c = document.getElementById(this.domIds.importTargetBtn)) === null || _c === void 0 ? void 0 : _c.removeEventListener('click', this.handleSingleButtonClick);
            (_d = document.getElementById(this.domIds.targetExpandCollapseBtn)) === null || _d === void 0 ? void 0 : _d.removeEventListener('click', this.handleSingleButtonClick);
            (_e = document.getElementById(this.domIds.targetPopupCloseBtn)) === null || _e === void 0 ? void 0 : _e.removeEventListener('click', this.handleSingleButtonClick);
            (_f = document.getElementById(this.domIds.viewSourceBtn)) === null || _f === void 0 ? void 0 : _f.removeEventListener('click', this.handleSingleButtonClick);
            (_g = document.getElementById(this.domIds.importSourceBtn)) === null || _g === void 0 ? void 0 : _g.removeEventListener('click', this.handleSingleButtonClick);
            (_h = document.getElementById(this.domIds.sourceExpandCollapseBtn)) === null || _h === void 0 ? void 0 : _h.removeEventListener('click', this.handleSingleButtonClick);
            (_j = document.getElementById(this.domIds.sourcePopupCloseBtn)) === null || _j === void 0 ? void 0 : _j.removeEventListener('click', this.handleSingleButtonClick);
            (_k = document.getElementById(this.domIds.targetSubmitBtn)) === null || _k === void 0 ? void 0 : _k.removeEventListener('click', this.handleSingleButtonClick);
            (_l = document.getElementById(this.domIds.sourceSubmitBtn)) === null || _l === void 0 ? void 0 : _l.removeEventListener('click', this.handleSingleButtonClick);
            (_m = document.getElementById(this.domIds.optionsResetBtn)) === null || _m === void 0 ? void 0 : _m.removeEventListener('click', this.handleSingleButtonClick);
            (_o = document.getElementById(this.domIds.optionsCurrentBtn)) === null || _o === void 0 ? void 0 : _o.removeEventListener('click', this.handleSingleButtonClick);
            (_p = document.getElementById(this.domIds.optionsChangeBtn)) === null || _p === void 0 ? void 0 : _p.removeEventListener('click', this.handleSingleButtonClick);
            this.handleCopyButtons(true);
        };
        this.getSourcePath = (paths) => {
            return {
                realPath: paths,
                mappingPath: paths.map((p) => {
                    return typeof p !== 'string' ? this.options.shortenSource ? '[]' : '[' + p + ']' : p;
                }).join('.')
            };
        };
        this.execute = (resultAsString) => {
            const mapper = mapFactory(MapperOptions);
            const getValue = objGetValue;
            const setValue = objSetValue;
            const source = this.sourceSchema;
            let output = '';
            try {
                let fields = mapperFields(this.fields);
                if (fields) {
                    output = eval('(mapper' + fields + ')');
                    const fieldsWithSourcePathEmpty = mapperGroupFieldsBySourcePath(this.fields, 'emptyPath');
                    if (output && fieldsWithSourcePathEmpty.length) {
                        fieldsWithSourcePathEmpty.map((f) => {
                            if (!getValue(output, f.targetPath)) {
                                let defaultValue = f.defaultValue.trim();
                                defaultValue = defaultValue.indexOf('{') === 0 ? eval('(' + defaultValue + ')') : eval(defaultValue);
                                try {
                                    output = setValue(output, f.targetPath, defaultValue);
                                }
                                catch (e) {
                                    console.log('%cCannot set default value to => %c' + f.targetPath + ' %c=> output data struct is not match', 'color: black;', 'color: red;font-weight:bold;', 'color: black;');
                                    console.log('=> current output data:', output);
                                }
                            }
                        });
                    }
                    output = JSON.stringify(output, null, 4);
                }
                else {
                    output = 'Source Fields is not set';
                }
            }
            catch (e) {
                console.log(e);
                output = (e === null || e === void 0 ? void 0 : e.message) ? e.message : e.toString();
            }
            if (resultAsString) {
                return output;
            }
            else {
                try {
                    return JSON.parse(output);
                }
                catch (e) {
                    console.log(e);
                    return undefined;
                }
            }
        };
        this.setDataToOutputArea = () => {
            if (this.outputDataDebounce) {
                clearTimeout(this.outputDataDebounce);
            }
            this.outputDataDebounce = setTimeout(() => {
                const output = this.execute(true);
                const outputDataArea = document.getElementById(this.domIds.outputDataArea);
                if (outputDataArea) {
                    outputDataArea.textContent = output;
                    outputDataArea.value = output;
                }
                try {
                    this.emit('output', JSON.parse(output));
                }
                catch (e) {
                    console.log(e);
                    this.emit('output', null);
                }
            }, 1000);
        };
        this.setDataToCodeArea = (returnData) => {
            const code = jsCode(this.fields, this.sourceSchema);
            const codeArea = document.getElementById(this.domIds.outputCodeArea);
            if (codeArea) {
                codeArea.textContent = code;
                codeArea.value = code;
            }
            if (returnData) {
                return code;
            }
        };
        this.setDataToOptionsArea = (fromDefault) => {
            const area = document.getElementById(this.domIds.optionsArea);
            if (area) {
                const opt = fromDefault ? lodash.cloneDeep(defaultOptions) : lodash.cloneDeep(this.options);
                // @ts-ignore
                delete opt.container;
                // @ts-ignore
                delete opt.popupAttach;
                delete opt.target;
                delete opt.source;
                const str = JSON.stringify(opt, null, 4);
                area.textContent = str;
                area.value = str;
            }
        };
        this.emitChange = () => {
            this.emit('change', this.targetSchema, this.sourceSchema, this.fields, this.setDataToCodeArea(true));
            this.setDataToOutputArea();
        };
        this.addWindowProp = (prop) => {
            if (window && prop && (typeof prop === 'string')) {
                // @ts-ignore
                window[prop] = this;
            }
        };
        this.removeWindowProp = (prop) => {
            if (window && prop && (typeof prop === 'string')) {
                // @ts-ignore
                window[prop] = undefined;
            }
        };
        this.destroy = () => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            // Remove Listeners
            this.removeOtherButtonClickEvent();
            const tbody = document.getElementById(this.domIds.tableBody);
            if (tbody) {
                const rows = tbody.querySelectorAll('tr');
                if (rows && rows.length) {
                    for (let i = 0; i < rows.length; i++) {
                        this.removeListenerFromRow(rows[i]);
                    }
                }
            }
            (_a = this.targetTreeInstance) === null || _a === void 0 ? void 0 : _a.off('change', this.handleTargetJsonChange);
            (_b = this.targetTreeInstance) === null || _b === void 0 ? void 0 : _b.off('rename', this.handleTargetJsonChange);
            (_c = this.targetTreeInstance) === null || _c === void 0 ? void 0 : _c.off('delete', this.handleTargetJsonChange);
            (_d = this.targetTreeInstance) === null || _d === void 0 ? void 0 : _d.off('append', this.handleTargetJsonChange);
            //
            (_e = this.sourceTreeInstance) === null || _e === void 0 ? void 0 : _e.off('click', this.handleSourceJsonClick);
            (_f = document.getElementById(this.domIds.sourceFilter)) === null || _f === void 0 ? void 0 : _f.removeEventListener('input', this.handleFilterSourceTree);
            //
            this.removeAllListeners();
            // Remove Tree Instances
            (_g = this.targetTreeInstance) === null || _g === void 0 ? void 0 : _g.destroy();
            (_h = this.sourceTreeInstance) === null || _h === void 0 ? void 0 : _h.destroy();
            if (this.outputDataDebounce) {
                clearTimeout(this.outputDataDebounce);
            }
            this.removeWindowProp(this.options.windowProp);
            // Remove Html
            (_j = document.getElementById(this.domIds.targetTreePopup)) === null || _j === void 0 ? void 0 : _j.remove();
            (_k = document.getElementById(this.domIds.sourceTreePopup)) === null || _k === void 0 ? void 0 : _k.remove();
            (_l = document.getElementById(this.domIds.container)) === null || _l === void 0 ? void 0 : _l.remove();
        };
        this.options = Object.assign({}, this.options, opt);
        this.init(document.getElementById(this.options.container));
    }
    selectSourcePath(targetPath, index) {
        this.selectingSourcePath = { targetPath: targetPath || '', index: index || 0 };
        this.toggleTreePopup(this.domIds.sourceTreePopup, 'tree');
    }
}
export default JsonMapping;

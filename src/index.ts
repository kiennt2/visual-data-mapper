import getLayout, {
    GetMappingFields,
    RowHtml,
    redrawRow,
    jsCode,
    mapperFields,
    mapperGroupFieldsBySourcePath,
    getPopupLayout,
    hasSourcePath
} from './layout'
import {
    JPEmitter,
    IOptions,
    SelectingSource,
    CompIds,
    PopupLayout,
    SourceField,
    IMapFieldItem,
    MainLayout,
    ITreeSourcePath,
    RowButtons,
    RowInputs,
    defaultTransform,
    targetPathAttr,
    defaultOptions,
    defaultInputCssClass,
    MapperOptions
} from './types'
import { EventEmitter } from 'events'
import mapFactory, { getValue as objGetValue, setValue as objSetValue } from 'map-factory'
import helper from './helper'
import kindOf from 'kind-of'
import lodash from 'lodash'

//
const JSONTreeView = require('json-tree-view')

export class JsonMapping extends (EventEmitter as unknown as { new(): JPEmitter }) {
    private options: IOptions                    = lodash.cloneDeep(defaultOptions)
    private domIds: CompIds                      = {
        container              : '',
        table                  : '',
        tableBody              : '',
        importTargetBtn        : '',
        editTargetBtn          : '',
        tabs                   : '',
        viewSourceBtn          : '',
        importSourceBtn        : '',
        targetTreePopup        : '',
        targetTreeWrap         : '',
        targetExpandCollapseBtn: '',
        targetPopupCloseBtn    : '',
        targetTextarea         : '',
        targetSubmitBtn        : '',
        sourceTreePopup        : '',
        sourceTreeWrap         : '',
        sourceFilter           : '',
        sourceExpandCollapseBtn: '',
        sourcePopupCloseBtn    : '',
        sourceTextarea         : '',
        sourceSubmitBtn        : '',
        outputCodeArea         : '',
        outputDataArea         : '',
        optionsArea            : '',
        optionsResetBtn        : '',
        optionsCurrentBtn      : '',
        optionsChangeBtn       : ''
    }
    private targetSchema: any                    = undefined
    private sourceSchema: any                    = undefined
    private targetTreeInstance: any
    private targetTreeExpanded: boolean          = true
    private sourceTreeInstance: any
    private sourceTreeExpanded: boolean          = true
    private fields: IMapFieldItem[]              = []
    private selectingSourcePath: SelectingSource = {
        targetPath: '',
        index     : 0
    }
    private outputDataDebounce: any              = undefined

    constructor(opt: Partial<IOptions>) {
        super()
        this.options = Object.assign({}, this.options, opt)
        this.init(document.getElementById(this.options.container))
    }

    private init = (container: HTMLElement | null): void => {
        this.targetSchema = this.getSchema(this.options.target, this.options.shortenTarget)
        this.sourceSchema = this.getSchema(this.options.source, this.options.shortenSource)
        if (container) {
            const i18nObj: Partial<IOptions> = {text: this.options.text}
            const layout: MainLayout         = getLayout(i18nObj)
            const popup: PopupLayout         = getPopupLayout(i18nObj)
            this.domIds                      = Object.assign({}, layout.ids, popup.ids) as CompIds
            container.innerHTML              = layout.strHtml
            this.initPopupHtml(popup)
            //
            this.buildTableRows(this.targetSchema)
            this.initTargetTree()
            this.initSourceTree()
            //
            this.handleRowListener      = this.handleRowListener.bind(this)
            this.removeListenerFromRow  = this.removeListenerFromRow.bind(this)
            this.onRowClick             = this.onRowClick.bind(this)
            this.rowOnInputChange       = this.rowOnInputChange.bind(this)
            this.handleTargetJsonChange = this.handleTargetJsonChange.bind(this)
            this.handleFilterSourceTree = this.handleFilterSourceTree.bind(this)
            this.handleSourceJsonClick  = this.handleSourceJsonClick.bind(this)
            this.handleOtherButtonClickEvent()
            this.handleTabsButtonClick   = this.handleTabsButtonClick.bind(this)
            this.handleSingleButtonClick = this.handleSingleButtonClick.bind(this)
            this.handleCopyEvent         = this.handleCopyEvent.bind(this)
            //
            // 1st time gen data
            this.setDataToCodeArea()
            this.setDataToOptionsArea()
            this.setDataToOutputArea()
            //
            this.addWindowProp(this.options.windowProp)
        } else {
            throw new Error('container doesn\'t exist!')
        }
    }

    public setConfigs = (configs?: IOptions): void => {
        let conf: any = configs
        if (!configs) {
            const area: any = document.getElementById(this.domIds.optionsArea)
            if (area) {
                try {
                    conf = JSON.parse(area.value)
                } catch (e: any) {
                    console.log(e.message)
                }
            }
        }
        if (conf) {
            const lastOptions: IOptions = lodash.cloneDeep(this.options)
            const obj: any              = {}
            Object.keys(this.options).forEach((k: string) => {
                if (lodash.has(conf, k)) {
                    if (k === 'text') {
                        // make sure i18n keys exists
                        obj.text = lodash.merge({}, lodash.cloneDeep(defaultOptions.text), conf.text)
                    } else {
                        obj[k] = conf[k]
                    }
                }
            })
            this.options = lodash.merge({}, this.options, obj)
            this.doUpdate(lastOptions)
            this.emit('configs', lastOptions, lodash.cloneDeep(this.options))
        } else {
            throw new Error('Options Invalid!')
        }
    }

    private doUpdate = (lastOptions: IOptions) => {
        const lastTargetSchema: any = lodash.cloneDeep(this.targetSchema)
        const lastSourceSchema: any = lodash.cloneDeep(this.sourceSchema)
        this.targetSchema           = this.getSchema(this.options.target, this.options.shortenTarget)
        this.sourceSchema           = this.getSchema(this.options.source, this.options.shortenSource)
        const targetEqual: boolean  = lodash.isEqual(lastTargetSchema, this.targetSchema)
        const sourceEqual: boolean  = lodash.isEqual(lastSourceSchema, this.sourceSchema)
        if (targetEqual && sourceEqual) {
            this.updateRows()
        }
        if (!targetEqual || !sourceEqual) {
            this.buildTableRows(this.targetSchema)
        }
        if (!targetEqual || (lastOptions.targetTreeReadOnly !== this.options.targetTreeReadOnly)) {
            this.setTargetTreeValue(this.targetSchema)
        }
        if (!sourceEqual) {
            this.setSourceTreeValue(this.sourceSchema)
        }
        this.i18nUpdate(helper.compareValueThenGetDiffProps(lastOptions.text, this.options.text))
        if (lastOptions.windowProp && (this.options.windowProp !== lastOptions.windowProp)) {
            this.removeWindowProp(lastOptions.windowProp)
            this.addWindowProp(this.options.windowProp)
        }
        //
        document.getElementById(this.domIds.container)?.setAttribute('data-tab', 'table')
        this.emitChange()
    }

    private initPopupHtml = (popupData: PopupLayout) => {
        let popupAttachEle: Element | null
        try {
            popupAttachEle = document.querySelector(this.options.popupAttach || 'body')
        } catch (e: any) {
            console.log(e.message)
            console.log('%ccause by option => %cpopupAttach', 'color: black;', 'color: red;font-weight:bold;')
            popupAttachEle = document.querySelector('body')
        }
        if (popupAttachEle) {
            const lastChildEle: Element | null = popupAttachEle.lastElementChild
            if (lastChildEle) {
                lastChildEle.insertAdjacentHTML('afterend', popupData.strHtml)
            } else {
                popupAttachEle.innerHTML = popupData.strHtml
            }
        }
    }

    private i18nUpdate = (i18nKeysUpdate: string[]) => {
        if (i18nKeysUpdate.length) {
            i18nKeysUpdate.map((k: string) => {
                const nodes: NodeList = document.querySelectorAll('[data-i18n-key="' + k + '"]')
                if (nodes && nodes.length) {
                    for (let i = 0; i < nodes.length; i++) {
                        try {
                            const n: any    = nodes[i]
                            let txt: string = n.innerText || n.textContent
                            txt             = txt.trim().toLowerCase()
                            // @ts-ignore
                            const newTxt    = this.options.text[k].trim().toLowerCase()
                            if (txt !== newTxt) {
                                n.innerHTML = newTxt
                            }
                        } catch (e: any) {
                            console.log(e.message)
                        }
                    }
                }
            })
        }
    }

    private getSchema = (data: any, shorten?: boolean): any => {
        return shorten ? helper.shortenData(data) : lodash.cloneDeep(data) || {}
    }

    private importTarget = (): void => {
        let obj: any   = undefined
        const txt: any = document.getElementById(this.domIds.targetTextarea)
        if (txt) {
            try {
                obj = JSON.parse(txt.value)
            } catch (e) {
                console.log(e)
            }
            if (!obj || (obj === '')) {
                txt.value = 'JSON Invalid'
            } else {
                this.targetSchema = this.getSchema(obj, this.options.shortenTarget)
                this.setTargetTreeValue(lodash.cloneDeep(this.targetSchema))
                this.toggleTreePopup(this.domIds.targetTreePopup, 'tree')
                this.buildTableRows(this.targetSchema)
                txt.value = ''
            }
        }
        this.emit('targetImport', obj)
        this.emitChange()
    }

    private importSource = (): void => {
        let obj: any   = undefined
        const txt: any = document.getElementById(this.domIds.sourceTextarea)
        if (txt) {
            try {
                obj = JSON.parse(txt.value)
            } catch (e) {
                console.log(e)
            }
            if (!obj || (obj === '')) {
                txt.value = 'JSON Invalid'
            } else {
                this.sourceSchema = this.getSchema(obj, this.options.shortenSource)
                this.setSourceTreeValue(lodash.cloneDeep(this.sourceSchema))
                this.toggleTreePopup(this.domIds.sourceTreePopup, 'tree')
                txt.value = ''
            }
        }
        this.emit('sourceImport', obj)
        this.emitChange()
    }

    private toggleTreePopup = (id: string, block: string): void => {
        const dom: HTMLElement | null = document.getElementById(id)
        if (dom) {
            const currentBlock: string | null = dom.getAttribute('data-show')
            if (!currentBlock || (currentBlock !== block)) {
                dom.setAttribute('data-show', block)
            } else {
                dom.setAttribute('data-show', '')
            }
        }
        if (!dom || !block) {
            this.selectingSourcePath = {
                targetPath: '',
                index     : 0
            }
            const targetArea: any    = document.getElementById(this.domIds.targetTextarea)
            if (targetArea) {
                targetArea.value = ''
            }
            const sourceArea: any = document.getElementById(this.domIds.sourceTextarea)
            if (sourceArea) {
                sourceArea.value = ''
            }
        }
    }

    private initTargetTree = (): void => {
        const view: any                = new JSONTreeView('target', {}, null)
        const wrap: HTMLElement | null = document.getElementById(this.domIds.targetTreeWrap)
        if (wrap) {
            wrap.appendChild(view.dom)
        } else {
            document.body.appendChild(view.dom)
        }
        this.targetTreeInstance = view
        this.setTargetTreeValue(this.targetSchema || {})
        this.handleTargetJsonTreeEvents()
    }

    private setTargetTreeValue = (value: any): void => {
        this.targetTreeInstance.value = value
        this.targetTreeInstance.expand(true, true)
        this.targetTreeInstance.withRootName             = false
        this.targetTreeInstance.alwaysShowRoot           = true
        this.targetTreeInstance.readonlyWhenFiltering    = true
        this.targetTreeInstance.readonly                 = this.options.targetTreeReadOnly
        this.targetTreeInstance.showCountOfObjectOrArray = true
        this.targetTreeInstance.refresh(true)
        this.targetTreeExpanded = true
    }

    private handleTargetJsonTreeEvents = (): void => {
        this.targetTreeInstance.on('change', this.handleTargetJsonChange)
        this.targetTreeInstance.on('rename', this.handleTargetJsonChange)
        this.targetTreeInstance.on('delete', this.handleTargetJsonChange)
        this.targetTreeInstance.on('append', this.handleTargetJsonChange)
    }

    private handleTargetJsonChange = (...args: any[]) => {
        console.log(this.targetTreeInstance.value)
        this.options.target = this.targetTreeInstance.value
        this.targetSchema   = this.getSchema(this.options.target, this.options.shortenTarget)
        this.buildTableRows(this.targetSchema)
    }

    private initSourceTree = (): void => {
        const view: any                = new JSONTreeView('source', {}, null)
        const wrap: HTMLElement | null = document.getElementById(this.domIds.sourceTreeWrap)
        if (wrap) {
            wrap.appendChild(view.dom)
        } else {
            document.body.appendChild(view.dom)
        }
        this.sourceTreeInstance = view
        this.setSourceTreeValue(this.sourceSchema || {})
        this.handleSourceJsonTreeEvents()
    }

    private setSourceTreeValue = (value: any): void => {
        this.sourceTreeInstance.value = value
        this.sourceTreeInstance.expand(true, true)
        this.sourceTreeInstance.withRootName             = false
        this.sourceTreeInstance.alwaysShowRoot           = true
        this.sourceTreeInstance.readonlyWhenFiltering    = true
        this.sourceTreeInstance.readonly                 = true
        this.sourceTreeInstance.showCountOfObjectOrArray = true
        this.sourceTreeInstance.refresh(true)
        this.sourceTreeExpanded = true
    }

    private handleSourceJsonTreeEvents = (): void => {
        document.getElementById(this.domIds.sourceFilter)?.addEventListener('input', this.handleFilterSourceTree)
        this.sourceTreeInstance.on('click', this.handleSourceJsonClick)
    }

    private handleFilterSourceTree = (e: any) => {
        const key: string                  = e?.target?.value
        this.sourceTreeInstance.filterText = key || ''
    }

    private handleSourceJsonClick = (self: any, keyPath: any) => {
        if (this.selectingSourcePath.targetPath) {
            this.addValueToSourcePathInput(this.selectingSourcePath.targetPath, this.selectingSourcePath.index, this.getSourcePath(keyPath))
        }
    }

    private removeRowsListener = () => {
        const tbody: HTMLElement | null = document.getElementById(this.domIds.tableBody)
        if (tbody) {
            const rows: any = tbody.querySelectorAll('tr')
            if (rows && rows.length) {
                for (let i = 0; i < rows.length; i++) {
                    this.removeListenerFromRow(rows[i])
                }
            }
        }
    }

    private setRowsHtmlToTbody = () => {
        const tbody: HTMLElement | null = document.getElementById(this.domIds.tableBody)
        if (tbody && this.fields.length) {
            let html = ''
            this.fields.map((f: IMapFieldItem) => {
                html += RowHtml(f, this.options.indent, {text: this.options.text})
            })
            tbody.innerHTML = html
            const rows: any = tbody.querySelectorAll('tr')
            if (rows && rows.length) {
                for (let i = 0; i < rows.length; i++) {
                    this.handleRowListener(rows[i])
                }
            }
        }
    }

    private buildTableRows = (data: any): void => {
        // remove row listener first if data exiting
        if (this.fields.length) {
            this.removeRowsListener()
        }
        // draw table & add listener
        this.fields = GetMappingFields(data)
        this.setRowsHtmlToTbody()
    }

    private updateRows = (): void => {
        this.removeRowsListener()
        if (!this.options.disableChildWhenParentHasSource) {
            this.fields = this.fields.map((f: IMapFieldItem) => {
                f.disabled = false
                return f
            })
        } else {
            this.setDisabledToMultipleField()
        }
        this.setRowsHtmlToTbody()
    }

    private setDisabledToMultipleField = (): void => {
        let lastTargetPath: string          = ''
        let lastFieldHasSourcePath: boolean = false
        let lastFieldDisabled: boolean      = false
        this.fields                         = this.fields.map((f: IMapFieldItem) => {
            if (f.targetPath.indexOf(lastTargetPath) === 0) {
                f.disabled = lastFieldHasSourcePath || lastFieldDisabled
            } else {
                f.disabled = false
            }
            lastFieldHasSourcePath = hasSourcePath(f.sourceFields) && !f.disabled
            lastFieldDisabled      = f.disabled
            if (lastFieldHasSourcePath) {
                lastTargetPath = f.targetPath
            }
            return f
        })
    }

    private handleRowListener = (row: Element | null, remove?: boolean) => {
        if (row) {
            remove ? row.removeEventListener('click', this.onRowClick) : row.addEventListener('click', this.onRowClick)
            const inputs: HTMLCollectionOf<Element> = row.getElementsByClassName(defaultInputCssClass)
            if (inputs && inputs.length) {
                for (let i = 0; i < inputs.length; i++) {
                    remove ? inputs[i].removeEventListener('input', this.rowOnInputChange) : inputs[i].addEventListener('input', this.rowOnInputChange)
                }
            }
        } else {
            throw new Error('Row element not found')
        }
    }

    private removeListenerFromRow = (row: Element | null) => {
        this.handleRowListener(row, true)
    }

    private onRowClick = (e: any): void => {
        const currentTarget: string | null = e.target.getAttribute(targetPathAttr)
        if (helper.hasCssClass(e, RowButtons.SelectSourcePath)) {
            this.selectSourcePath(currentTarget, parseInt(e.target.getAttribute('data-index')))
        } else if (helper.hasCssClass(e, RowButtons.AddMoreSourceField)) {
            this.addMoreSourceField(currentTarget)
        } else if (helper.hasCssClass(e, RowButtons.RemoveSourceField)) {
            this.removeSourceField(currentTarget, parseInt(e.target.getAttribute('data-index')))
        } else if (helper.hasCssClass(e, RowButtons.ClearSourcePathData)) {
            this.addValueToSourcePathInput(
                currentTarget,
                parseInt(e.target.getAttribute('data-index')),
                {
                    realPath   : [],
                    mappingPath: ''
                } as ITreeSourcePath
            )
        }
    }

    private rowOnInputChange = (e: any) => {
        const currentTarget: string | null = e.target.getAttribute(targetPathAttr)
        if (helper.hasCssClass(e, RowInputs.InputDefaultValue)) {
            this.onInputDefaultValueChange(currentTarget, e.target.value)
        } else if (helper.hasCssClass(e, RowInputs.InputTransformData)) {
            this.onInputTransformDataChange(currentTarget, e.target.value)
        }
        // else if (helper.hasCssClass(e, RowInputs.InputSourcePath)) {
        //     console.log('InputSourcePath')
        // }
    }

    private onInputDefaultValueChange = (targetPath: string | null, value: string) => {
        if (targetPath) {
            this.fields = this.fields.map((f: IMapFieldItem) => {
                if (f.targetPath === targetPath) {
                    f.defaultValue = value
                }
                return f
            })
            this.emitChange()
        }
    }

    private onInputTransformDataChange = (targetPath: string | null, value: string) => {
        if (targetPath) {
            this.fields = this.fields.map((f: IMapFieldItem) => {
                if (f.targetPath === targetPath) {
                    f.transform = value
                }
                return f
            })
            this.emitChange()
        }
    }

    private selectSourcePath(targetPath: string | null, index: number) {
        this.selectingSourcePath = {targetPath: targetPath || '', index: index || 0}
        this.toggleTreePopup(this.domIds.sourceTreePopup, 'tree')
    }

    private addMoreSourceField = (targetPath: string | null): void => {
        if (targetPath) {
            this.fields = this.fields.map((f: IMapFieldItem) => {
                if (f.targetPath === targetPath) {
                    f.sourceFields.push({
                        sourcePath    : '',
                        sourceDataType: ''
                    } as SourceField)
                    f.transform = this.getDefaultTransform(f.sourceFields)
                    redrawRow(this.domIds.tableBody, targetPath, f, this.options.indent, {text: this.options.text}, this.removeListenerFromRow, this.handleRowListener)
                }
                return f
            })
            this.emitChange()
        }
    }

    private removeSourceField = (targetPath: string | null, index: number): void => {
        if (targetPath) {
            this.fields = this.fields.map((f: IMapFieldItem) => {
                if (f.targetPath === targetPath) {
                    f.sourceFields.splice(index, 1)
                    f.transform = this.getDefaultTransform(f.sourceFields)
                    redrawRow(this.domIds.tableBody, targetPath, f, this.options.indent, {text: this.options.text}, this.removeListenerFromRow, this.handleRowListener)
                }
                return f
            })
            this.emitChange()
        }
    }

    private addValueToSourcePathInput = (targetPath: string | null, index: number, path: ITreeSourcePath): void => {
        if (targetPath) {
            let currentRowHasSourceData = false
            this.fields                 = this.fields.map((f: IMapFieldItem) => {
                if (f.targetPath === targetPath) {
                    f.sourceFields = f.sourceFields.map((s: SourceField, idx: number) => {
                        if (path.mappingPath) {
                            currentRowHasSourceData = true
                        }
                        if (index === idx) {
                            s.sourcePath     = path.mappingPath
                            s.sourceDataType = path.realPath && path.realPath.length ? kindOf(lodash.get(this.sourceSchema, path.realPath)) : ''
                            this.toggleTreePopup(this.domIds.sourceTreePopup, '')
                            redrawRow(this.domIds.tableBody, targetPath, f, this.options.indent, {text: this.options.text}, this.removeListenerFromRow, this.handleRowListener)
                        }
                        return s
                    })
                    f.disabled     = false
                } else {
                    f.disabled = this.options.disableChildWhenParentHasSource && (f.targetPath.indexOf(targetPath) === 0)
                    if (this.options.disableChildWhenParentHasSource && f.disabled) {
                        redrawRow(this.domIds.tableBody, f.targetPath, f, this.options.indent, {text: this.options.text}, this.removeListenerFromRow)
                    }
                }
                return f
            })
            if (!currentRowHasSourceData && this.options.disableChildWhenParentHasSource) {
                this.fields = this.fields.map((f: IMapFieldItem) => {
                    if (f.targetPath.indexOf(targetPath) === 0) {
                        f.disabled = false
                        redrawRow(this.domIds.tableBody, f.targetPath, f, this.options.indent, {text: this.options.text}, this.removeListenerFromRow, this.handleRowListener)
                    }
                    return f
                })
            }
            this.emitChange()
        }
    }

    private getDefaultTransform = (source: SourceField[]): string => {
        if (source.length === 1) {
            return defaultTransform
        }
        let fn: string     = ''
        let result: string = ''
        source.map((s: SourceField, index: number) => {
            fn += 'v' + (index + 1) + (index < source.length - 1 ? ', ' : '')
            result += 'v' + (index + 1) + (index < source.length - 1 ? ' + ' : '')
        })
        return `(${fn}) => ${result}`
    }

    private handleOtherButtonClickEvent = () => {
        document.getElementById(this.domIds.tabs)?.addEventListener('click', this.handleTabsButtonClick)
        document.getElementById(this.domIds.editTargetBtn)?.addEventListener('click', this.handleSingleButtonClick)
        document.getElementById(this.domIds.importTargetBtn)?.addEventListener('click', this.handleSingleButtonClick)
        document.getElementById(this.domIds.targetExpandCollapseBtn)?.addEventListener('click', this.handleSingleButtonClick)
        document.getElementById(this.domIds.targetPopupCloseBtn)?.addEventListener('click', this.handleSingleButtonClick)
        document.getElementById(this.domIds.viewSourceBtn)?.addEventListener('click', this.handleSingleButtonClick)
        document.getElementById(this.domIds.importSourceBtn)?.addEventListener('click', this.handleSingleButtonClick)
        document.getElementById(this.domIds.sourceExpandCollapseBtn)?.addEventListener('click', this.handleSingleButtonClick)
        document.getElementById(this.domIds.sourcePopupCloseBtn)?.addEventListener('click', this.handleSingleButtonClick)
        document.getElementById(this.domIds.targetSubmitBtn)?.addEventListener('click', this.handleSingleButtonClick)
        document.getElementById(this.domIds.sourceSubmitBtn)?.addEventListener('click', this.handleSingleButtonClick)
        document.getElementById(this.domIds.optionsResetBtn)?.addEventListener('click', this.handleSingleButtonClick)
        document.getElementById(this.domIds.optionsCurrentBtn)?.addEventListener('click', this.handleSingleButtonClick)
        document.getElementById(this.domIds.optionsChangeBtn)?.addEventListener('click', this.handleSingleButtonClick)
        this.handleCopyButtons()
    }

    private handleTabsButtonClick = (e: any): void => {
        if (e && e.target) {
            const tab: string = e.target.getAttribute('data-tab')
            if (tab) {
                document.getElementById(this.domIds.container)?.setAttribute('data-tab', tab)
            }
        }
    }

    private handleSingleButtonClick = (e: any): void => {
        const id: string = helper.getButtonId(e)
        switch (id) {
            case this.domIds.editTargetBtn:
                this.toggleTreePopup(this.domIds.targetTreePopup, 'tree')
                break
            case this.domIds.importTargetBtn:
                this.toggleTreePopup(this.domIds.targetTreePopup, 'import')
                break
            case this.domIds.targetExpandCollapseBtn:
                if (this.targetTreeExpanded) {
                    this.targetTreeInstance.collapse(true, true)
                    this.targetTreeExpanded = false
                } else {
                    this.targetTreeInstance.expand(true, true)
                    this.targetTreeExpanded = true
                }
                break
            case this.domIds.targetPopupCloseBtn:
                this.toggleTreePopup(this.domIds.targetTreePopup, '')
                break
            case this.domIds.viewSourceBtn:
                this.toggleTreePopup(this.domIds.sourceTreePopup, 'tree')
                break
            case this.domIds.importSourceBtn:
                this.toggleTreePopup(this.domIds.sourceTreePopup, 'import')
                break
            case this.domIds.sourceExpandCollapseBtn:
                if (this.sourceTreeExpanded) {
                    this.sourceTreeInstance.collapse(true, true)
                    this.sourceTreeExpanded = false
                } else {
                    this.sourceTreeInstance.expand(true, true)
                    this.sourceTreeExpanded = true
                }
                break
            case this.domIds.sourcePopupCloseBtn:
                this.toggleTreePopup(this.domIds.sourceTreePopup, '')
                break
            case this.domIds.targetSubmitBtn:
                this.importTarget()
                break
            case this.domIds.sourceSubmitBtn:
                this.importSource()
                break
            case this.domIds.optionsResetBtn:
                this.setDataToOptionsArea(true)
                break
            case this.domIds.optionsCurrentBtn:
                this.setDataToOptionsArea()
                break
            case this.domIds.optionsChangeBtn:
                this.setConfigs()
                break
            default:
                console.log('ID is empty')
        }
    }

    private handleCopyButtons = (removeListener?: boolean) => {
        const buttons: NodeList = document.querySelectorAll('#' + this.options.container + ' .jmp-copy-btn')
        if (buttons && buttons.length) {
            for (let i = 0; i < buttons.length; i++) {
                if (removeListener) {
                    buttons[i].removeEventListener('click', this.handleCopyEvent)
                } else {
                    buttons[i].addEventListener('click', this.handleCopyEvent)
                }
            }
        }
    }

    private handleCopyEvent = (e: any) => {
        try {
            const ele: any = document.getElementById(e.target.getAttribute('data-element-id'))
            if (ele) {
                helper.copy(ele.value)
            }
        } catch (e: any) {
            console.log(e)
        }
    }

    private removeOtherButtonClickEvent = (): void => {
        document.getElementById(this.domIds.tabs)?.removeEventListener('click', this.handleTabsButtonClick)
        document.getElementById(this.domIds.editTargetBtn)?.removeEventListener('click', this.handleSingleButtonClick)
        document.getElementById(this.domIds.importTargetBtn)?.removeEventListener('click', this.handleSingleButtonClick)
        document.getElementById(this.domIds.targetExpandCollapseBtn)?.removeEventListener('click', this.handleSingleButtonClick)
        document.getElementById(this.domIds.targetPopupCloseBtn)?.removeEventListener('click', this.handleSingleButtonClick)
        document.getElementById(this.domIds.viewSourceBtn)?.removeEventListener('click', this.handleSingleButtonClick)
        document.getElementById(this.domIds.importSourceBtn)?.removeEventListener('click', this.handleSingleButtonClick)
        document.getElementById(this.domIds.sourceExpandCollapseBtn)?.removeEventListener('click', this.handleSingleButtonClick)
        document.getElementById(this.domIds.sourcePopupCloseBtn)?.removeEventListener('click', this.handleSingleButtonClick)
        document.getElementById(this.domIds.targetSubmitBtn)?.removeEventListener('click', this.handleSingleButtonClick)
        document.getElementById(this.domIds.sourceSubmitBtn)?.removeEventListener('click', this.handleSingleButtonClick)
        document.getElementById(this.domIds.optionsResetBtn)?.removeEventListener('click', this.handleSingleButtonClick)
        document.getElementById(this.domIds.optionsCurrentBtn)?.removeEventListener('click', this.handleSingleButtonClick)
        document.getElementById(this.domIds.optionsChangeBtn)?.removeEventListener('click', this.handleSingleButtonClick)
        this.handleCopyButtons(true)
    }

    private getSourcePath = (paths: (string | number)[]): ITreeSourcePath => {
        return {
            realPath   : paths,
            mappingPath: paths.map((p: string | number): string => {
                return typeof p !== 'string' ? this.options.shortenSource ? '[]' : '[' + p + ']' : p
            }).join('.')
        }
    }

    public execute = (resultAsString?: boolean): any => {
        const mapper: any   = mapFactory(MapperOptions)
        const getValue: any = objGetValue
        const setValue: any = objSetValue
        const source: any   = this.sourceSchema
        let output: any     = ''
        try {
            let fields: string = mapperFields(this.fields)
            if (fields) {
                output                                           = eval('(mapper' + fields + ')')
                const fieldsWithSourcePathEmpty: IMapFieldItem[] = mapperGroupFieldsBySourcePath(this.fields, 'emptyPath')
                if (output && fieldsWithSourcePathEmpty.length) {
                    fieldsWithSourcePathEmpty.map((f: IMapFieldItem) => {
                        if (!getValue(output, f.targetPath)) {
                            let defaultValue: any = f.defaultValue.trim()
                            defaultValue          = defaultValue.indexOf('{') === 0 ? eval('(' + defaultValue + ')') : eval(defaultValue)
                            try {
                                output = setValue(output, f.targetPath, defaultValue)
                            } catch (e) {
                                console.log('%cCannot set default value to => %c' + f.targetPath + ' %c=> output data struct is not match', 'color: black;', 'color: red;font-weight:bold;', 'color: black;')
                                console.log('=> current output data:', output)
                            }
                        }
                    })
                }
                output = JSON.stringify(output, null, 4)
            } else {
                output = 'Source Fields is not set'
            }
        } catch (e: any) {
            console.log(e)
            output = e?.message ? e.message : e.toString()
        }
        if (resultAsString) {
            return output
        } else {
            try {
                return JSON.parse(output)
            } catch (e) {
                console.log(e)
                return undefined
            }
        }
    }

    private setDataToOutputArea = (): any => {
        if (this.outputDataDebounce) {
            clearTimeout(this.outputDataDebounce)
        }
        this.outputDataDebounce = setTimeout(() => {
            const output: any         = this.execute(true)
            const outputDataArea: any = document.getElementById(this.domIds.outputDataArea)
            if (outputDataArea) {
                outputDataArea.textContent = output
                outputDataArea.value       = output
            }
            try {
                this.emit('output', JSON.parse(output))
            } catch (e) {
                console.log(e)
                this.emit('output', null)
            }
        }, 1000)
    }

    private setDataToCodeArea = (returnData?: boolean): any => {
        const code: any     = jsCode(this.fields, this.sourceSchema)
        const codeArea: any = document.getElementById(this.domIds.outputCodeArea)
        if (codeArea) {
            codeArea.textContent = code
            codeArea.value       = code
        }
        if (returnData) {
            return code
        }
    }

    private setDataToOptionsArea = (fromDefault?: boolean): any => {
        const area: any = document.getElementById(this.domIds.optionsArea)
        if (area) {
            const opt: IOptions = fromDefault ? lodash.cloneDeep(defaultOptions) : lodash.cloneDeep(this.options)
            // @ts-ignore
            delete opt.container
            // @ts-ignore
            delete opt.popupAttach
            delete opt.target
            delete opt.source
            const str: string = JSON.stringify(opt, null, 4)
            area.textContent  = str
            area.value        = str
        }
    }

    private emitChange = () => {
        this.emit('change', this.targetSchema, this.sourceSchema, this.fields, this.setDataToCodeArea(true))
        this.setDataToOutputArea()
    }

    private addWindowProp = (prop: any) => {
        if (window && prop && (typeof prop === 'string')) {
            // @ts-ignore
            window[prop] = this
        }
    }

    private removeWindowProp = (prop: any) => {
        if (window && prop && (typeof prop === 'string')) {
            // @ts-ignore
            window[prop] = undefined
        }
    }

    public destroy = (): void => {
        // Remove Listeners
        this.removeOtherButtonClickEvent()
        const tbody: HTMLElement | null = document.getElementById(this.domIds.tableBody)
        if (tbody) {
            const rows: any = tbody.querySelectorAll('tr')
            if (rows && rows.length) {
                for (let i = 0; i < rows.length; i++) {
                    this.removeListenerFromRow(rows[i])
                }
            }
        }
        this.targetTreeInstance?.off('change', this.handleTargetJsonChange)
        this.targetTreeInstance?.off('rename', this.handleTargetJsonChange)
        this.targetTreeInstance?.off('delete', this.handleTargetJsonChange)
        this.targetTreeInstance?.off('append', this.handleTargetJsonChange)
        //
        this.sourceTreeInstance?.off('click', this.handleSourceJsonClick)
        document.getElementById(this.domIds.sourceFilter)?.removeEventListener('input', this.handleFilterSourceTree)
        //
        this.removeAllListeners()
        // Remove Tree Instances
        this.targetTreeInstance?.destroy()
        this.sourceTreeInstance?.destroy()
        if (this.outputDataDebounce) {
            clearTimeout(this.outputDataDebounce)
        }
        this.removeWindowProp(this.options.windowProp)
        // Remove Html
        document.getElementById(this.domIds.targetTreePopup)?.remove()
        document.getElementById(this.domIds.sourceTreePopup)?.remove()
        document.getElementById(this.domIds.container)?.remove()
    }
}

export default JsonMapping

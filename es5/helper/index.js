import { v4 as uuidv4 } from 'uuid';
import lodash from 'lodash';
const helper = {
    genId() {
        return 'jmp-' + uuidv4().substring(4);
    },
    hasCssClass(event, name) {
        var _a;
        if (event && event.target) {
            const classes = (_a = event.target.className) === null || _a === void 0 ? void 0 : _a.split(' ');
            return (classes && classes.length && classes.includes(name)) || (event.target.getAttribute('data-css-class') === name);
        }
        return false;
    },
    getButtonId(event) {
        if (event && event.target) {
            return event.target.getAttribute('data-id') || event.target.id;
        }
        return '';
    },
    shortenData(obj) {
        let data = lodash.cloneDeep(obj);
        if (lodash.isPlainObject(data)) {
            Object.keys(data).forEach(key => {
                if (lodash.isPlainObject(data[key]) || Array.isArray(data[key])) {
                    data[key] = helper.shortenData(data[key]);
                }
            });
        }
        else if (Array.isArray(data)) {
            let firstItem = data[0];
            if (lodash.isPlainObject(firstItem) || Array.isArray(firstItem)) {
                firstItem = helper.shortenData(firstItem);
            }
            data = [firstItem];
        }
        return data || {};
    },
    compareValueThenGetDiffProps(obj1, obj2) {
        // @ts-ignore
        return lodash.reduce(obj1, (result, value, key) => lodash.isEqual(value, obj2[key]) ? result : result.concat(key), []);
    },
    copy(value) {
        try {
            navigator.clipboard.writeText(value).then(() => {
            }, (e) => {
                console.log(e);
                helper.legacyCopy(value);
            });
        }
        catch (e) {
            console.log(e);
            helper.legacyCopy(value);
        }
    },
    legacyCopy(value) {
        try {
            const el = document.createElement('textarea');
            el.addEventListener('focusin', e => e.stopPropagation());
            el.value = value;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
        }
        catch (e) {
            console.log(e);
        }
    },
    typeDisplay(type) {
        let txt = '';
        switch (type) {
            case 'undefined':
                txt = '<sup><em>und</em></sup> Undefined';
                break;
            case 'null':
                txt = '<sup><em>Nul</em></sup> Null';
                break;
            case 'boolean':
                txt = '<sup><em>boo</em></sup> Boolean';
                break;
            case 'buffer':
                txt = '<sup><em>buf</em></sup> Buffer';
                break;
            case 'number':
                txt = '<sup><em>123</em></sup> Number';
                break;
            case 'string':
                txt = '<sup><em>abc</em></sup> String';
                break;
            case 'arguments':
                txt = '<sup><em>arg</em></sup> Arguments';
                break;
            case 'object':
                txt = '<sup><em>{ }</em></sup> Object';
                break;
            case 'date':
                txt = '<sup><em>dat</em></sup> Date';
                break;
            case 'array':
                txt = '<sup><em>[ ]</em></sup> Array';
                break;
            case 'regexp':
                txt = '<sup><em>/ /</em></sup> Regexp';
                break;
            case 'error':
                txt = '<sup><em>err</em></sup> Error';
                break;
            case 'function':
                txt = '<sup><em>()</em></sup> Function';
                break;
            case 'generatorfunction':
                txt = '<sup><em>* ()</em></sup> Function';
                break;
            case 'generator':
                txt = '<sup><em>Gen</em></sup> Generator';
                break;
            case 'stringiterator':
            case 'arrayiterator':
            case 'mapiterator':
            case 'setiterator':
                txt = '<sup><em>*</em></sup> Iterator';
                break;
            case 'symbol':
                txt = '<sup><em>sym</em></sup> Symbol';
                break;
            case 'map':
                txt = '<sup><em>map</em></sup> Map';
                break;
            case 'weakmap':
                txt = '<sup><em>wmap</em></sup> Weakmap';
                break;
            case 'set':
                txt = '<sup><em>set</em></sup> Set';
                break;
            case 'weakset':
                txt = '<sup><em>wset</em></sup> Weakset';
                break;
            case 'int8array':
                txt = '<sup><em>int8</em></sup> Int8array';
                break;
            case 'uint8array':
                txt = '<sup><em>uint8</em></sup> Uint8array';
                break;
            case 'uint8clampedarray':
                txt = '<sup><em>uint8c</em></sup> Uint8clampedarray';
                break;
            case 'int16array':
                txt = '<sup><em>int16</em></sup> Int16array';
                break;
            case 'uint16array':
                txt = '<sup><em>uint16</em></sup> Uint16array';
                break;
            case 'int32array':
                txt = '<sup><em>int32</em></sup> Int32array';
                break;
            case 'uint32array':
                txt = '<sup><em>uint32</em></sup> Uint32array';
                break;
            case 'float32array':
                txt = '<sup><em>float32</em></sup> Float32array';
                break;
            case 'float64array':
                txt = '<sup><em>float64</em></sup> Float64array';
                break;
            default:
        }
        return txt;
    },
    getDefaultValueByKind(kind) {
        let value;
        switch (kind) {
            case 'null':
                value = null;
                break;
            case 'boolean':
                value = false;
                break;
            case 'number':
                value = 0;
                break;
            case 'object':
                value = {};
                break;
            case 'array':
            case 'int8array':
            case 'uint8array':
            case 'uint8clampedarray':
            case 'int16array':
            case 'uint16array':
            case 'int32array':
            case 'uint32array':
            case 'float32array':
            case 'float64array':
                value = [];
                break;
            default:
                value = '';
        }
        return JSON.stringify(value);
    }
};
export default helper;

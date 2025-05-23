import { Form, Input, InputNumber, Select } from "antd";
import { useComponentsStore } from "../../stores/components";
import { ComponentSetter, useComponentConfigStore } from "../../stores/component-config";
import { CSSProperties, useEffect, useState } from "react";
import CssEditor from "./CssEditor";
import { debounce } from "lodash-es";
import StyleToObject from "style-to-object";


export function ComponentStyle() {
    const [form] = Form.useForm()

    const { curComponent, curComponentId, updateComponentStyles } = useComponentsStore()
    const { componentConfig } = useComponentConfigStore()
    const [css, setCss] = useState<string>('.comp{\n\n}')
    useEffect(() => {
        //切换组件的时候重设表单
        form.resetFields()
        //获取自定义的表单属性，setter内部
        const data = form.getFieldsValue();
        console.log(data, 1111);

        form.setFieldsValue({ ...data, ...curComponent?.styles })
        //从表单获取值赋值给css
        //切换组件的时候切换对应的css
        setCss(toCSSStr(curComponent?.styles!))
    }, [curComponent])
    //遍历获取的css属性然后设置到css内部，让切换组件的时候可以显示对应的样式
    function toCSSStr(css: Record<string, any>) {
        let str = `.comp{\n`;
        for (let key in css) {
            let value = css[key]
            console.log(value);
            if (!value) {
                continue
            }
            if (['width', 'height'].includes(key) && !value.toString().endsWith('px')) {
                value += 'px'
            }
            str += `\t${key}:${value};\n`
        }
        str += `}`
        return str;
    }

    if (!curComponent || !curComponentId) return null;

    function renderFormElememt(setting: ComponentSetter) {
        const { type, options } = setting;
        if (type === 'select') {
            return <Select options={options} />
        } else if (type === 'input') {
            return <Input />
        } else if (type === 'inputNumber') {
            return <InputNumber />
        }
    }
    function valueChange(changeValues: CSSProperties) {
        if (curComponentId) {
            updateComponentStyles(curComponentId, changeValues)
        }
    }

    const handleEditorChange = debounce((value) => {
        //在处理输入的时候赋值给css
        setCss(value);

        let css: Record<string, any> = {};

        try {
            const cssStr = value.replace(/\/\*.*\*\//, '') // 去掉注释 /** */
                .replace(/(\.?[^{]+{)/, '') // 去掉 .comp {
                .replace('}', '');// 去掉 }

            StyleToObject(cssStr, (name, value) => {
                css[name.replace(/-\w/, (item) => item.toUpperCase().replace('-', ''))] = value;
            });

            console.log(css);
            //把css的值传递给css，并且与原来的值合并
            updateComponentStyles(curComponentId, { ...form.getFieldsValue(), ...css }, true);
        } catch (e) { }
    }, 500);


    return (
        <Form
            form={form}
            onValuesChange={valueChange}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 14 }}
        >
            {
                componentConfig[curComponent.name]?.stylesSetter?.map(setter => (
                    <Form.Item key={setter.name} name={setter.name} label={setter.label}>
                        {renderFormElememt(setter)}
                    </Form.Item>
                ))
            }
            <div className='h-[200px] border-[1px] border-[#ccc]'>
                {/* 在编辑处传入value的值为css */}
                <CssEditor value={css} onChange={handleEditorChange} />
            </div>
        </Form>
    )
}
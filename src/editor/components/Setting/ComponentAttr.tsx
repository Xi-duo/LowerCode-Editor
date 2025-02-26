import { Form, Input, Select } from "antd";
import { useComponentsStore } from "../../stores/components";
import { ComponentConfig, ComponentSetter, useComponentConfigStore } from "../../stores/component-config";
import { useEffect } from "react";


export function ComponentAttr(){
    const [form] = Form.useForm();
    
    const{curComponentId,curComponent,updateComponnetProps } = useComponentsStore()

    const {componentConfig} = useComponentConfigStore();

    useEffect(()=>{
        //curComponent发生变化的时候就把props设置到表单内部回显数据
        const data = form.getFieldsValue();
        form.setFieldValue({...data,...curComponent?.props},[curComponent])

    })
//如果没有用选中组件的话就直接返回
    if(!curComponent||!curComponentId)return null;

    function renderFromElement(setting:ComponentSetter){
        const {type,options} = setting;
        if(type==='select'){
            return <Select options={options}/>
        }else if(type==='input'){
            return <input/>
        }
    }
//表单变化的时候同步到store
    function valueChange(changeValues:ComponentConfig){
        if(curComponentId){
            updateComponnetProps(curComponentId,changeValues)
        }
    }
    return(<Form
        form={form}
        onValuesChange={valueChange}
        labelCol={{span:8}}
        wrapperCol={{span:14}}
        //表单分别渲染不同属性，还有组件对应的setter
        >
    {/* 组件描述全部设置为只读状态 */}
            <Form.Item label="组件id">
                <Input value={curComponent.id} disabled/>
            </Form.Item>
            <Form.Item label="组件名称">
                <Input value={curComponent.name} disabled/>
            </Form.Item>
            <Form.Item label="组件描述">
                <Input value={curComponent.desc} disabled/>
            </Form.Item>
            {
                componentConfig[curComponent.name]?.setter?.map((setter)=>(
                    <Form.Item key={setter.name} name={setter.name} label={setter.label} >
                {renderFromElement(setter)}
            </Form.Item>
                ))
            }
        </Form>
    )
}
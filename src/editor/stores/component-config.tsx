import { create } from "zustand";
import Container from "../materials/Container";
import Page from "../materials/Page";
import Button from "../materials/Button";


export interface ComponentSetter {
    name: string,
    label: string,
    type: string,
    [key: string]: any
}
export interface ComponentConfig {
    name: string;
    desc: string;
    defaultProps: Record<string, any>
    setter?: ComponentSetter[]
    stylesSetter?:ComponentSetter[]
    component: any
}

interface State {
    componentConfig: { [key: string]: ComponentConfig }
}

interface Action {
    registerComponent: (name: string, componentConfig: ComponentConfig) => void
}

export const useComponentConfigStore = create<State & Action>((set) => ({
    componentConfig: {
        Container: {
            name: 'Container',
            defaultProps: {},
            desc: '容器',
            component: Container
        },
        Button: {
            name: 'Button',
            defaultProps: {
                type: 'primary',
                text: '按钮'
            },
            setter:[
                {
                    name:'type',
                    label:'按钮类型',
                    type:'select',
                    options:[
                        {label:'主按钮',value:'primary'},
                        {label:'次按钮',value:'default'}
                    ]
                },
                {
                    name:'text',
                    label:'文本',
                    type:'input'
                }
            ],
            stylesSetter:[
                {
                    name:'width',
                    label:'宽度',
                    type:'inputNumber',
                },
                {
                    name:'height',
                    label:'高度',
                    type:'inputNumber',
                },
                
            ],
            desc: '按钮',
            component: Button
        },
        Page: {
            name: 'Page',
            defaultProps: {},
            desc: '页面',
            component: Page
        }
    },
    //传入name和组件名称
    registerComponent: (name, componentConfig) => set((state) => {
        return {
            //展开state，如果有不叫componnetConfig的就不会被影响
            ...state,
            componentConfig: {
                //展开componentConfig内部
                ...state.componentConfig,
                //添加key为name，配置为传入的componentConfig
                [name]: componentConfig
            }
        }
    })
}))
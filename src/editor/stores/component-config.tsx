//用于组件内部的配置
import { create } from "zustand";
import ContainerDev from "../materials/Container/dev";
import ContainerProd from "../materials/Container/prod";
import PageDev from "../materials/Page/dev";
import PageProd from "../materials/Page/prod";
import ButtonDev from "../materials/Button/dev";
import ButtonProd from "../materials/Button/prod";
import ModalDev from "../materials/Modal/dev";
import ModalProd from "../materials/Modal/prod";


export interface ComponentSetter {
    name: string,
    label: string,
    type: string,
    [key: string]: any
}

export interface ComponentEvent {
    name: string,
    label: string
}

export interface ComponentMethod {
    name: string,
    label: string
}

export interface ComponentConfig {
    name: string;
    desc: string;
    defaultProps: Record<string, any>
    setter?: ComponentSetter[]
    stylesSetter?: ComponentSetter[]
    events?: ComponentEvent[]
    methods?:ComponentMethod[]
    dev: any;
    prod: any
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
            dev: ContainerDev,
            prod: ContainerProd,
        },
        Button: {
            name: 'Button',
            defaultProps: {
                type: 'primary',
                text: '按钮'
            },
            setter: [
                {
                    name: 'type',
                    label: '按钮类型',
                    type: 'select',
                    options: [
                        { label: '主按钮', value: 'primary' },
                        { label: '次按钮', value: 'default' }
                    ]
                },
                {
                    name: 'text',
                    label: '文本',
                    type: 'input'
                }
            ],
            stylesSetter: [
                {
                    name: 'width',
                    label: '宽度',
                    type: 'inputNumber',
                },
                {
                    name: 'height',
                    label: '高度',
                    type: 'inputNumber',
                },

            ],
            events: [
                {
                    name: 'onClick',
                    label: '点击事件'
                },
                {
                    name: 'onDoubleClick',
                    label: '双击事件'
                }
            ],
            desc: '按钮',
            dev: ButtonDev,
            prod: ButtonProd,
        },
        Modal: {
            name: 'Modal',
            defaultProps: {
                title: '弹窗'
            },
            setter: [
                {
                    name: 'title',
                    label: '标题',
                    type: 'input'
                }
            ],
            stylesSetter: [],
            events: [
                {
                    name: 'onOk',
                    label: '确认事件'
                },
                {
                    name: 'onCancel',
                    label: '取消事件'
                }
            ],
            methods: [
                {
                    name: 'open',
                    label: '打开弹窗',
                },
                {
                    name: 'close',
                    label: '关闭弹窗'
                }
            ],
            desc: '弹窗',
            dev: ModalDev,
            prod: ModalProd,
        },
        Page: {
            name: 'Page',
            defaultProps: {},
            desc: '页面',
            dev: PageDev,
            prod: PageProd,
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
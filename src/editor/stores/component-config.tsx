import { create } from "zustand";
import Container from "../materials/Container";
import Page from "../materials/Page";
import Button from "../materials/Button";

export interface ComponentConfig {
    name: string;
    desc:string;
    defaultProps: Record<string, any>
    component: any
}

interface State {
    componentConfig: {[key: string]: ComponentConfig}
}

interface Action {
    registerComponent: (name: string, componentConfig: ComponentConfig) => void
}

export const useComponentConfigStore = create<State & Action>((set) => ({
    componentConfig: {
        Container:{
            name: 'Container',
            defaultProps: {},
            desc:'容器',
            component:Container
        },
        Button: {
            name: 'Button',
            defaultProps: {
                type: 'primary',
                text: '按钮'
            },
            desc:'按钮',
            component: Button
        },
        Page: {
            name: 'Page',
            defaultProps: {},
            desc:'页面',
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
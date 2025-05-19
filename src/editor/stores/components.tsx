//对组件的状态和消费进行标识
import { CSSProperties } from "react";
import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";
//基本元素Component属性
export interface Component {
    id: number;
    name: string;
    props: any;
    styles?: CSSProperties;
    desc: string;
    children?: Component[];
    parentId?: number;
}
//click事件要保存当前的id和组件，要在右边渲染属性，所以cur保存到store
interface State {
    components: Component[];
    mode: 'edit' | 'preview'
    curComponentId?: number | null;
    curComponent?: Component | null;
}

interface Action {
    addComponent: (component: Component, parentId?: number) => void;
    deleteComponent: (componentId: number) => void
    updateComponentProps: (componentId: number, props: any) => void;
    //更新styles的函数
    updateComponentStyles: (componentId: number, styles: CSSProperties, replace?: boolean) => void;
    setCurComponentId: (componentId: number | null) => void
    setMode: (mode: State['mode']) => void
}

const creator: StateCreator<State & Action> = (set, get) => ({
        components: [
            {
                id: 1,
                name: 'Page',
                props: {},
                desc: '页面'
            }
        ],
        curComponentId: null,
        curComponent: null,
        mode: 'edit',
        setMode: (mode) => set({ mode }),
        setCurComponentId: (componentId) => set((state) => ({
            curComponentId: componentId,
            curComponent: getComponentById(componentId, state.components)
        })),
        //添加组件，传入要添加的组件和要加入的父组件id
        addComponent: (component, parentId) =>
            set((state) => {
                //拿到父组件
                if (parentId) {
                    const parentComponent = getComponentById(
                        parentId,
                        state.components
                    );
                    //成功拿到组件
                    if (parentComponent) {
                        //在子组件数组内部添加新增的组件
                        if (parentComponent.children) {
                            parentComponent.children.push(component)
                        } else {
                            //如果没有子组件就直接添加子组件数组
                            parentComponent.children = [component]
                        }
                    }
                    //新增组件的父组件设置
                    component.parentId = parentId;
                    //返回修改后的state
                    return { components: [...state.components] }
                }
                //如果没有找到父组件的话，就在根部修改state
                return { components: [...state.components, component] }
            }),
        deleteComponent: (componentId) => {
            //如果不合法这个就直接返回了
            if (!componentId) return;
            //拿到这个id的组件
            const component = getComponentById(componentId, get().components)
            if (component?.parentId) {
                //有父组件就拿过来
                const parentComponent = getComponentById(
                    component.parentId,
                    get().components
                );
                //过滤掉父组件内部的这个元素
                if (parentComponent) {
                    parentComponent.children = parentComponent?.children?.filter(
                        (item) => item.id !== +componentId
                    );

                    set({ components: [...get().components] })
                }
            }
        },
        //传入要更新的组件id和更新的参数
        updateComponentProps: (componentId, props) =>
            set((state) => {
                //先拿到这个组件
                const component = getComponentById(componentId, state.components)
                if (component) {
                    //传入更新的参数
                    component.props = { ...component.props, ...props };

                    return { components: [...state.components] }
                }
                //如果没拿到就还是原样
                return { components: [...state.components] }
            }),
        //先找到对应的组件
        updateComponentStyles: (componentId, styles, replace) => {
            set((state) => {
                const component = getComponentById(componentId, state.components)
                if (component) {
                    //在编辑style结束后，如果删除style的话不会回复原样，设置replace选择整个替换
                    //与原来的样式一致的话会导致删除无法恢复以前的样子，所以replace用直接设置的状态整个替换styles
                    component.styles = replace ? { ...styles } : { ...component.styles, ...styles }
                    return { components: [...state.components] }
                }
                return { components: [...state.components] }
            })
        }
    })
    


export const useComponentsStore = create<State & Action>()(persist(creator, {
    name: 'xx'
}));


export function getComponentById(id: number, components: Component[]): Component | null {
    if (!id) return null

    for (const component of components) {
        //能找到就返回，暂时没找到的话有孩子就遍历孩子
        if (component.id == id) return component
        if (component.children && component.children.length > 0) {
            const result = getComponentById(id, component.children);
            if (result !== null) return result
        }
    }
    return null
}
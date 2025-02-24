import { create } from "zustand";
//基本元素Component属性
export interface Component {
    id: number;
    name: string;
    props: any;
    children?: Component[];
    parentId?: number;
}

interface State {
    components: Component[];
}

interface Action {
    addComponent: (component: Component,parentId?:number)=>void;
    deleteComponent: (componentId: number)=>void
    updateComponnetProps: (componentId: number, props: any)=>void;
}

export const useComponentsStore = create<State & Action>(
    ((set,get) => ({
        components: [
            {
                id:1,
                name: 'Page',
                props: {},
                desc: '页面'
            }
        ],
        //添加组件，传入要添加的组件和要加入的父组件id
        addComponent: (component, parentId) => 
            set((state)=>{
                //拿到父组件
                if(parentId){
                    const parentComponent = getComponentById(
                        parentId,
                        state.components
                    );
                //成功拿到组件
                    if(parentComponent){
                        //在子组件数组内部添加新增的组件
                        if(parentComponent.children){
                            parentComponent.children.push(component)
                        } else {
                            //如果没有子组件就直接添加子组件数组
                            parentComponent.children = [component]
                        }
                    }
                    //新增组件的父组件设置
                    component.parentId = parentId;
                    //返回修改后的state
                    return {components: [...state.components]}
                }
                //如果没有找到父组件的话，就在根部修改state
                return {components: [...state.components, component]}
            }),
        deleteComponent: (componentId) =>{
            //如果不合法这个就直接返回了
            if(!componentId) return ;
            //拿到这个id的组件
            const component  = getComponentById(componentId,get().components)
            if(component?.parentId){
                //有父组件就拿过来
                const parentComponent =getComponentById(
                    component.parentId,
                    get().components
                );
                //过滤掉父组件内部的这个元素
                if(parentComponent){
                    parentComponent.children = parentComponent?.children?.filter(
                        (item) => item.id !== +componentId
                    );
                    
                    set({components:[...get().components]})
                }
            }
        } ,
        //传入要更新的组件id和更新的参数
        updateComponnetProps: (componentId, props) => 
            set((state) => {
                //先拿到这个组件
                const component = getComponentById(componentId,state.components)
                if(component){
                    //传入更新的参数
                    component.props = {...component.props,...props};

                    return {components: [...state.components]}
                }
                //如果没拿到就还是原样
                return {components:[...state.components]}
            }),
    })
  )
)

export function getComponentById(id: number, components: Component[]): Component | null{
    if(!id) return null

    for(const component of components) {
        //能找到就返回，暂时没找到的话有孩子就遍历孩子
        if(component.id == id) return component
        if(component.children && component.children.length > 0) {
            const result = getComponentById(id, component.children);
            if(result!==null) return result
        }
    }
    return null
}
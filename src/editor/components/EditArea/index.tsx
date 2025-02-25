import React, { useEffect } from "react";
import { Component, useComponentsStore } from "../../stores/components"
import { useComponentConfigStore } from "../../stores/component-config";

export function EditArea() {

    const { components, addComponent } = useComponentsStore();
    const { componentConfig } = useComponentConfigStore()

    // useEffect(() => {
    //     addComponent({
    //         id: 222,
    //         name: 'Container',
    //         props: {},
    //         children: []
    //     }, 1);
    //     addComponent({
    //         id: 333,
    //         name: 'Button',
    //         props: {
    //             text: '无敌'
    //         },
    //         children: []
    //     }, 222)
    // }, []);

    //传入参数，也就是json内部描述结构的那几个数组
    function renderComponents(components: Component[]): React.ReactNode {
        return components.map((component: Component) => {
            //取出传入的每个参数所对应的组件，通过传入的name和组件的索引名称对应
            const config = componentConfig?.[component.name]
            //如果没有对应的就返回
            if (!config?.component) {
                return null
            }

            return React.createElement(
                //组件component
                config.component,
                {
                    //id和参数，id和props来自描述的id
                    key: component.id,
                    id: component.id,
                    name: component.name,
                    //默认参数就是组件内部含有的比如type和text
                    ...config.defaultProps,
                    ...component.props,
                },
                //递归渲染
                renderComponents(component.children || [])
            )
        })
    }

    return <div className="h-[100%]">
        <pre>
            {/* {JSON.stringify(components, null, 2)} */}
        </pre>
        {renderComponents(components)}
    </div>
}
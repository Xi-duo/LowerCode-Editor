import React, { MouseEventHandler, useEffect, useState } from "react";
import { Component, useComponentsStore } from "../../stores/components"
import { useComponentConfigStore } from "../../stores/component-config";
import HoverMask from "../HoverMask";
import SelectedMask from "../SelectedMask";

export function EditArea() {

    const { components, curComponentId, setCurComponentId } = useComponentsStore();
    const { componentConfig } = useComponentConfigStore()

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
                    styles:component.styles,
                    //默认参数就是组件内部含有的比如type和text
                    ...config.defaultProps,
                    ...component.props,
                },

                //递归渲染
                renderComponents(component.children || [])
            )
        })

    }
    //被hover的组件id
    const [hoverComponentId, setHoverComponentId] = useState<number>();

    const handleMouseOver: MouseEventHandler = (e) => {
        //获取触发事件的元素一直向上回到html根元素的路径数组
        //原本可以使用e.composedPath但是react内部的event是合成事件，为了找到原生事件的属性
        //于是取了e.nativeEvent.composedPath
        const path = e.nativeEvent.composedPath();
        //遍历这个数组，找到带有组件设置id的位置
        for (let i = 0; i < path.length; i += 1) {
            const ele = path[i] as HTMLElement;

            const componentId = ele.dataset?.componentId;
            if (componentId) {
                setHoverComponentId(+componentId);
                return;
            }
        }
    }
    //处理点击事件
    const handleClick: MouseEventHandler = (e) => {
        const path = e.nativeEvent.composedPath()
        //还是找到从当前到html的路径遍历找到含有componentId的组件
        for (let i = 0; i < path.length; i += 1) {
            const ele = path[i] as HTMLElement

            const componentId = ele.dataset.componentId
            if (componentId) {
                setCurComponentId(+componentId)
                return;
            }
        }
    }

    return <div
        className="h-[100%] edit-area"
        onMouseOver={handleMouseOver}
        onMouseLeave={() => setHoverComponentId(undefined)}
        onClick={handleClick}>
        {/* <pre>
            {JSON.stringify(components, null, 2)}
        </pre>
        {hoverComponentId} */}
        {renderComponents(components)}
        {hoverComponentId && hoverComponentId !== curComponentId && (
            <HoverMask
                portalWrapperClassName='portal-wrapper'
                containerClassName='edit-area'
                componentId={hoverComponentId}
            />
        )}
        {curComponentId && (
            <SelectedMask
                portalWrapperClassName='portal-wrapper'
                containerClassName='edit-area'
                componentId={curComponentId}
            />
        )}
        <div className="portal-wrapper"></div>
    </div>
}
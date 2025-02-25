import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { getComponentById, useComponentsStore } from "../../stores/components"

interface HoverMaskProps {
    portalWrapperClassName: string
    containerClassName: string,
    componentId: number
}
//传入hover的容器的名称和id，便于对hover盒子的位置进行设定
function HoverMask({ containerClassName, componentId, portalWrapperClassName }: HoverMaskProps) {
    const [position, setPosition] = useState({
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        labelTop: 0,
        labelLeft: 0
    })

    const { components } = useComponentsStore()
    //根据id的变化也就是鼠标over盒子的改变来更新position
    useEffect(() => {
        updatePosition()
    }, [componentId])

    useEffect(() => {
        updatePosition();
    }, [components]);

    function updatePosition() {
        if (!componentId) return;

        const container = document.querySelector(`.${containerClassName}`);
        if (!container) return;

        const node = document.querySelector(`[data-component-id="${componentId}"]`);
        if (!node) return
        //getBoundingClientRect会返回调用元素的大小及其相对于视口的位置
        const { top, left, width, height } = node.getBoundingClientRect()
        const { top: containerTop, left: containerLeft } = container.getBoundingClientRect()

        let labelTop = top - containerTop + container.scrollTop
        let labelLeft = left - containerLeft + width

        if (labelTop <= 0) {
            labelTop -= -20;
        }


        setPosition({
            top: top - containerTop + container.scrollTop,
            left: left - containerLeft + container.scrollTop,
            width,
            height,
            labelLeft,
            labelTop,
        })
    }
    //避免每次hover到的时候都会重新调用cre，同时防止componentId变化的反复创建和卸载，优化性能
    const el = useMemo(() => {
        return document.querySelector(`.${portalWrapperClassName}`)!
    }, [])

    const curComponent = useMemo(() => {
        return getComponentById(componentId, components)
    }, [componentId])
    return createPortal((
        <>
            <div
                style={{
                    position: "absolute",
                    left: position.left,
                    top: position.top,
                    backgroundColor: "rgba(0, 0, 255, 0.1)",
                    border: "1px dashed blue",
                    //不能响应鼠标事件
                    pointerEvents: "none",
                    width: position.width,
                    height: position.height,
                    zIndex: 12,
                    borderRadius: 4,
                    boxSizing: 'border-box',
                }}
            />
            <div
                style={{
                    position: "absolute",
                    left: position.labelLeft,
                    top: position.labelTop,
                    fontSize: "14px",
                    zIndex: 13,
                    display: (!position.width || position.width < 10) ? "none" : "inline",
                    transform: 'translate(-100%, -100%)',
                }}
            >
                <div
                    style={{
                        padding: '0 8px',
                        backgroundColor: 'blue',
                        borderRadius: 4,
                        color: '#fff',
                        cursor: "pointer",
                        whiteSpace: 'nowrap',
                    }}
                >
                    {curComponent?.desc}
                </div>
            </div>
        </>
    ), el)
}
export default HoverMask
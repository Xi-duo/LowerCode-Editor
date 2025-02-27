import { useMemo } from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import { MaterialItem } from "../MaterialItem";
export function Material() {
    const { componentConfig } = useComponentConfigStore()

    const components = useMemo(() => {
        //提取所有的键值对作为对象数组
        return Object.values(componentConfig).filter(item => item.name !== 'Page');
    }, [componentConfig])

    return <div>{
        //把组件信息传递给Item组件
        components.map((item, index) => {
            return <MaterialItem name={item.name} desc={item.desc} key={item.name + index} />
        })
    }</div>
}
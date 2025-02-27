import { Tree } from "antd";
import { useComponentsStore } from "../../stores/components";

export function Outline() {
    const { components, setCurComponentId } = useComponentsStore();

    return <Tree
        fieldNames={{ title: 'desc', key: 'id' }}
        treeData={components as any}
        showLine
        defaultExpandAll
        onSelect={([selectedKey]) => {
            setCurComponentId(selectedKey as number);
        }}
    />
}
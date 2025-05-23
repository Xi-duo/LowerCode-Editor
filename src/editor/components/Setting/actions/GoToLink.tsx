import { useEffect, useState } from "react";
import { useComponentsStore } from "../../../stores/components";
import TextArea from "antd/es/input/TextArea";

export interface GoToLinkConfig {
    type: 'goToLink',
    url: string
}

export interface GoToLinkProps {
    value?: string
    defaultValue?: string
    onChange?: (config: GoToLinkConfig) => void
}
//可能会有很多的动作，所以抽离成组件
export function GoToLink(props: GoToLinkProps) {

    const { defaultValue, value: val, onChange } = props

    const { curComponentId } = useComponentsStore()
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        setValue(val)
    }, [val])

    function urlChange(value: string) {
        if (!curComponentId) return;

        setValue(value);

        onChange?.({
            type: 'goToLink',
            url: value
        });
    }

    return <div className='mt-[40px]'>
        <div className='flex items-center gap-[10px]'>
            <div>跳转链接</div>
            <div>
                <TextArea
                    style={{ height: 200, width: 500, border: '1px solid #000' }}
                    onChange={(e) => { urlChange(e.target.value) }}
                    value={value || ''}
                />
            </div>
        </div>
    </div>

}
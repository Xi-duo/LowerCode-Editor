import { Input } from "antd";
import { ComponentEvent } from "../../../stores/component-config";
import { useComponentsStore } from "../../../stores/components";
//可能会有很多的动作，所以抽离成组件
export function GoToLink(props: { event: ComponentEvent }) {

    const { event } = props

    const { curComponentId, curComponent, updateComponentProps } = useComponentsStore()

    function urlChange(eventName: string, value: string) {
        if (!curComponentId) return
//链接改变的时候更新props信息，传递到store内部作为props参数的一个对象
        updateComponentProps(curComponentId, {
            [eventName]: {
                ...curComponent?.props?.[eventName],
                url: value
            }
        })
    }

    return <div className='mt-[10px]'>
        <div className='flex items-center gap-[10px]'>
            <div>链接</div>
            <div>
                <Input
                    onChange={(e) => { urlChange(event.name, e.target.value) }}
                    //值设为获取到的url
                    value={curComponent?.props?.[event.name]?.url}
                />
            </div>
        </div>
    </div>

}
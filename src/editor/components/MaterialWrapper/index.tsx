import { Segmented } from "antd";
import { useState } from "react";
import { Outline } from "../Outline";
import { Source } from "../Source";
import { Material } from "../Material/Material";

export function MaterialWrapper() {
//在左侧渲染三种key
    const [key, setKey] = useState<string>('物料');
  
    return <div >
        <Segmented value={key} onChange={setKey} block options={['物料', '大纲', '源码']} />
        <div className='pt-[20px] h-[calc(100vh-60px-30px-20px)]' >
            {
                key === '物料' && <Material/>
            }
            {
                key === '大纲' && <Outline/>
            }
            {
                //源码也就是json结构
                //由于组件要区分编辑和预览两种状态，预览会响应事件之类的，渲染的内容也不同
                //所以区分dev和pre两种状态
                key === '源码' && <Source/>
            }
        </div>        
    </div>
}
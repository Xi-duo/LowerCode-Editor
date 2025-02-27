import { Collapse, Select, CollapseProps, Button } from 'antd';
import { useComponentsStore } from '../../stores/components';
import { useComponentConfigStore } from '../../stores/component-config';
import type { ComponentEvent } from '../../stores/component-config';
import { useState } from 'react';
import { ActionModal } from './ActionModal';
import { GoToLinkConfig } from './actions/GoToLink';
import { ShowMessageConfig } from './actions/ShowMessage';

export function ComponentEvent() {

    const { curComponent, updateComponentProps } = useComponentsStore();
    const { componentConfig } = useComponentConfigStore();
    const [actionModalOpen, setActionModalOpen] = useState(false)
    const [curEvent, setCurEvent] = useState<ComponentEvent>()

    if (!curComponent) return null;

    const items: CollapseProps['items'] = (componentConfig[curComponent.name].events || []).map(event => {
        return {
            key: event.name,
            label: <div className='flex justify-between leading-[30px]'>
                {event.label}
                <Button type="primary" onClick={(e) => {
                    e.stopPropagation()

                    setCurEvent(event);
                    setActionModalOpen(true);
                }}>添加动作</Button>
            </div>,
            children: <div>
                {
                    (curComponent.props[event.name]?.actions || []).map((item: GoToLinkConfig | ShowMessageConfig) => {
                        return <div>
                            {
                                item.type === 'goToLink' ? <div className='border border-[#aaa] m-[10px] p-[10px]'>
                                    <div className='text-[blue]'>跳转链接</div>
                                    <div>{item.url}</div>
                                </div> : null
                            }
                            {
                                item.type === 'showMessage' ? <div className='border border-[#aaa] m-[10px] p-[10px]'>
                                    <div className='text-[blue]'>消息弹窗</div>
                                    <div>{item.config.type}</div>
                                    <div>{item.config.text}</div>
                                </div> : null
                            }
                        </div>
                    })
                }
            </div>
        }
    })
    function handleModalOk(config?: GoToLinkConfig | ShowMessageConfig) {
        if (!config || !curEvent || !curComponent) {
            return;
        }
//把传入的config共享到store
        updateComponentProps(curComponent.id, {
            [curEvent.name]: {
                actions: [
                    ...(curComponent.props[curEvent.name]?.actions || []),
                    config
                ]
            }
        })

        setActionModalOpen(false)
    }

    
    return <div className='px-[10px]'>
        <Collapse className='mb-[10px]' items={items} defaultActiveKey={componentConfig[curComponent.name].events?.map(item => item.name)} />
        {/* 传入函数 */}
        <ActionModal visible={actionModalOpen} handleOk={handleModalOk} handleCancel={() => {
            setActionModalOpen(false)
        }} />
    </div>
}
import {
    useEffect,
    useMemo,
    useState,
} from 'react';
import { createPortal } from 'react-dom';
import { getComponentById, useComponentsStore } from '../../stores/components';
import { Dropdown, Popconfirm, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

//选择的类型参数，渲染的容器名字和组件id
interface SelectedMaskProps {
    portalWrapperClassName: string
    containerClassName: string
    componentId: number;
}

function SelectedMask({ containerClassName, portalWrapperClassName, componentId }: SelectedMaskProps) {


    const [position, setPosition] = useState({
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        labelTop: 0,
        labelLeft: 0,
    });
    //右侧要渲染参数之类的，所以通过store传递curComponentId
    const { components, curComponentId, deleteComponent, curComponent, setCurComponentId } = useComponentsStore();
    //点击不同组件的时候刷新框选
    useEffect(() => {
        updatePosition();
    }, [componentId]);

    //让添加或者删除组件的时候可以让选中框自动刷新
    //在改变宽高的时候到渲染完成在getBoundingClientRect是需要一定时间的，会导致无法改变，所以设置一个延迟
    useEffect(() => {
        setTimeout(() => {
            updatePosition();
        }, 200);
    }, [components]);

    //页面变化的时候刷新，也算是响应式的跟随框选
    useEffect(() => {
        const resizeHandler = () => {
            updatePosition();
        }
        window.addEventListener('resize', resizeHandler)
        return () => {
            window.removeEventListener('resize', resizeHandler)
        }
    }, []);

    function updatePosition() {
        if (!componentId) return;
        //获取父容器
        const container = document.querySelector(`.${containerClassName}`);
        if (!container) return;
        //获取click到的容器
        const node = document.querySelector(`[data-component-id="${componentId}"]`);
        if (!node) return;

        const { top, left, width, height } = node.getBoundingClientRect();
        const { top: containerTop, left: containerLeft } = container.getBoundingClientRect();
        //计算组件标签名渲染的位置
        let labelTop = top - containerTop + container.scrollTop;
        let labelLeft = left - containerLeft + width;

        if (labelTop <= 0) {
            labelTop -= -20;
        }

        setPosition({
            top: top - containerTop + container.scrollTop,
            left: left - containerLeft + container.scrollTop,
            width,
            height,
            labelTop,
            labelLeft,
        });
    }

    const el = useMemo(() => {
        //选择到专门渲染的那个盒子
        return document.querySelector(`.${portalWrapperClassName}`)!
    }, []);

    function handleDelete() {
        deleteComponent(curComponentId!);
        setCurComponentId(null);
    }
    //获取当前选择的组件，防止每次同样点击的时候重复调用函数
    const curSelectedComponent = useMemo(() => {
        return getComponentById(componentId, components);
    }, [componentId]);

    //找到父组件，便于在右边渲染父组件信息
    const parentComponents = useMemo(() => {
        const parentComponents = [];
        let component = curComponent;
        while (component?.parentId) {
            component = getComponentById(component.parentId, components)!
            parentComponents.push(component)
        }
        return parentComponents

    }, [curComponent])



    return createPortal((
        <>
            <div
                style={{
                    position: "absolute",
                    left: position.left,
                    top: position.top,
                    backgroundColor: "rgba(0, 0, 255, 0.1)",
                    border: "1px dashed blue",
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
                <Space>
                    <Dropdown
                        menu={{
                            items: parentComponents.map(item => ({
                                key: item.id,
                                label: item.desc,
                            })),
                            onClick: ({ key }) => {
                                setCurComponentId(+key);
                            }
                        }}
                        disabled={parentComponents.length === 0}
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
                            {curSelectedComponent?.desc}
                        </div>
                    </Dropdown>
                    {curComponentId !== 1 && (
                        //如果 id 不为 1，说明不是 Page 组件，就显示删除按钮
                        <div style={{ padding: '0 8px', backgroundColor: 'blue' }}>
                            <Popconfirm
                                title="确认删除？"
                                okText={'确认'}
                                cancelText={'取消'}
                                onConfirm={handleDelete}
                            >
                                <DeleteOutlined style={{ color: '#fff' }} />
                            </Popconfirm>
                        </div>
                    )}
                </Space>
            </div>
        </>
    ), el)
}

export default SelectedMask;
import React, { useRef } from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import { Component, useComponentsStore } from "../../stores/components"
import { message } from "antd";
import { ActionConfig } from "../Setting/ActionModal";
//内容跟editarea没差，但只用把josn递归渲染成prod组件
export function Preview() {
    const { components } = useComponentsStore();
    const { componentConfig } = useComponentConfigStore();

    const compoenntRefs = useRef<Record<string, any>>({})

    function handleEvent(component: Component) {
        const props: Record<string, any> = {}

        componentConfig[component.name].events?.forEach((event) => {
            const eventConfig = component.props[event.name]

            if (eventConfig) {
                props[event.name] = () => {
                    eventConfig?.actions?.forEach((action: ActionConfig) => {
                        if (action.type === 'goToLink') {
                            window.location.href = action.url
                        } else if (action.type === 'showMessage') {
                            if (action.config.type === "success") {
                                message.success(action.config.text)
                            } if (action.config.type === 'error') {
                                message.success(action.config.text)
                            }
                        } else if (action.type === 'customJS') {
                            const func = new Function(action.code)
                            func({
                                name: component.name,
                                props: component.props,
                                showMessage(content: string) {
                                    message.success(content)
                                }
                            })
                        }else if(action.type === 'componentMethod'){
                            const component = compoenntRefs.current[action.config.componentId]

                            if(component){
                                component[action.config.method]?.()
                            }
                        }
                    })
                }
            }
        })
        return props
    }
    function renderComponents(components: Component[]): React.ReactNode {
        return components.map((component: Component) => {
            const config = componentConfig?.[component.name]

            if (!config?.prod) {
                return null;
            }

            return React.createElement(
                config.prod,
                {
                    key: component.id,
                    id: component.id,
                    name: component.name,
                    styles: component.styles,
                    ref: (ref: Record<string, any>) => { compoenntRefs.current[component.id] = ref },
                    ...config.defaultProps,
                    ...component.props,
                    ...handleEvent(component)
                },
                renderComponents(component.children || [])
            )
        })
    }

    return <div>
        {renderComponents(components)}
    </div>
}
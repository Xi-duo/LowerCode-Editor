import React from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import { Component, useComponentsStore } from "../../stores/components"
import { GoToLinkConfig } from "../Setting/actions/GoToLink";
import { ShowMessageConfig } from "../Setting/actions/ShowMessage";
import { message } from "antd";
//内容跟editarea没差，但只用把josn递归渲染成prod组件
export function Preview() {
    const { components } = useComponentsStore();
    const { componentConfig } = useComponentConfigStore();

    function handleEvent(component: Component) {
        const props: Record<string, any> = {}

        componentConfig[component.name].events?.forEach((event) => {
            const eventConfig = component.props[event.name]

            if (eventConfig) {
                props[event.name] = () => {
                    eventConfig?.actions?.forEach((action: GoToLinkConfig | ShowMessageConfig) => {
                        if (action.type === 'goToLink') {
                            window.location.href = action.url
                        } else if (action.type === 'showMessage') {
                            if (action.config.type === "success") {
                                message.success(action.config.text)
                            } if (action.config.type === 'error') {
                                message.success(action.config.text)
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
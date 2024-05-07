/**
 * This is a bit of a hack and I have no idea if this is correct or safe to use.
 * This is a work around sharing down objects to children,
 * without needing a context provider, which forces the whole components to become
 * client components. If createContext could be used to only share a object down the react tree,
 * that would be a better solution.
 */

import React from 'react'

export const isComponentMatching = (child: React.ReactNode, targetType: any): boolean => {
  if (!React.isValidElement(child)) return false
  if (React.isValidElement(child) && child.type === targetType) {
    return true
  }

  let displayName = undefined
  if (typeof window === 'undefined') {
    // @ts-ignore
    displayName = Array.isArray(child?.type?._payload?.value) ? child.type?._payload?.value?.at(-1) : child.type?._payload?.value?.displayName
  } else {
    // @ts-ignore
    displayName = Array.isArray(child?.type?._payload?.value)
      ? // @ts-ignore
        child.type?._payload?.value?.at(-1)
      : // @ts-ignore
        child?.type?._payload?.value?.name || child?.type?._payload?.value?.displayName
  }

  return [targetType.name, targetType.displayName].includes(displayName)
}

export function findComponentsOfType(children: React.ReactNode, componentType: React.ElementType): React.ReactElement<any, any>[] {
  const foundComponents = React.Children.toArray(children).filter((child) => React.isValidElement(child) && isComponentMatching(child, componentType))

  // Cast each found child as React.ReactElement since we've already verified they are valid elements.
  return foundComponents as React.ReactElement<any, any>[]
}

export function findComponentOfType(children: React.ReactNode, componentType: React.ElementType): React.ReactElement | undefined {
  const found = React.Children.toArray(children).find((child) => React.isValidElement(child) && isComponentMatching(child, componentType))

  return found as React.ReactElement<any, any> | undefined
}

export function applyPropsToChildrenOfType(
  children: React.ReactNode,
  extraProps: any,
  componentType: React.ElementType | React.ElementType[],
  options: {
    includeIndex?: boolean
    recursive?: boolean
  } = {}
): React.ReactNode {
  const { includeIndex = false, recursive = false } = options

  return React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) {
      return child
    }

    const isEligibleComponent = Array.isArray(componentType)
      ? componentType.some((type) => isComponentMatching(child, type))
      : isComponentMatching(child, componentType)

    const props = isEligibleComponent ? { ...extraProps, ...(includeIndex ? { index } : {}) } : {}

    if (!(child.props && child.props.children) || !recursive) {
      return React.cloneElement(child, props)
    }

    const childProps = {
      ...child.props,
      ...props,
      children: applyPropsToChildrenOfType(child.props.children, extraProps, componentType, options)
    }
    return React.cloneElement(child, childProps)
  })
}

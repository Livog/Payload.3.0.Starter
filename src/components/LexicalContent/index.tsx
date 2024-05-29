/* eslint-disable react/no-children-prop */
import normalizePath from '@/utils/normalizePath'
import clsx from 'clsx'
import Link from 'next/link'
import React, { CSSProperties, type FC, type ReactElement } from 'react'
import Image from 'next/image'
import { IS_BOLD, IS_CODE, IS_ITALIC, IS_STRIKETHROUGH, IS_SUBSCRIPT, IS_SUPERSCRIPT, IS_UNDERLINE } from './RichTextNodeFormat'

type SerializedLexicalNode = {
  children?: SerializedLexicalNode[]
  direction: string
  format: number
  indent?: string | number
  type: string
  version: number
  style?: string
  mode?: string
  text?: string
  [other: string]: any
}

type TextComponentProps = {
  children: ReactElement | string
  format: number
}

const getLinkForDocument = (doc: any, locale?: string): string => {
  let path = doc?.path
  if (!path || path.startsWith('/home') || path === '/' || path === '') path = '/'
  return normalizePath(`/${locale}${path}`)
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

function calculateAspectRatio(width: number, height: number): string {
  const divisor = gcd(width, height)
  const simplifiedWidth = width / divisor
  const simplifiedHeight = height / divisor

  return `${simplifiedWidth}x${simplifiedHeight}`
}

const TextComponent: FC<TextComponentProps> = ({ children, format }) => {
  const formatFunctions: { [key: number]: (child: ReactElement | string) => ReactElement } = {
    [IS_BOLD]: (child) => <strong>{child}</strong>,
    [IS_ITALIC]: (child) => <em>{child}</em>,
    [IS_STRIKETHROUGH]: (child) => <del>{child}</del>,
    [IS_UNDERLINE]: (child) => <u>{child}</u>,
    [IS_CODE]: (child) => <code>{child}</code>,
    [IS_SUBSCRIPT]: (child) => <sub>{child}</sub>,
    [IS_SUPERSCRIPT]: (child) => <sup>{child}</sup>
  }

  const formattedText = Object.entries(formatFunctions).reduce((formattedText, [key, formatter]) => {
    return format & Number(key) ? formatter(formattedText) : formattedText
  }, children)

  return <>{formattedText}</>
}

const SerializedLink: React.FC<{
  node: SerializedLexicalNode
  locale: string
  children: JSX.Element | null
}> = ({ node, locale, children }) => {
  const { doc, url, newTab, linkType } = node.fields as any
  const document = doc?.value
  const href = linkType === 'custom' ? url : getLinkForDocument(document, locale)
  const target = newTab ? '_blank' : undefined

  return (
    <Link href={href} target={target}>
      {children}
    </Link>
  )
}

const getNodeClassNames = (node: SerializedLexicalNode) => {
  const attributes: Record<string, any> = {}
  if (!node) return attributes

  let classNames = ''
  if (String(node?.format).toString()?.includes('left') && node.direction !== 'ltr') classNames += 'text-left '
  if (String(node?.format).toString()?.includes('center')) classNames += 'text-center '
  if (String(node?.format).toString()?.includes('right') && node.direction !== 'rtl') classNames += 'text-right '

  if (classNames.length > 0) attributes.className = classNames.trim()

  const indent = parseInt(`${node?.indent || 0}`)
  if (!isNaN(indent) && indent !== 0) {
    attributes.style = { '--indent': `${indent * 10}px` } as CSSProperties
    attributes.className = `${attributes.className ?? ''} ml-[--indent]`.trim()
  }

  return attributes
}

const LexicalContent: React.FC<{
  childrenNodes: SerializedLexicalNode[]
  locale: string
  className?: string
  lazyLoadImages: boolean
}> = ({ childrenNodes, locale, lazyLoadImages = false }) => {
  if (!Array.isArray(childrenNodes)) return null

  const renderedChildren = childrenNodes.map((node, ix) => {
    if (!node) return null
    const attributes = getNodeClassNames(node || '')
    if (node.type === 'text') {
      return (
        <TextComponent key={ix} format={node.format}>
          <>
            {Object.keys(attributes).length > 0 && <span {...attributes}>{node?.text || ''}</span>}
            {(Object.keys(attributes).length === 0 && node?.text) || ''}
          </>
        </TextComponent>
      )
    }

    const serializedChildren = node.children ? <LexicalContent key={ix} childrenNodes={node.children} locale={locale} lazyLoadImages={lazyLoadImages} /> : null
    switch (node.type) {
      case 'linebreak':
        return <br key={ix} />
      case 'link':
        return <SerializedLink key={ix} node={node} locale={locale} children={serializedChildren} />
      case 'list':
        const ListTag = node.listType === 'bullet' ? 'ul' : 'ol'
        attributes.className = clsx(attributes.className, 'mb-4 pl-8', ListTag === 'ol' ? 'list-decimal' : 'list-disc')
        return (
          <ListTag key={ix} {...attributes}>
            {serializedChildren}
          </ListTag>
        )
      case 'listitem':
        return (
          <li key={ix} {...attributes}>
            {serializedChildren}
          </li>
        )
      case 'heading':
        const HeadingTag = node.tag as keyof JSX.IntrinsicElements
        return (
          <HeadingTag key={ix} {...attributes}>
            {serializedChildren}
          </HeadingTag>
        )
      case 'quote':
        return (
          <blockquote key={ix} {...attributes}>
            {serializedChildren}
          </blockquote>
        )
      case 'upload':
        const upload = node?.value
        if (!upload) return null
        const imageAspectRatio = calculateAspectRatio(upload.width, upload.height)
        return (
          <Image
            key={ix}
            width={upload.width}
            height={upload.height}
            src={upload?.url}
            loading={lazyLoadImages ? 'lazy' : 'eager'}
            fetchPriority={lazyLoadImages ? 'low' : 'high'}
            sizes="(max-width: 768px) 65ch, 100vw"
            className="max-w-[calc(100%+40px)] translate-x-[-20px]"
            alt={upload?.alt || upload.filename}
          />
        )
      default:
        if (Array.isArray(serializedChildren?.props?.childrenNodes) && serializedChildren?.props?.childrenNodes.length === 0) return <br key={ix} />
        return (
          <p key={ix} {...attributes}>
            {serializedChildren}
          </p>
        )
    }
  })

  return <>{renderedChildren.filter((node) => node !== null)}</>
}

export default LexicalContent

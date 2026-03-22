import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import mermaid from 'mermaid'

import 'katex/dist/katex.min.css'

interface MarkdownRendererProps {
  content: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    primaryColor: '#3b82f6',
    primaryTextColor: '#1f2937',
    primaryBorderColor: '#3b82f6',
    lineColor: '#6b7280',
    secondaryColor: '#e5e7eb',
    tertiaryColor: '#f3f4f6',
    background: '#ffffff',
    mainBkg: '#f9fafb',
    secondBkg: '#f3f4f6',
    nodeBorder: '#d1d5db',
    clusterBkg: '#f3f4f6',
    clusterBorder: '#e5e7eb',
    titleColor: '#111827',
    edgeLabelBackground: '#ffffff',
  },
  securityLevel: 'loose',
  fontFamily: 'sans-serif',
  flowchart: {
    useMaxWidth: true,
    curve: 'linear',
  },
  sequence: {
    actorMargin: 50,
    boxMargin: 10,
  },
  gantt: {
    titleTopMargin: 25,
    barHeight: 20,
    barGap: 4,
    topPadding: 50,
  },
  pie: {
    useMaxWidth: true,
  },
  mindmap: {
    useMaxWidth: true,
  },
})

function processCellContent(content: React.ReactNode): React.ReactNode {
  if (typeof content === 'string') {
    return content.split('<br>').map((part, i, arr) => (
      <span key={i}>
        {part}
        {i < arr.length - 1 && <br />}
      </span>
    ))
  }
  return content
}

function MermaidDiagram({ code }: { code: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
        const { svg } = await mermaid.render(id, code)
        setSvg(svg)
        setError('')
      } catch (err) {
        console.error('Mermaid render error:', err)
        setError('Failed to render diagram')
      }
    }

    if (code) {
      renderDiagram()
    }
  }, [code])

  if (error) {
    return (
      <div className="mermaid-error p-4 my-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 text-sm">{error}</p>
        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
          {code}
        </pre>
      </div>
    )
  }

  const svgWithBg = svg.replace(/<svg/, '<svg style="background-color:#ffffff"');

  return (
    <div 
      ref={containerRef}
      className="mermaid-diagram my-4 flex justify-center overflow-auto"
      style={{ 
        backgroundColor: '#ffffff', 
        padding: '1rem',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb',
        maxWidth: '100%',
        minHeight: '200px',
      }}
      dangerouslySetInnerHTML={{ __html: svgWithBg }}
    />
  )
}

export function MarkdownRenderer({ content, className = '', size = 'md' }: MarkdownRendererProps) {
  const sizeClass = `size-${size}`

  return (
    <div className={`markdown-body ${sizeClass} ${className}`} style={{ '--mermaid-bg': '#ffffff' } as React.CSSProperties}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          [rehypeKatex, { strict: false, trust: true, throwOnError: false }]
        ]}
        components={{
          h1: ({ children }) => <h1>{children}</h1>,
          h2: ({ children }) => <h2>{children}</h2>,
          h3: ({ children }) => <h3>{children}</h3>,
          td: ({ children }) => (
            <td>{processCellContent(children)}</td>
          ),
          th: ({ children }) => (
            <th>{processCellContent(children)}</th>
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '')
            const inline = !match

            if (inline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }

            const language = match[1].toLowerCase()

            if (language === 'mermaid') {
              return (
                <MermaidDiagram code={String(children).replace(/\n$/, '')} />
              )
            }

            return (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={language}
                PreTag="div"
                customStyle={{
                  margin: '1em 0',
                  borderRadius: '0.5em',
                  padding: '1em',
                  fontSize: '0.875em',
                  lineHeight: 1.5,
                }}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            )
          },
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <figure>
              <img src={src} alt={alt} />
              {alt && <figcaption>{alt}</figcaption>}
            </figure>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

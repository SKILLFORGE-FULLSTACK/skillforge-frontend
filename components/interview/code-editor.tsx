"use client"

import { useState } from "react"
import { RefreshCcw, Filter, ChevronDown, ChevronUp, Play } from "lucide-react"

const initialCode = `function levelOrder(root: TreeNode | null): number[][] {

  if (!root) return [];


  const result: number[][] = [];

  const queue: TreeNode[] = [root];


  while (queue.length > 0) {

    const levelSize = queue.length;

    const currentLevel: number[] = [];

    for (let i = 0; i < levelSize; i++) {

      const node = queue.shift()!;

      currentLevel.push(node.val);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(currentLevel);
  }

  return result;
}`

export function CodeEditor() {
  const [language, setLanguage] = useState("TypeScript")
  const [consoleExpanded, setConsoleExpanded] = useState(true)

  return (
    <div className="h-full flex flex-col bg-[#0d1117]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 text-primary rounded-lg text-sm font-medium">
            {language}
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <RefreshCcw className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <Filter className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="flex-1 overflow-auto font-mono text-sm">
        <div className="flex">
          {/* Line numbers */}
          <div className="py-4 px-2 text-right text-muted-foreground/50 select-none border-r border-border/50 bg-[#0d1117]">
            {initialCode.split('\n').map((_, i) => (
              <div key={i} className="leading-6">{i + 1}</div>
            ))}
          </div>
          {/* Code content */}
          <pre className="flex-1 p-4 text-foreground overflow-x-auto">
            <code>
              {initialCode.split('\n').map((line, i) => (
                <div key={i} className="leading-6">
                  {highlightCode(line)}
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>

      {/* Console Panel */}
      <div className="border-t border-border bg-card">
        <button 
          onClick={() => setConsoleExpanded(!consoleExpanded)}
          className="w-full flex items-center justify-between px-4 py-2 hover:bg-secondary/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground font-medium">Console</span>
          </div>
          {consoleExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        {consoleExpanded && (
          <div className="px-4 py-3 bg-[#0d1117] border-t border-border font-mono text-sm">
            <div className="text-muted-foreground">
              {">"} Testing levelOrderTraversal...
            </div>
            <div className="text-warning">
              Waiting for execution...
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function highlightCode(line: string): React.ReactNode {
  // Simple syntax highlighting
  return line
    .replace(/(function|const|let|var|if|for|while|return)/g, '<span class="text-primary">$1</span>')
    .replace(/(TreeNode|number)/g, '<span class="text-accent">$1</span>')
    .replace(/(\d+)/g, '<span class="text-warning">$1</span>')
    .split(/(<span.*?<\/span>)/)
    .map((part, i) => {
      if (part.startsWith('<span')) {
        const match = part.match(/class="([^"]+)".*?>(.+?)<\/span>/)
        if (match) {
          return <span key={i} className={match[1]}>{match[2]}</span>
        }
      }
      return part
    })
}

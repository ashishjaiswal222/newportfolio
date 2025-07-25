import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Copy, Code2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  fileName?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ 
  code, 
  language = 'javascript', 
  title,
  fileName 
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        title: "Code Copied!",
        description: "Code has been copied to clipboard",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy code to clipboard",
        variant: "destructive"
      });
    }
  };

  // Simple syntax highlighting for demo - in production, use Prism.js or similar
  const getLanguageColor = (lang: string) => {
    const colors: Record<string, string> = {
      javascript: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      typescript: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      python: 'bg-green-500/10 text-green-500 border-green-500/20',
      html: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      css: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      react: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
      node: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      sql: 'bg-red-500/10 text-red-500 border-red-500/20',
      json: 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    };
    return colors[lang.toLowerCase()] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  // Basic syntax highlighting for popular languages
  const highlightCode = (code: string, lang: string) => {
    if (lang === 'javascript' || lang === 'typescript') {
      return code
        .replace(/\b(const|let|var|function|return|if|else|for|while|class|extends|import|export|from|default)\b/g, '<span class="text-purple-400 font-semibold">$1</span>')
        .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-orange-400">$1</span>')
        .replace(/(\/\/.*$)/gm, '<span class="text-gray-500 italic">$1</span>')
        .replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="text-green-400">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="text-blue-400">$1</span>');
    }
    
    if (lang === 'python') {
      return code
        .replace(/\b(def|class|if|elif|else|for|while|import|from|return|try|except|with|as)\b/g, '<span class="text-purple-400 font-semibold">$1</span>')
        .replace(/\b(True|False|None)\b/g, '<span class="text-orange-400">$1</span>')
        .replace(/(#.*$)/gm, '<span class="text-gray-500 italic">$1</span>')
        .replace(/(".*?"|'.*?')/g, '<span class="text-green-400">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="text-blue-400">$1</span>');
    }

    if (lang === 'html') {
      return code
        .replace(/(&lt;\/?[^&gt;]+&gt;)/g, '<span class="text-blue-400">$1</span>')
        .replace(/(\w+)=/g, '<span class="text-purple-400">$1</span>=')
        .replace(/="([^"]*)"/g, '="<span class="text-green-400">$1</span>"');
    }

    if (lang === 'css') {
      return code
        .replace(/([.#]?[\w-]+)\s*{/g, '<span class="text-yellow-400">$1</span> {')
        .replace(/([\w-]+):/g, '<span class="text-blue-400">$1</span>:')
        .replace(/:\s*([^;]+);/g, ': <span class="text-green-400">$1</span>;');
    }

    return code;
  };

  const escapedCode = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const highlightedCode = highlightCode(escapedCode, language);

  return (
    <div className="my-6 rounded-lg border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-3">
          <Code2 className="w-4 h-4 text-muted-foreground" />
          {fileName && (
            <span className="text-sm font-mono text-foreground">{fileName}</span>
          )}
          {title && !fileName && (
            <span className="text-sm text-foreground">{title}</span>
          )}
          <Badge 
            variant="outline" 
            className={`text-xs ${getLanguageColor(language)}`}
          >
            {language.toUpperCase()}
          </Badge>
        </div>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          className="h-8 w-8 p-0 hover:bg-background"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Code Content */}
      <div className="relative">
        <pre className="overflow-x-auto p-4 bg-background text-sm leading-relaxed">
          <code 
            className="font-mono text-foreground"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
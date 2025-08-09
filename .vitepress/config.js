import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  title: 'Gola',
  description: 'Build LLM agents with YAML configuration',
  base: '/', // Custom domain - no base path needed
  ignoreDeadLinks: true,
  srcDir: 'docs',
  
  head: [
    ['link', { rel: 'icon', href: '/gola_logo_light.png' }],
    ['meta', { name: 'theme-color', content: '#3c82f6' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
    ['meta', { property: 'og:title', content: 'Gola | Build LLM agents with YAML configuration' }],
    ['meta', { property: 'og:site_name', content: 'Gola' }],
    ['meta', { property: 'og:url', content: 'https://gola.chat/' }],
  ],

  themeConfig: {
    logo: {
      light: '/gola_logo_light.png',
      dark: '/gola_logo_dark.png'
    },
    
    nav: [
      { text: 'Guide', link: '/getting-started' },
      { text: 'Configuration', link: '/configuration' },
      { text: 'Examples', link: '/examples/' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'What is Gola?', link: '/introduction' },
          { text: 'Getting Started', link: '/getting-started' }
        ]
      },
      {
        text: 'Core Features',
        items: [
          { text: 'Agent Configuration', link: '/configuration' },
          { text: 'LLM Providers', link: '/providers' },
          { text: 'MCP Integration', link: '/mcp' },
          { text: 'Guardrails', link: '/guardrails' },
          { text: 'Tracing', link: '/tracing' },
          { text: 'RAG (Retrieval-Augmented Generation)', link: '/rag' },
          { text: 'Runtime Auto-Download', link: '/runtime-autodownload' }
        ]
      },
      {
        text: 'Implementation',
        items: [
          { text: 'Agent Design Patterns', link: '/agent-design-patterns' },
          { text: 'Agent Behavior & Testing', link: '/agent-behavior' },
          { text: 'Publishing on GitHub', link: '/publishing' },
          { text: 'Deployment', link: '/deployment' }
        ]
      },
      {
        text: 'Examples',
        items: [
          { text: 'Minimal Agent', link: '/examples/minimal' },
          { text: 'MCP Tools', link: '/examples/mcp' },
          { text: 'Travel Assistant Agent', link: '/examples/travel-assistant' }
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'Terminal Interface', link: '/terminal' },
          { text: 'Contributing', link: '/contributing' },
          { text: 'License', link: '/license' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/gola-agent/gola' }
    ],

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/gola-agent/gola-docs/edit/main/:path'
    },

    footer: {
      message: 'Released under the <a href="/license">MIT License</a>. | <a href="mailto:gbrigand@gmail.com">Contact Me</a>',
      copyright: 'Copyright © 2025 Gianluca Brigandi'
    }
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    codeTransformers: [
      // We use `[!!code` in demo to prevent transformation, here we revert it back.
      {
        postprocess(code) {
          return code.replace(/\[\!\!code/g, '[!code')
        }
      }
    ]
  }
}))
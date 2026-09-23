import { describe, expect, it } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'

type Rule = { signals: string[]; actions: string[] }
type Contract = {
  version: number
  precedence: string[]
  actionPrefixes: string[]
  rules: Record<string, Rule>
}

const CONTRACT_PATH = 'docs/ui-ux/decision-contract.json'
const REQUIRED_FILES = [
  CONTRACT_PATH,
  'docs/ui-ux/README.md',
  'docs/ui-ux/apps/dhcb.md',
  'docs/ui-ux/apps/hub.md',
  '.agents/skills/ui-ux/SKILL.md',
  '.agents/rules/ui-ux-guidelines.md',
  'packages/core-ui/theme.css',
]

function loadContract(): Contract {
  return JSON.parse(readFileSync(CONTRACT_PATH, 'utf8')) as Contract
}

describe('UI/UX decision contract', () => {
  it('giữ đầy đủ source-of-truth/profile bắt buộc', () => {
    for (const path of REQUIRED_FILES) expect(existsSync(path), path).toBe(true)
  })

  it('dùng grammar đóng, không cho action lạ hoặc action executable', () => {
    const contract = loadContract()
    expect(contract.version).toBe(1)
    expect(contract.actionPrefixes.sort()).toEqual(['constraint', 'mode', 'pattern', 'review'])

    for (const [condition, rule] of Object.entries(contract.rules)) {
      expect(rule.signals.length, condition).toBeGreaterThan(0)
      expect(rule.actions.length, condition).toBeGreaterThan(0)

      for (const action of rule.actions) {
        const [prefix, value, ...rest] = action.split(':')
        expect(rest, action).toHaveLength(0)
        expect(contract.actionPrefixes, action).toContain(prefix)
        expect(value?.trim().length, action).toBeGreaterThan(0)
        expect(action, action).not.toMatch(/https?:\/\/|javascript:|<script|\bexec\b|\beval\b/i)
      }
    }
  })

  it('không biến decision contract thành source token/style thứ hai', () => {
    const raw = readFileSync(CONTRACT_PATH, 'utf8')
    expect(raw).not.toMatch(/#[0-9a-f]{3,8}\b/i)
    expect(raw).not.toMatch(/\brgb\s*\(|\boklch\s*\(|\b\d+(?:\.\d+)?(?:px|rem)\b/i)
    expect(raw).not.toContain('fontFamily')
  })

  it('có must-have và các context rủi ro cốt lõi của Đồng Hành', () => {
    const rules = loadContract().rules
    for (const key of [
      'must-have',
      'learning-reading',
      'voice-realtime',
      'mobile-low-end',
      'children',
      'gamification',
      'payment-trust',
      'data-heavy',
      'forms',
      'accessibility',
    ]) {
      expect(rules[key], key).toBeDefined()
    }
  })

  it('skill và auto-rule trỏ vào decision contract và đúng hai app hiện hành', () => {
    const skill = readFileSync('.agents/skills/ui-ux/SKILL.md', 'utf8')
    const rule = readFileSync('.agents/rules/ui-ux-guidelines.md', 'utf8')

    for (const content of [skill, rule]) {
      expect(content).toContain('docs/ui-ux/decision-contract.json')
      expect(content).toContain('apps/dhcb/src/**')
      expect(content).toContain('apps/hub/src/**')
      expect(content).not.toContain('apps/english/src/**')
    }
    expect(skill).not.toContain('Sử dụng Spring Physics hoặc CSS Transitions (`transition-all')
  })
})

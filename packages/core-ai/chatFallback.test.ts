// chatFallback.test.ts — Chuỗi dự phòng Groq → Anthropic → Gemini của generateChatText().
// Không gọi mạng: mock cả ba provider + recordAiTokenUsage. Điều cần canh là THỨ TỰ thử,
// điều kiện "coi là thành công" của từng provider, và ghi token đúng provider đã trả lời.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  callGroqChatWithKeyPool: vi.fn(),
  callAnthropicChat: vi.fn(),
  callGemini: vi.fn(),
  recordAiTokenUsage: vi.fn<(p: { provider: string; usage: unknown }) => Promise<void>>(
    async () => {},
  ),
}))

vi.mock('./chatProviders.js', () => ({
  callGroqChatWithKeyPool: mocks.callGroqChatWithKeyPool,
  callAnthropicChat: mocks.callAnthropicChat,
}))
vi.mock('./geminiApi.js', () => ({ callGemini: mocks.callGemini }))
vi.mock('./aiTokenUsage.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./aiTokenUsage.js')>()
  return { ...actual, recordAiTokenUsage: mocks.recordAiTokenUsage }
})

import { generateChatText } from './chatFallback.js'

const PARAMS = { system: 'sys', userMessage: 'hi', maxTokens: 64, mode: 'debate' }
const KEYS = ['GROQ_API_KEY', 'ANTHROPIC_API_KEY', 'GEMINI_API_KEY'] as const
const saved: Partial<Record<(typeof KEYS)[number], string | undefined>> = {}

function anthropicOk(text: string, usage?: object) {
  return {
    kind: 'response',
    status: 200,
    bodyText: JSON.stringify({ content: [{ text }], ...(usage ? { usage } : {}) }),
    latencyMs: 1,
  }
}

beforeEach(() => {
  for (const k of KEYS) {
    saved[k] = process.env[k]
    delete process.env[k]
  }
  vi.clearAllMocks()
})
afterEach(() => {
  for (const k of KEYS) {
    if (saved[k] === undefined) delete process.env[k]
    else process.env[k] = saved[k]
  }
})

describe('generateChatText — chuỗi dự phòng', () => {
  it('không có key nào → null, không gọi provider nào', async () => {
    expect(await generateChatText(PARAMS)).toBeNull()
    expect(mocks.callGroqChatWithKeyPool).not.toHaveBeenCalled()
    expect(mocks.callAnthropicChat).not.toHaveBeenCalled()
    expect(mocks.callGemini).not.toHaveBeenCalled()
  })

  it('Groq thành công → trả text đã trim, ghi token với model THẬT đã dùng, không thử tiếp', async () => {
    process.env.GROQ_API_KEY = 'g'
    process.env.ANTHROPIC_API_KEY = 'a'
    mocks.callGroqChatWithKeyPool.mockResolvedValue({
      kind: 'success',
      text: '  xin chào  ',
      latencyMs: 1,
      usage: { promptTokens: 1, completionTokens: 2 },
      model: 'llama-x',
    })
    expect(await generateChatText(PARAMS)).toBe('xin chào')
    expect(mocks.recordAiTokenUsage).toHaveBeenCalledWith(
      expect.objectContaining({ provider: 'groq', model: 'llama-x', mode: 'debate' }),
    )
    expect(mocks.callAnthropicChat).not.toHaveBeenCalled()
  })

  it('Groq trả text rỗng / lỗi http / ném lỗi → sang Anthropic', async () => {
    process.env.GROQ_API_KEY = 'g'
    process.env.ANTHROPIC_API_KEY = 'a'
    mocks.callAnthropicChat.mockResolvedValue(anthropicOk('từ anthropic'))

    mocks.callGroqChatWithKeyPool.mockResolvedValueOnce({
      kind: 'success',
      text: '   ',
      latencyMs: 1,
      usage: null,
      model: 'm',
    })
    expect(await generateChatText(PARAMS)).toBe('từ anthropic')

    mocks.callGroqChatWithKeyPool.mockResolvedValueOnce({
      kind: 'http_error',
      status: 429,
      bodyText: '',
      latencyMs: 1,
    })
    expect(await generateChatText(PARAMS)).toBe('từ anthropic')

    mocks.callGroqChatWithKeyPool.mockRejectedValueOnce(new Error('timeout'))
    expect(await generateChatText(PARAMS)).toBe('từ anthropic')

    // Groq không được ghi token lần nào (không thành công), Anthropic ghi 3 lần.
    const providers = mocks.recordAiTokenUsage.mock.calls.map((c) => c[0].provider)
    expect(providers).toEqual(['anthropic', 'anthropic', 'anthropic'])
  })

  it('Anthropic: đọc usage từ body để ghi token', async () => {
    process.env.ANTHROPIC_API_KEY = 'a'
    mocks.callAnthropicChat.mockResolvedValue(
      anthropicOk('ok', { input_tokens: 5, output_tokens: 7 }),
    )
    expect(await generateChatText(PARAMS)).toBe('ok')
    const call = mocks.recordAiTokenUsage.mock.calls[0]?.[0]
    expect(call?.usage).toMatchObject({ promptTokens: 5, completionTokens: 7 })
  })

  it('Anthropic status ngoài 2xx / body không có text / text rỗng / lỗi mạng / ném lỗi → sang Gemini', async () => {
    process.env.ANTHROPIC_API_KEY = 'a'
    process.env.GEMINI_API_KEY = 'k'
    mocks.callGemini.mockResolvedValue('từ gemini')

    mocks.callAnthropicChat.mockResolvedValueOnce({
      kind: 'response',
      status: 529,
      bodyText: '{}',
      latencyMs: 1,
    })
    expect(await generateChatText(PARAMS)).toBe('từ gemini')

    mocks.callAnthropicChat.mockResolvedValueOnce({
      kind: 'response',
      status: 200,
      bodyText: JSON.stringify({ content: [] }),
      latencyMs: 1,
    })
    expect(await generateChatText(PARAMS)).toBe('từ gemini')

    mocks.callAnthropicChat.mockResolvedValueOnce(anthropicOk('   '))
    expect(await generateChatText(PARAMS)).toBe('từ gemini')

    mocks.callAnthropicChat.mockResolvedValueOnce({
      kind: 'network_error',
      message: 'ECONNRESET',
      latencyMs: 1,
    })
    expect(await generateChatText(PARAMS)).toBe('từ gemini')

    // Body không phải JSON → JSON.parse ném → catch → vẫn sang Gemini, không crash.
    mocks.callAnthropicChat.mockResolvedValueOnce({
      kind: 'response',
      status: 200,
      bodyText: 'not json',
      latencyMs: 1,
    })
    expect(await generateChatText(PARAMS)).toBe('từ gemini')
  })

  it('Gemini: ghi token TRƯỚC khi kiểm text (đã tính tiền dù text rỗng) → text rỗng thì null', async () => {
    process.env.GEMINI_API_KEY = 'k'
    mocks.callGemini.mockImplementation(
      async (
        _k: string,
        _m: string,
        _s: string,
        _msgs: unknown,
        _max: number,
        _opt: unknown,
        onUsage: (u: { promptTokens: number; completionTokens: number }) => void,
      ) => {
        onUsage({ promptTokens: 3, completionTokens: 0 })
        return '   '
      },
    )
    expect(await generateChatText(PARAMS)).toBeNull()
    expect(mocks.recordAiTokenUsage).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: 'gemini',
        usage: { promptTokens: 3, completionTokens: 0 },
      }),
    )
  })

  it('Gemini trả text → trim; Gemini ném lỗi → null (hết provider)', async () => {
    process.env.GEMINI_API_KEY = 'k'
    mocks.callGemini.mockResolvedValueOnce(' đáp ')
    expect(await generateChatText(PARAMS)).toBe('đáp')
    mocks.callGemini.mockRejectedValueOnce(new Error('quota'))
    expect(await generateChatText(PARAMS)).toBeNull()
  })
})

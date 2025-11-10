// Voice recognition using Web Speech API
export class VoiceRecognition {
  private recognition: any
  private isSupported: boolean
  private isRecording: boolean = false

  constructor() {
    // Check if running in browser
    if (typeof window === 'undefined') {
      this.isSupported = false
      this.recognition = null
      return
    }

    // Check if browser supports Web Speech API
    this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
    
    if (this.isSupported) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      this.recognition = new SpeechRecognition()
      this.recognition.lang = 'zh-CN'
      this.recognition.continuous = true  // 改为持续识别
      this.recognition.interimResults = true  // 启用中间结果
      this.recognition.maxAlternatives = 1
      
      // 添加结束事件监听
      this.recognition.onend = () => {
        this.isRecording = false
        console.log('语音识别结束')
      }
    }
  }

  isAvailable(): boolean {
    return this.isSupported
  }

  start(onResult: (text: string) => void, onError?: (error: any) => void): void {
    if (!this.isSupported) {
      onError?.(new Error('Speech recognition not supported'))
      return
    }

    // 如果已经在录音,先停止
    if (this.isRecording) {
      console.log('语音识别已在运行,先停止...')
      this.recognition.stop()
      // 等待一小段时间后再启动
      setTimeout(() => {
        this.startRecognition(onResult, onError)
      }, 300)
      return
    }

    this.startRecognition(onResult, onError)
  }

  private startRecognition(onResult: (text: string) => void, onError?: (error: any) => void): void {
    let finalTranscript = ''
    let interimTranscript = ''
    let silenceTimer: NodeJS.Timeout | null = null
    
    this.recognition.onresult = (event: any) => {
      interimTranscript = ''
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
          console.log('识别到完整内容:', transcript)
        } else {
          interimTranscript += transcript
          console.log('识别中:', transcript)
        }
      }
      
      // 清除之前的静默计时器
      if (silenceTimer) {
        clearTimeout(silenceTimer)
      }
      
      // 设置新的静默计时器：2秒没有新的语音输入就停止
      silenceTimer = setTimeout(() => {
        if (finalTranscript.trim()) {
          console.log('最终识别结果:', finalTranscript)
          this.stop()
          onResult(finalTranscript.trim())
        }
      }, 2000)
    }

    this.recognition.onerror = (event: any) => {
      console.error('语音识别错误:', event.error)
      this.isRecording = false
      if (silenceTimer) {
        clearTimeout(silenceTimer)
      }
      
      if (event.error === 'aborted' || event.error === 'no-speech') {
        // 没有检测到语音
        onError?.(new Error('未检测到语音，请重试'))
        return
      }
      
      if (event.error === 'network') {
        onError?.(new Error('网络错误，请检查网络连接'))
        return
      }
      
      onError?.(new Error('语音识别失败: ' + event.error))
    }

    this.recognition.onspeechend = () => {
      console.log('检测到语音结束')
      // 语音结束后再等1秒
      if (silenceTimer) {
        clearTimeout(silenceTimer)
      }
      silenceTimer = setTimeout(() => {
        if (finalTranscript.trim()) {
          this.stop()
          onResult(finalTranscript.trim())
        }
      }, 1000)
    }

    try {
      this.recognition.start()
      this.isRecording = true
      console.log('🎤 语音识别已启动 - 请开始说话')
    } catch (error) {
      console.error('启动语音识别失败:', error)
      this.isRecording = false
      onError?.(error)
    }
  }

  stop(): void {
    if (this.recognition && this.isRecording) {
      try {
        this.recognition.stop()
        this.isRecording = false
        console.log('语音识别已停止')
      } catch (error) {
        console.error('停止语音识别失败:', error)
      }
    }
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording
  }
}

// iFlytek Voice Recognition (for better Chinese support)
export interface IFlyTekConfig {
  appId: string
  apiKey: string
  apiSecret: string
}

export class IFlyTekVoiceRecognition {
  private config: IFlyTekConfig
  private websocket: WebSocket | null = null

  constructor(config: IFlyTekConfig) {
    this.config = config
  }

  async startRecording(onResult: (text: string) => void, onError?: (error: any) => void): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const processor = audioContext.createScriptProcessor(4096, 1, 1)

      // Connect to iFlytek WebSocket API
      const url = await this.getWebSocketUrl()
      this.websocket = new WebSocket(url)

      this.websocket.onopen = () => {
        console.log('WebSocket connected')
      }

      this.websocket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.data && data.data.result) {
          const text = data.data.result.ws.map((w: any) => w.cw.map((c: any) => c.w).join('')).join('')
          onResult(text)
        }
      }

      this.websocket.onerror = (error) => {
        onError?.(error)
      }

      processor.onaudioprocess = (e) => {
        if (this.websocket?.readyState === WebSocket.OPEN) {
          const inputData = e.inputBuffer.getChannelData(0)
          const pcmData = this.convertToPCM(inputData)
          this.websocket.send(JSON.stringify({
            data: {
              status: 1,
              format: 'audio/L16;rate=16000',
              audio: this.arrayBufferToBase64(pcmData),
              encoding: 'raw'
            }
          }))
        }
      }

      source.connect(processor)
      processor.connect(audioContext.destination)
    } catch (error) {
      onError?.(error)
    }
  }

  stopRecording(): void {
    if (this.websocket) {
      this.websocket.send(JSON.stringify({
        data: { status: 2 }
      }))
      this.websocket.close()
      this.websocket = null
    }
  }

  private async getWebSocketUrl(): Promise<string> {
    // This would need proper implementation with signature generation
    // For now, return a placeholder
    const host = 'iat-api.xfyun.cn'
    const path = '/v2/iat'
    return `wss://${host}${path}`
  }

  private convertToPCM(float32Array: Float32Array): ArrayBuffer {
    const int16Array = new Int16Array(float32Array.length)
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]))
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff
    }
    return int16Array.buffer
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }
}

// Text-to-Speech for expense voice input
export function speakText(text: string): void {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    window.speechSynthesis.speak(utterance)
  }
}

"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic, StopCircle, Volume2, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage, languages } from "@/components/language-provider"

export function VoiceTranslator() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordedText, setRecordedText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [targetLanguage, setTargetLanguage] = useState("en")
  const { currentLanguage } = useLanguage()
  const { toast } = useToast()

  // Mock recording timeout
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleStartRecording = () => {
    setIsRecording(true)

    // In a real app, this would use the Web Speech API
    // For demo purposes, we'll simulate recording with a timeout
    recordingTimeoutRef.current = setTimeout(() => {
      setIsRecording(false)

      // Simulate detected speech based on the user's language
      let detectedText = ""

      if (currentLanguage.code === "es") {
        detectedText = "Necesito ayuda para completar este formulario para la escuela de mi hijo."
      } else if (currentLanguage.code === "zh") {
        detectedText = "我需要帮助填写我孩子的学校表格。"
      } else {
        detectedText = "I need help completing this form for my child's school."
      }

      setRecordedText(detectedText)

      // Simulate translation
      let translated = ""

      if (targetLanguage === "en") {
        translated = "I need help completing this form for my child's school."
      } else if (targetLanguage === "es") {
        translated = "Necesito ayuda para completar este formulario para la escuela de mi hijo."
      } else if (targetLanguage === "zh") {
        translated = "我需要帮助填写我孩子的学校表格。"
      } else {
        translated = "I need help completing this form for my child's school."
      }

      setTranslatedText(translated)

      toast({
        title: "Voice recorded",
        description: "Your message has been recorded and translated.",
      })
    }, 3000)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current)
    }
  }

  const handlePlayTranslation = () => {
    setIsPlaying(true)

    // In a real app, this would use the Web Speech API
    // For demo purposes, we'll simulate playback with a timeout
    setTimeout(() => {
      setIsPlaying(false)
      toast({
        title: "Translation played",
        description: "The translated message has been played.",
      })
    }, 2000)
  }

  const handleCopyTranslation = () => {
    navigator.clipboard.writeText(translatedText)
    toast({
      title: "Copied to clipboard",
      description: "The translated text has been copied to your clipboard.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Voice Translator</CardTitle>
          <CardDescription>Speak in your language and translate for officials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Your Language</label>
                <div className="p-2 border rounded-md bg-muted/50">{currentLanguage.name}</div>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Translate To</label>
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border rounded-md p-4 flex flex-col items-center justify-center min-h-[150px]">
              {isRecording ? (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-2 mx-auto animate-pulse">
                    <Mic className="h-8 w-8 text-red-500 dark:text-red-300" />
                  </div>
                  <p className="text-sm font-medium">Recording...</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={handleStopRecording}>
                    <StopCircle className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="lg" className="gap-2" onClick={handleStartRecording}>
                  <Mic className="h-5 w-5" />
                  Start Speaking
                </Button>
              )}
            </div>

            {recordedText && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">You said ({currentLanguage.name}):</label>
                  <div className="p-3 border rounded-md bg-muted/30 min-h-[60px]">{recordedText}</div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium">
                      Translation ({languages.find((l) => l.code === targetLanguage)?.name}):
                    </label>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleCopyTranslation}>
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy</span>
                      </Button>
                    </div>
                  </div>
                  <div className="p-3 border rounded-md bg-primary/10 min-h-[60px]">{translatedText}</div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={handlePlayTranslation}
                    disabled={isPlaying}
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    {isPlaying ? "Playing..." : "Play Translation"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Common Phrases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              "I've completed all the required forms.",
              "I need more time to gather these documents.",
              "Could you please explain this section?",
              "I don't understand this requirement.",
              "When is the deadline for submission?",
            ].map((phrase, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left h-auto py-2"
                onClick={() => {
                  setRecordedText(phrase)

                  // Simulate translation
                  let translated = ""
                  if (targetLanguage === "es") {
                    translated = [
                      "He completado todos los formularios requeridos.",
                      "Necesito más tiempo para reunir estos documentos.",
                      "¿Podría explicar esta sección por favor?",
                      "No entiendo este requisito.",
                      "¿Cuándo es la fecha límite para la presentación?",
                    ][index]
                  } else if (targetLanguage === "zh") {
                    translated = [
                      "我已完成所有必需的表格。",
                      "我需要更多时间来收集这些文件。",
                      "请您解释一下这个部分？",
                      "我不明白这个要求。",
                      "提交的截止日期是什么时候？",
                    ][index]
                  } else {
                    translated = phrase
                  }

                  setTranslatedText(translated)
                }}
              >
                {phrase}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


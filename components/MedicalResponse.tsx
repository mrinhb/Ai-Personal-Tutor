interface MedicalResponseProps {
  content: string
}

export function MedicalResponse({ content }: MedicalResponseProps) {
  return (
    <div className="text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
      {content}
    </div>
  )
} 
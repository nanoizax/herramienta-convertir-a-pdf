import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Download } from "lucide-react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import FileDropZone from "@/components/tools/FileDropZone";
import { Button } from "@/components/ui/button";
import { convertToPdf, detectSource } from "@/lib/tools/convertToPdf";

const ConvertirAPdfPage = () => {
  const { t } = useTranslation("tools");

  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultName, setResultName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFile = (selected: File) => {
    setResultUrl(null);
    setError(null);
    if (detectSource(selected) === "unsupported") {
      setError(t("ui.error_unsupported_format"));
      setFile(null);
      return;
    }
    setFile(selected);
  };

  const handleConvert = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    try {
      const blob = await convertToPdf(file);
      setResultUrl(URL.createObjectURL(blob));
      const base = file.name.replace(/\.[^.]+$/, "");
      setResultName(`${base}.pdf`);
    } catch {
      setError(t("ui.error_generic"));
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResultUrl(null);
    setError(null);
  };

  return (
    <ToolPageLayout toolId="convertir-a-pdf">
      <div className="border border-neutral-800 rounded-xl p-6 md:p-8">
        {!file ? (
          <FileDropZone
            accept=".docx,.txt,image/jpeg,image/png,image/webp,text/plain"
            label={t("ui.upload_label_to_pdf")}
            hint={t("ui.upload_hint_to_pdf")}
            onFile={handleFile}
            toolId="convertir-a-pdf"
          />
        ) : (
          <div className="space-y-6">
            <div className="text-sm text-neutral-400 truncate">{file.name}</div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex flex-wrap gap-3">
              {!resultUrl ? (
                <Button
                  onClick={handleConvert}
                  isLoading={processing}
                  loadingText={t("ui.processing")}
                  className="bg-white text-black hover:bg-white/80 rounded-full px-8"
                >
                  {t("ui.convert_to_pdf_button")}
                </Button>
              ) : (
                <a href={resultUrl} download={resultName}>
                  <Button className="bg-white text-black hover:bg-white/80 rounded-full px-8">
                    <Download className="w-4 h-4" />
                    {t("ui.download_button")}
                  </Button>
                </a>
              )}
              <Button
                variant="outline"
                onClick={reset}
                className="rounded-full px-8 border-neutral-700 text-white bg-transparent hover:bg-white/10"
              >
                {t("ui.reset_button_file")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
};

export default ConvertirAPdfPage;

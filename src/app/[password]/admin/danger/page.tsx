"use client";

import { downloadDatabase, resetDatabase } from "@/data";
import { ReactNode, useCallback } from "react";
import { Slide, toast, ToastContainer } from "react-toastify";

export default function Danger() {
  const handleDownload = useCallback(async () => {
    try {
      const result = await downloadDatabase();

      if (!result.success || !result.data) {
        toast.error(`Download failed: ${result.error || "Unknown error"}`);
        return;
      }

      const byteCharacters = atob(result.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: result.mimeType });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Download failed: ${message}`);
      console.error("Download error:", error);
    }
  }, []);

  const handleReset = useCallback(() => {
    toast.warning(
      "WARNING: This will permanently delete ALL database content. " +
        "Are you ABSOLUTELY sure?",
      {
        autoClose: false,
        closeButton: ToastButtons({
          onOk: async () => {
            const result = await resetDatabase();
            if (!result.success) {
              toast.error(result.message);
              console.error("Reset error:", result);
              return;
            }
            toast.success(result.message, { closeButton: false });
          },
        }),
      }
    );
  }, []);

  return (
    <div className="danger-page">
      <h1>
        Danger Zone
        <br />
        IT Admin Only
      </h1>
      <button className="validate" onClick={handleDownload}>
        Download Database
      </button>
      <button className="danger" onClick={handleReset}>
        Reset Database
      </button>
      <ToastContainer transition={Slide} position="top-center" />
    </div>
  );
}

function ToastButtons({
  onOk,
}: {
  onOk: () => void;
}): ({ closeToast }: { closeToast: () => void }) => ReactNode {
  const ToastButtonsResult = ({ closeToast }: { closeToast: () => void }) => (
    <>
      <button
        className="danger"
        onClick={() => {
          onOk();
          closeToast();
        }}
      >
        Yes
      </button>
      <button className="validate" onClick={closeToast}>
        No
      </button>
    </>
  );
  return ToastButtonsResult;
}

"use client";

import { useState, useEffect, useCallback } from "react";

export type CameraPermissionStatus = "granted" | "denied" | "prompt" | "unsupported" | "loading";

export function useCameraPermissions() {
  const [status, setStatus] = useState<CameraPermissionStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  const checkPermission = useCallback(async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus("unsupported");
      return;
    }

    try {
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const permissionResult = await navigator.permissions.query({ name: "camera" as PermissionName });
          setStatus(permissionResult.state as CameraPermissionStatus);
          
          permissionResult.onchange = () => {
            setStatus(permissionResult.state as CameraPermissionStatus);
          };
          return;
        } catch {
          // Fallback if permissions.query fails for camera name
        }
      }

      setStatus("prompt");
    } catch (err: any) {
      setError(err?.message || "Failed to query camera permission");
      setStatus("prompt");
    }
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus("unsupported");
      setError("Camera API is not supported in this browser.");
      return false;
    }

    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      stream.getTracks().forEach((track) => track.stop());
      setStatus("granted");
      return true;
    } catch (err: any) {
      console.error("Camera permission error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setStatus("denied");
        setError("Camera permission was denied. Please enable it in your browser settings.");
      } else {
        setStatus("denied");
        setError(err?.message || "Could not access camera.");
      }
      return false;
    }
  }, []);

  return {
    status,
    error,
    requestPermission,
    checkPermission,
  };
}

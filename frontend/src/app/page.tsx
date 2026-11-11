'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Toolbar } from '../components/editor/Toolbar';
import { LeftSidebar } from '../components/editor/LeftSidebar';
import { Canvas } from '../components/editor/Canvas';
import { RightSidebar } from '../components/editor/RightSidebar';
import { useEditorStore } from '../stores/editorStore';

function EditorStudioContent() {
  const searchParams = useSearchParams();
  const loadTemplate = useEditorStore((s) => s.loadTemplate);

  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId) {
      loadTemplate(templateId);
    }
  }, [searchParams, loadTemplate]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Top Main Toolbar */}
      <Toolbar />

      {/* Main Studio Viewport */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Elements / Layers / AI Sidebar */}
        <LeftSidebar />

        {/* Center Visual Canvas */}
        <Canvas />

        {/* Right Properties Inspector */}
        <RightSidebar />
      </div>
    </div>
  );
}

export default function EditorStudioPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-slate-900 text-white font-mono text-xs">Loading Studio...</div>}>
      <EditorStudioContent />
    </Suspense>
  );
}

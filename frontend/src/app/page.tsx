'use client';

import React from 'react';
import { Toolbar } from '../components/editor/Toolbar';
import { LeftSidebar } from '../components/editor/LeftSidebar';
import { Canvas } from '../components/editor/Canvas';
import { RightSidebar } from '../components/editor/RightSidebar';

export default function EditorStudioPage() {
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

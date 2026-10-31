'use client';

import React from 'react';
import EditorStudioPage from '../../page';

export default function WebsiteEditorRoute({ params }: { params: { websiteId: string } }) {
  // Renders the full Visual Studio Editor for the website ID
  return <EditorStudioPage />;
}
